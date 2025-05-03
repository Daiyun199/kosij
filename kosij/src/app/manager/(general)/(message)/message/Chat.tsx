"use client";
import React, { useState, useEffect, useRef } from "react";
import { List, Input, Button, Avatar, message, AutoComplete } from "antd";
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
  const [managerId] = useState<string>("MAN-000");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversations, setSelectedConversations] = useState<
    Conversation[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchAllMessages = async () => {
    const token = getAuthToken();
    if (!token) {
      console.log("No auth token for fetching messages");
      message.error("Authentication error: Please log in again.");
      return;
    }
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
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      message.error("Failed to fetch chat history.");
    }
  };

  const handleSearch = (value: string) => {
    console.log(`Search input changed: "${value}"`);
    setSearchQuery(value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelect = (value: string, option: any) => {
    const conversation: Conversation = {
      userId: option.userId,
      userName: value,
      lastMessage: "",
      timestamp: "",
      isUnread: false,
    };
    console.log(
      `Selected conversation: userId=${conversation.userId}, userName=${conversation.userName}`
    );
    setSelectedUserId(conversation.userId);
    setSelectedConversations((prev) => {
      if (!prev.some((c) => c.userId === conversation.userId)) {
        return [...prev, conversation];
      }
      return prev;
    });
    setSearchQuery("");
  };

  const markMessagesAsRead = async (fromUserId: string) => {
    console.log(`Marking messages as read for fromUserId: ${fromUserId}`);
    setIsMarkingRead(true);
    const token = getAuthToken();
    if (!token) {
      console.log("No auth token for marking messages");
      message.error("Authentication error: Please log in again.");
      return;
    }
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

      await fetchAllMessages();
      console.log(`Successfully marked messages as read for ${fromUserId}`);
    } catch (error) {
      console.error(
        `Failed to mark messages as read for ${fromUserId}:`,
        error
      );
      message.error("Failed to mark messages as read.");
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
      setTimeout(() => {
        setIsMarkingRead(false);
        console.log("Re-enabled polling after mark read");
      }, 2000);
    }
  };

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

  const getUserName = (msg: Message): string => {
    const isSentByManager = msg.fromUserId === managerId;
    const otherUserId = isSentByManager ? msg.toUserId : msg.fromUserId;
    console.log(
      `Getting userName for otherUserId: ${otherUserId}, isSentByManager: ${isSentByManager}`
    );

    const relatedMsg = chatHistory.find(
      (m) => m.fromUserId === otherUserId && !m.createdBy.startsWith("Manager")
    );

    if (relatedMsg) {
      console.log(`Using relatedMsg.createdBy: ${relatedMsg.createdBy}`);
      return relatedMsg.createdBy;
    }

    const fallback = isSentByManager
      ? msg.toUserId
      : msg.createdBy || otherUserId;
    console.log(`Using fallback name: ${fallback}`);
    return fallback;
  };

  const getUserIdFromUserName = (userName: string): string => {
    const farmBreederMap: { [key: string]: string } = {
      "Ito Koi Farm": "FAR-10",
      "Saito Koi Farm": "FAR-009",
      "Ojiya Nishikigoi Farm": "FAR-003",
      "Omoiya Koi Farm": "FAR-008",
      "Taniguchi Koi Farm": "FAR-15",
      "Dainchi Koi Farm": "FAR-001",
      "Konoike Koi Farm": "FAR-007",
      "Okawa Koi Farm": "FAR-13",
      "Yamaguchi Koi Farm": "FAR-005",
      "Inoue Koi Farm": "FAR-14",
      "Marukin Koi Farm": "FAR-002",
      "Shintaro Koi Farm": "FAR-011",
      "Isa Koi Farm": "FAR-004",
      "Yamatoya Koi Farm": "FAR-012",
      "Nishimura Koi Farm": "FAR-006",
    };

    if (farmBreederMap[userName]) {
      return farmBreederMap[userName];
    }

    const match = userName.match(
      /(Sales Staff|Delivery Staff|Consulting Staff)\s(\d+)/
    );
    if (match) {
      const role = match[1];
      const number = match[2].padStart(3, "0");
      switch (role) {
        case "Sales Staff":
          return `SAL-${number}`;
        case "Delivery Staff":
          return `DEL-${number}`;
        case "Consulting Staff":
          return `CON-${number}`;
        default:
          return userName;
      }
    }

    return userName;
  };

  const getConversations = (): Conversation[] => {
    console.log("Generating conversations, managerId:", managerId);
    const convoMap = new Map<string, Conversation>();

    if (chatHistory.length > 0) {
      const userMessages = new Map<string, Message[]>();
      chatHistory.forEach((msg) => {
        const userId =
          msg.fromUserId === managerId ? msg.toUserId : msg.fromUserId;
        if (!userMessages.has(userId)) {
          userMessages.set(userId, []);
        }
        userMessages.get(userId)!.push(msg);
      });

      userMessages.forEach((messages, userId) => {
        const latestMsg = messages.sort(
          (a, b) =>
            new Date(b.createdTime).getTime() -
            new Date(a.createdTime).getTime()
        )[0];

        const userName = getUserName(latestMsg);
        if (!userName || userName === "Unknown") {
          console.log(
            `Skipping conversation: userId=${userId}, userName=${userName}, messageId=${latestMsg.id}`
          );
          return;
        }

        const isUnread = messages.some(
          (msg) => !msg.isRead && !msg.createdBy.startsWith("Manager")
        );
        console.log(
          `Adding conversation from chat: userId=${userId}, userName=${userName}, lastMessage=${latestMsg.content}, isUnread=${isUnread}`
        );

        convoMap.set(userId, {
          userId,
          userName,
          lastMessage: latestMsg.content,
          timestamp: latestMsg.createdTime,
          isUnread,
        });
      });
    }

    selectedConversations.forEach((conv) => {
      convoMap.set(conv.userId, conv);
    });

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const roles = [
        { name: "Sales Staff", prefix: "SAL", count: 5 },
        { name: "Delivery Staff", prefix: "DEL", count: 5 },
        { name: "Consulting Staff", prefix: "CON", count: 5 },
      ];

      const farmBreeders = [
        "Ito Koi Farm",
        "Saito Koi Farm",
        "Ojiya Nishikigoi Farm",
        "Omoiya Koi Farm",
        "Taniguchi Koi Farm",
        "Dainchi Koi Farm",
        "Konoike Koi Farm",
        "Okawa Koi Farm",
        "Yamaguchi Koi Farm",
        "Inoue Koi Farm",
        "Marukin Koi Farm",
        "Shintaro Koi Farm",
        "Isa Koi Farm",
        "Yamatoya Koi Farm",
        "Nishimura Koi Farm",
      ];

      roles.forEach((role) => {
        if (role.name.toLowerCase().includes(query)) {
          for (let i = 1; i <= role.count; i++) {
            const userName = `${role.name} ${i}`;
            const userId = `${role.prefix}-${i.toString().padStart(3, "0")}`;
            console.log(
              `Adding virtual conversation: userId=${userId}, userName=${userName}`
            );
            convoMap.set(userId, {
              userId,
              userName,
              lastMessage: "",
              timestamp: "",
              isUnread: false,
            });
          }
        }
      });

      farmBreeders.forEach((name) => {
        if (name.toLowerCase().includes(query)) {
          const userId = getUserIdFromUserName(name);
          console.log(
            `Adding virtual conversation: userId=${userId}, userName=${name}`
          );
          convoMap.set(userId, {
            userId,
            userName: name,
            lastMessage: "",
            timestamp: "",
            isUnread: false,
          });
        }
      });
    }

    const conversations = Array.from(convoMap.values());
    console.log(
      "Generated conversations:",
      JSON.stringify(conversations, null, 2)
    );
    return conversations;
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
    if (!newMessage.trim() || !selectedUserId || !managerId) {
      console.log("Cannot send message:", {
        newMessage,
        selectedUserId,
        managerId,
      });
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to send message:", error);
      message.error(error.response?.data?.message || "Failed to send message.");
    }
  };

  const handleConversationClick = (conversation: Conversation) => {
    console.log(
      `Clicked conversation: userId=${conversation.userId}, isUnread=${conversation.isUnread}`
    );
    setSelectedUserId(conversation.userId);
    if (conversation.isUnread) {
      markMessagesAsRead(conversation.userId);
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
        <AutoComplete
          style={{ width: "100%" }}
          value={searchQuery}
          onChange={handleSearch}
          onSelect={handleSelect}
          placeholder="Search users..."
          allowClear
          options={getConversations().map((conv) => ({
            value: conv.userName,
            label: conv.userName,
            userId: conv.userId,
          }))}
        />
        {getConversations().length > 0 ? (
          <List
            dataSource={getConversations()}
            renderItem={(conversation) => (
              <List.Item
                onClick={() => handleConversationClick(conversation)}
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
                    conversation.lastMessage ? (
                      <>
                        <div
                          className={conversation.isUnread ? "font-bold" : ""}
                        >
                          {conversation.lastMessage}
                        </div>
                        <div style={{ fontSize: "12px", color: "#888" }}>
                          {conversation.timestamp
                            ? new Date(
                                conversation.timestamp
                              ).toLocaleTimeString()
                            : ""}
                        </div>
                      </>
                    ) : (
                      <div>No messages yet</div>
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
