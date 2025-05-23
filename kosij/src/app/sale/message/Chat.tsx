"use client";
import React, { useState, useEffect, useRef } from "react";
import { List, Input, Button, Avatar, AutoComplete } from "antd";
import { SendOutlined } from "@ant-design/icons";
import styles from "./Chat.module.css";
import { useAuth } from "@/app/AuthProvider";
import { getAuthToken } from "@/lib/utils/auth.utils";
import api from "@/config/axios.config";
import { useSearchParams } from "next/navigation";

interface Message {
  id: number;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserId: string;
  toUserName: string;
  toUserAvatar: string;
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
  const [salesStaffId, setSalesStaffId] = useState<string | null>("SAL-001");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversations, setSelectedConversations] = useState<
    Conversation[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

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
        const isFromSales = firstMsg.createdBy?.startsWith("Sales Staff");
        const staffId = isFromSales ? firstMsg.fromUserId : firstMsg.toUserId;
        setSalesStaffId(staffId);
        console.log(`Set salesStaffId: ${staffId}`);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

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

      setChatHistory((prev) => {
        const updated = prev.map((msg) =>
          msg.fromUserId === fromUserId &&
          !msg.createdBy.startsWith("Sales Staff")
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
      setChatHistory((prev) => {
        const updated = prev.map((msg) =>
          msg.fromUserId === fromUserId &&
          !msg.createdBy.startsWith("Sales Staff")
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
    const userId = searchParams.get("userId");
    const userName = searchParams.get("userName");

    if (userId && userName) {
      setSelectedUserId(userId);
      setSelectedUserName(decodeURIComponent(userName));
      console.log(`Pre-selected user: userId=${userId}, userName=${userName}`);
    }
  }, [searchParams]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAuthenticated && userRole === "salesstaff" && !isMarkingRead) {
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

  const getUserName = (msg: Message, salesStaffId: string | null): string => {
    if (!salesStaffId) return "Unknown";

    const isSentBySales = msg.fromUserId === salesStaffId;
    const otherUserId = isSentBySales ? msg.toUserId : msg.fromUserId;

    const relatedMsg = chatHistory.find(
      (m) =>
        m.fromUserId === otherUserId && !m.createdBy.startsWith("Sales Staff")
    );

    if (relatedMsg) {
      return relatedMsg.createdBy;
    }

    return isSentBySales ? msg.toUserName : msg.createdBy;
  };

  const getUserIdFromUserName = (userName: string): string => {
    if (userName === "Manager") {
      return "MAN-000";
    }

    const match = userName.match(/(Consulting Staff|Delivery Staff)\s(\d+)/);
    if (match) {
      const role = match[1];
      const number = match[2].padStart(3, "0");
      switch (role) {
        case "Consulting Staff":
          return `CON-${number}`;
        case "Delivery Staff":
          return `DEL-${number}`;
        default:
          return userName;
      }
    }

    return userName;
  };

  const getConversations = (): Conversation[] => {
    console.log("Generating conversations, salesStaffId:", salesStaffId);
    const convoMap = new Map<string, Conversation>();

    if (chatHistory.length > 0) {
      const userMessages = new Map<string, Message[]>();
      chatHistory.forEach((msg) => {
        const userId =
          msg.fromUserId === salesStaffId ? msg.toUserId : msg.fromUserId;
        if (!userMessages.has(userId)) {
          userMessages.set(userId, []);
        }
        userMessages.get(userId)!.push(msg);
      });

      userMessages.forEach((messages, userId) => {
        if (!salesStaffId) return;

        const latestMsg = messages.sort(
          (a, b) =>
            new Date(b.createdTime).getTime() -
            new Date(a.createdTime).getTime()
        )[0];

        const userName = getUserName(latestMsg, salesStaffId);
        if (!userName || userName === "Unknown") {
          console.log(
            `Skipping conversation: userId=${userId}, userName=${userName}, messageId=${latestMsg.id}`
          );
          return;
        }

        const isUnread = messages.some(
          (msg) => !msg.isRead && !msg.createdBy.startsWith("Sales Staff")
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
        { name: "Consulting Staff", count: 5 },
        { name: "Delivery Staff", count: 5 },
        { name: "Manager", count: 1 },
      ];

      roles.forEach((role) => {
        if (role.name.toLowerCase().includes(query)) {
          const count = role.name === "Manager" ? 1 : role.count;
          for (let i = 1; i <= count; i++) {
            const userName =
              role.name === "Manager" ? "Manager" : `${role.name} ${i}`;
            const userId = getUserIdFromUserName(userName);
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
    }

    const conversations = Array.from(convoMap.values());
    console.log(
      "Generated conversations:",
      JSON.stringify(conversations, null, 2)
    );
    return conversations;
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
    setSelectedUserName(conversation.userName);
    setSelectedConversations((prev) => {
      if (!prev.some((c) => c.userId === conversation.userId)) {
        return [...prev, conversation];
      }
      return prev;
    });
    setSearchQuery("");
    fetchAllMessages()
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

      const newMsg: Message = {
        id: Date.now(),
        fromUserId: salesStaffId,
        fromUserName: "Sales Staff",
        fromUserAvatar: "",
        toUserId: selectedUserId,
        toUserName: selectedUserName || "",
        toUserAvatar: "",
        content: newMessage,
        isRead: false,
        createdTime: new Date().toISOString(),
        createdBy: `Sales Staff`,
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

  if (!isAuthenticated || userRole !== "salesstaff") {
    return <div>Please log in as a sales staff to access the chat.</div>;
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
        <h2>Chat with {selectedUserName || "..."}</h2>
        <div className={styles.messageList}>
          {filteredMessages.length > 0 || selectedUserId ? (
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
          style={{ width: "100%", marginBottom: "16px" }}
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
        <List
          dataSource={getConversations()}
          renderItem={(conversation) => (
            <List.Item
              onClick={() => {
                console.log(
                  `Clicked conversation: userId=${conversation.userId}, isUnread=${conversation.isUnread}`
                );
                setSelectedUserId(conversation.userId);
                setSelectedUserName(conversation.userName);
                if (conversation.isUnread) {
                  markMessagesAsRead(conversation.userId);
                }
              }}
              className={conversation.isUnread ? styles.unreadConversation : ""}
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
                      <div className={conversation.isUnread ? "font-bold" : ""}>
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
      </div>
    </div>
  );
};

export default Chat;
