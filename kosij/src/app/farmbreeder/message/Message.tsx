"use client";
import React, { useState, useEffect, useRef } from "react";
import { List, Input, Button, Avatar, message } from "antd";
import { SendOutlined } from "@ant-design/icons";
import styles from "./Chat.module.css";
import { useAuth } from "@/app/AuthProvider";
import { getAuthToken } from "@/lib/utils/auth.utils";
import api from "@/config/axios.config";
import { useSearchParams } from "next/navigation";

interface Message {
  id: number;
  fromUserId: string;
  toUserId: string;
  content: string;
  isRead: boolean;
  createdTime: string;
  createdBy: string;
}

const Message: React.FC = () => {
  const { isAuthenticated, userRole } = useAuth();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const userName = searchParams.get("userName");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [farmUserId, setFarmUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchAllMessages = async () => {
    const token = getAuthToken();
    try {
      const response = await api.get(`/chat/history`, {
        headers: {
          accept: "text/plain",
          Authorization: `Bearer ${token}`,
        },
      });
      const messages = response.data.value || [];
      console.log("Fetched chatHistory:", JSON.stringify(messages, null, 2));
      setChatHistory(messages);

      const firstMsg = messages.find(Boolean);
      if (firstMsg && !farmUserId) {
        const isFromUser = firstMsg.createdBy?.endsWith("Farm");
        const id = isFromUser ? firstMsg.fromUserId : firstMsg.toUserId;
        setFarmUserId(id);
        console.log(`Set farmUserId: ${id}`);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      message.error("Failed to fetch chat history.");
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAuthenticated && userRole === "farmbreeder") {
      fetchAllMessages();
      interval = setInterval(() => {
        console.log("Polling chatHistory");
        fetchAllMessages();
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [isAuthenticated, userRole]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !userId || !farmUserId) {
      console.log("Cannot send message:", { newMessage, userId, farmUserId });
      message.error("Cannot send message: Missing user information.");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      console.log("No auth token available");
      message.error("Authentication error: Please log in again.");
      return;
    }

    try {
      await api.post(
        "/chat/send",
        {
          toUserId: userId,
          content: newMessage,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "text/plain",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newMsg: Message = {
        id: Date.now(),
        fromUserId: farmUserId,
        toUserId: userId,
        content: newMessage,
        isRead: false,
        createdTime: new Date().toISOString(),
        createdBy: `Farm Breeder`,
      };
      setChatHistory((prev) => {
        const updated = [...prev, newMsg];
        console.log(
          "Updated chatHistory after sending:",
          JSON.stringify(updated, null, 2)
        );
        return updated;
      });
      setNewMessage("");
      scrollToBottom();

      await fetchAllMessages();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to send message:", error);
      message.error(error.response?.data?.message || "Failed to send message.");
    }
  };

  const filteredMessages = chatHistory.filter(
    (msg) =>
      (msg.fromUserId === userId && msg.toUserId === farmUserId) ||
      (msg.toUserId === userId && msg.fromUserId === farmUserId)
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages]);

  if (!isAuthenticated || userRole !== "farmbreeder") {
    return <div>Please log in as a farm breeder to access the chat.</div>;
  }

  if (!userId || !userName) {
    return <div>Invalid user information.</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        maxWidth: "90vw",
        margin: "0 auto",
      }}
    >
      <div
        className={styles.chatContainer}
        style={{ flex: 3, marginRight: "20px" }}
      >
        <h2>Chat with {decodeURIComponent(userName)}</h2>
        <div className={styles.messageList}>
          {filteredMessages.length > 0 ? (
            <List
              dataSource={filteredMessages}
              renderItem={(message) => (
                <List.Item
                  style={{
                    justifyContent:
                      message.fromUserId === farmUserId
                        ? "flex-end"
                        : "flex-start",
                    display: "flex",
                  }}
                >
                  <div
                    className={`${styles.messageBubble} ${
                      message.fromUserId === farmUserId
                        ? styles.sent
                        : styles.received
                    }`}
                  >
                    <List.Item.Meta
                      avatar={<Avatar>{message.createdBy.charAt(0)}</Avatar>}
                      title={message.createdBy}
                      description={
                        <div>
                          <div>{message.content}</div>
                          <div style={{ fontSize: "12px", color: "#888" }}>
                            {new Date(message.createdTime).toLocaleTimeString()}
                          </div>
                        </div>
                      }
                    />
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <div>No messages yet. Start a conversation!</div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.inputContainer}>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            disabled={!newMessage.trim()}
            onClick={sendMessage}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Message;
