"use client";
import React, { useState, useEffect, useRef } from "react";
import { List, Input, Button, Avatar } from "antd";
import { SendOutlined } from "@ant-design/icons";
import styles from "./Chat.module.css";
import { useAuth } from "@/app/AuthProvider";
import { getAuthToken } from "@/lib/utils/auth.utils";
import api from "@/config/axios.config";

interface Message {
  id: number;
  fromUserId: string;
  toUserId: string;
  content: string;
  isRead: boolean;
  createdTime: string;
  createdBy: string;
}

interface Conversation {
  userId: string;
  userName: string;
  lastMessage: string;
  timestamp: string;
}

const Chat: React.FC = () => {
  const { isAuthenticated, userRole } = useAuth();
  const [salesStaffId, setSalesStaffId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
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

      const firstMsg = messages.find(Boolean);
      if (firstMsg) {
        const isFromSales = firstMsg.createdBy?.startsWith("Manager");
        const staffId = isFromSales ? firstMsg.fromUserId : firstMsg.toUserId;
        setSalesStaffId(staffId);
      }

      setChatHistory(messages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAuthenticated && userRole === "manager") {
      fetchAllMessages(); 

      interval = setInterval(() => {
        fetchAllMessages();
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [isAuthenticated, userRole]);

  const extractUserName = (name: string): string => {
    const roles = [
      "Sales Staff",
      "Manager",
      "Farm Breeder",
      "Consulting Staff",
      "Delivery Staff",
    ];

    for (const role of roles) {
      if (name.startsWith(role)) {
        return "";
      }
    }

    return name;
  };

  const getConversations = (): Conversation[] => {
    const convoMap = new Map<string, Conversation>();

    [...chatHistory].reverse().forEach((msg) => {
      const userId =
        msg.fromUserId === salesStaffId ? msg.toUserId : msg.fromUserId;

      if (!convoMap.has(userId)) {
        const rawName = msg.createdBy;
        const cleanName = extractUserName(rawName);

        if (!cleanName) return;
        convoMap.set(userId, {
          userId,
          userName: cleanName,
          lastMessage: msg.content,
          timestamp: msg.createdTime,
        });
      }
    });

    return Array.from(convoMap.values());
  };

  const filteredMessages = chatHistory.filter(
    (msg) =>
      (msg.fromUserId === selectedUserId && msg.toUserId === salesStaffId) ||
      (msg.toUserId === selectedUserId && msg.fromUserId === salesStaffId)
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId || !salesStaffId) return;

    const token = getAuthToken();
    try {
      await api.post(
        "/chat/send",
        {
          toUserId: selectedUserId,
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

      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now(),
          fromUserId: salesStaffId,
          toUserId: selectedUserId,
          content: newMessage,
          isRead: false,
          createdTime: new Date().toISOString(),
          createdBy: `Manager`, 
        },
      ]);
      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!isAuthenticated || userRole !== "manager") {
    return <div>Please log in as a sales staff to access the chat.</div>;
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div
          className={styles.chatContainer}
          style={{ flex: 3, marginRight: "20px" }}
        >
          <h2>Chat with {selectedUserId || "..."}</h2>
          <div className={styles.messageList}>
            <List
              dataSource={filteredMessages}
              renderItem={(message) => (
                <List.Item
                  style={{
                    justifyContent:
                      message.fromUserId === salesStaffId
                        ? "flex-end"
                        : "flex-start",
                    display: "flex",
                  }}
                >
                  <div
                    className={`${styles.messageBubble} ${
                      message.fromUserId === salesStaffId
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
              disabled={!newMessage.trim() || !selectedUserId}
              onClick={sendMessage}
            >
              Send
            </Button>
          </div>
        </div>

        <div className={styles.conversationList} style={{ flex: 1 }}>
          <h3>Conversations</h3>
          <List
            dataSource={getConversations()}
            renderItem={(conversation) => (
              <List.Item
                onClick={() => setSelectedUserId(conversation.userId)}
                style={{
                  cursor: "pointer",
                  background:
                    conversation.userId === selectedUserId
                      ? "#e6f7ff"
                      : "transparent",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              >
                <List.Item.Meta
                  avatar={<Avatar>{conversation.userName.charAt(0)}</Avatar>}
                  title={conversation.userName}
                  description={
                    <>
                      <div>{conversation.lastMessage}</div>
                      <div style={{ fontSize: "12px", color: "#888" }}>
                        {new Date(conversation.timestamp).toLocaleTimeString()}
                      </div>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
