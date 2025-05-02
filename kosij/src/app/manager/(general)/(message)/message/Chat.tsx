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
  isUnread: boolean;
}

const Chat: React.FC = () => {
  const { isAuthenticated, userRole } = useAuth();
  const [managerId, setManagerId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all chat history
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
      if (firstMsg) {
        const isFromManager = firstMsg.createdBy?.startsWith("Manager");
        const id = isFromManager ? firstMsg.fromUserId : firstMsg.toUserId;
        setManagerId(id);
        console.log(`Set managerId: ${id}`);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  // Mark messages as read for a user
  const markMessagesAsRead = async (fromUserId: string) => {
    console.log(`Marking messages as read for fromUserId: ${fromUserId}`);
    setIsMarkingRead(true);
    const token = getAuthToken();
    try {
      const response = await api.put(
        `/chat/mark-as-read`,
        { fromUserId },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "text/plain",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`Mark-as-read response:`, response.data);

      // Optimistic update: Mark all messages from fromUserId as read
      setChatHistory((prev) => {
        const updated = prev.map((msg) =>
          msg.fromUserId === fromUserId && !msg.createdBy.startsWith("Manager")
            ? { ...msg, isRead: true }
            : msg
        );
        console.log(
          "Updated chatHistory after marking read:",
          JSON.stringify(updated, null, 2)
        );
        return [...updated];
      });

      // Sync server state
      await fetchAllMessages();
      console.log(`Successfully marked messages as read for ${fromUserId}`);
    } catch (error) {
      console.error(
        `Failed to mark messages as read for ${fromUserId}:`,
        error
      );
      // Optimistic update even on failure
      setChatHistory((prev) => {
        const updated = prev.map((msg) =>
          msg.fromUserId === fromUserId && !msg.createdBy.startsWith("Manager")
            ? { ...msg, isRead: true }
            : msg
        );
        console.log(
          "Optimistic update after API failure:",
          JSON.stringify(updated, null, 2)
        );
        return [...updated];
      });
    } finally {
      // Delay re-enabling polling to avoid overwrite
      setTimeout(() => {
        setIsMarkingRead(false);
        console.log("Re-enabled polling after mark read");
      }, 2000);
    }
  };

  // Polling with pause during mark read
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAuthenticated && userRole === "manager" && !isMarkingRead) {
      fetchAllMessages();
      interval = setInterval(() => {
        if (!isMarkingRead) {
          console.log("Polling chatHistory");
          fetchAllMessages();
        } else {
          console.log("Polling paused during mark read");
        }
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [isAuthenticated, userRole, isMarkingRead]);

  // Get user name for the other participant
  const getUserName = (msg: Message, managerId: string | null): string => {
    if (!managerId) return "Unknown";

    const isSentByManager = msg.fromUserId === managerId;
    const otherUserId = isSentByManager ? msg.toUserId : msg.fromUserId;

    // Find a message from the other user to get their name
    const relatedMsg = chatHistory.find(
      (m) => m.fromUserId === otherUserId && !m.createdBy.startsWith("Manager")
    );

    if (relatedMsg) {
      return relatedMsg.createdBy;
    }

    // Fallback to createdBy or userId
    return isSentByManager ? msg.toUserId : msg.createdBy || otherUserId;
  };

  // Group messages by user
  const getConversations = (): Conversation[] => {
    console.log("Generating conversations, managerId:", managerId);
    const convoMap = new Map<string, Conversation>();

    // Group messages by userId
    const userMessages = new Map<string, Message[]>();
    chatHistory.forEach((msg) => {
      const userId =
        msg.fromUserId === managerId ? msg.toUserId : msg.fromUserId;
      if (!userMessages.has(userId)) {
        userMessages.set(userId, []);
      }
      userMessages.get(userId)!.push(msg);
    });

    // Process each user's messages
    userMessages.forEach((messages, userId) => {
      if (!managerId) return;

      // Get latest message
      const latestMsg = messages.sort(
        (a, b) =>
          new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
      )[0];

      const userName = getUserName(latestMsg, managerId);
      if (!userName || userName === "Unknown") {
        console.log(
          `Skipping conversation: userId=${userId}, userName=${userName}, messageId=${latestMsg.id}`
        );
        return;
      }

      // Check for unread messages
      const isUnread = messages.some(
        (msg) => !msg.isRead && !msg.createdBy.startsWith("Manager")
      );
      console.log(
        `Adding conversation: userId=${userId}, userName=${userName}, lastMessage=${latestMsg.content}, isUnread=${isUnread}`
      );

      convoMap.set(userId, {
        userId,
        userName,
        lastMessage: latestMsg.content,
        timestamp: latestMsg.createdTime,
        isUnread,
      });
    });

    return Array.from(convoMap.values());
  };

  const filteredMessages = chatHistory.filter(
    (msg) =>
      (msg.fromUserId === selectedUserId && msg.toUserId === managerId) ||
      (msg.toUserId === selectedUserId && msg.fromUserId === managerId)
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId || !managerId) return;

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

      const newMsg: Message = {
        id: Date.now(),
        fromUserId: managerId,
        toUserId: selectedUserId,
        content: newMessage,
        isRead: false,
        createdTime: new Date().toISOString(),
        createdBy: `Manager`,
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
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!isAuthenticated || userRole !== "manager") {
    return <div>Please log in as a manager to access the chat.</div>;
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
        <h2>
          Chat with{" "}
          {getConversations().find((c) => c.userId === selectedUserId)
            ?.userName || "..."}
        </h2>
        <div className={styles.messageList}>
          {filteredMessages.length > 0 ? (
            <List
              dataSource={filteredMessages}
              renderItem={(message) => (
                <List.Item
                  style={{
                    justifyContent:
                      message.fromUserId === managerId
                        ? "flex-end"
                        : "flex-start",
                    display: "flex",
                  }}
                >
                  <div
                    className={`${styles.messageBubble} ${
                      message.fromUserId === managerId
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
            <div>
              {selectedUserId
                ? "No messages yet. Start a conversation!"
                : "Select a conversation to start chatting."}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {selectedUserId && (
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
        )}
      </div>

      <div className={styles.conversationList} style={{ flex: 1 }}>
        <h3>Conversations</h3>
        {getConversations().length > 0 ? (
          <List
            dataSource={getConversations()}
            renderItem={(conversation) => (
              <List.Item
                onClick={() => {
                  console.log(
                    `Clicked conversation: userId=${conversation.userId}, isUnread=${conversation.isUnread}`
                  );
                  setSelectedUserId(conversation.userId);
                  if (conversation.isUnread) {
                    markMessagesAsRead(conversation.userId);
                  }
                }}
                className={
                  conversation.isUnread ? styles.unreadConversation : ""
                }
                style={{
                  cursor: "pointer",
                  background:
                    conversation.userId === selectedUserId
                      ? "#e6f7ff"
                      : "transparent",
                  borderRadius: "8px",
                  padding: "10px",
                  position: "relative",
                }}
              >
                <List.Item.Meta
                  avatar={<Avatar>{conversation.userName.charAt(0)}</Avatar>}
                  title={
                    conversation.isUnread ? (
                      <div className="font-bold">{conversation.userName}</div>
                    ) : (
                      <div>{conversation.userName}</div>
                    )
                  }
                  description={
                    conversation.isUnread ? (
                      <>
                        <div className="font-bold">
                          {conversation.lastMessage}
                        </div>
                        <div style={{ fontSize: "12px", color: "#888" }}>
                          {new Date(
                            conversation.timestamp
                          ).toLocaleTimeString()}
                        </div>
                      </>
                    ) : (
                      <>
                        <div>{conversation.lastMessage}</div>
                        <div style={{ fontSize: "12px", color: "#888" }}>
                          {new Date(
                            conversation.timestamp
                          ).toLocaleTimeString()}
                        </div>
                      </>
                    )
                  }
                />
                {conversation.isUnread && (
                  <span className={styles.unreadDot}></span>
                )}
              </List.Item>
            )}
          />
        ) : (
          <div>No conversations available.</div>
        )}
      </div>
    </div>
  );
};

export default Chat;
