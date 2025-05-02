// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { List, Input, Button, Avatar } from "antd";
// import { SendOutlined } from "@ant-design/icons";
// import styles from "./Chat.module.css";
// import { useAuth } from "@/app/AuthProvider";
// import { getAuthToken } from "@/lib/utils/auth.utils";
// import api from "@/config/axios.config";

// interface Message {
//   id: number;
//   fromUserId: string;
//   toUserId: string;
//   content: string;
//   isRead: boolean;
//   createdTime: string;
//   createdBy: string;
// }

// interface Conversation {
//   userId: string;
//   userName: string;
//   lastMessage: string;
//   timestamp: string;
// }

// const Chat: React.FC = () => {
//   const { isAuthenticated, userRole } = useAuth();
//   const [salesStaffId, setSalesStaffId] = useState<string | null>(null);
//   const [chatHistory, setChatHistory] = useState<Message[]>([]);
//   const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Fetch all chat history
//   const fetchAllMessages = async () => {
//     const token = getAuthToken();
//     try {
//       const response = await api.get(`/chat/history`, {
//         headers: {
//           accept: "text/plain",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const messages = response.data.value || [];

//       // Determine salesStaffId from messages
//       const firstMsg = messages.find(Boolean);
//       if (firstMsg) {
//         const isFromSales = firstMsg.createdBy?.startsWith("Sales Staff");
//         const staffId = isFromSales ? firstMsg.fromUserId : firstMsg.toUserId;
//         setSalesStaffId(staffId);
//       }

//       setChatHistory(messages);
//     } catch (error) {
//       console.error("Failed to fetch messages:", error);
//     }
//   };

//   useEffect(() => {
//     let interval: NodeJS.Timeout;

//     if (isAuthenticated && userRole === "salesstaff") {
//       fetchAllMessages(); // initial fetch

//       interval = setInterval(() => {
//         fetchAllMessages();
//       }, 5000); // poll every 5 seconds
//     }

//     return () => clearInterval(interval);
//   }, [isAuthenticated, userRole]);

//   // Utility: Clean up system-role prefix
// const extractUserName = (name: string): string => {
//   const roles = [
//     "Sales Staff",
//     "Manager",
//     "Farm Breeder",
//     "Consulting Staff",
//     "Delivery Staff",
//   ];

//   for (const role of roles) {
//     if (name.startsWith(role)) {
//       return ""; // skip system role name
//     }
//   }

//   return name;
// };

//   // Group messages by user
//   const getConversations = (): Conversation[] => {
//     const convoMap = new Map<string, Conversation>();

//     [...chatHistory].reverse().forEach((msg) => {
//       const userId =
//         msg.fromUserId === salesStaffId ? msg.toUserId : msg.fromUserId;

//       if (!convoMap.has(userId)) {
//         const rawName = msg.createdBy;
//         const cleanName = extractUserName(rawName);

//         if (!cleanName) return;
//         convoMap.set(userId, {
//           userId,
//           userName: cleanName,
//           lastMessage: msg.content,
//           timestamp: msg.createdTime,
//         });
//       }
//     });

//     return Array.from(convoMap.values());
//   };

//   const filteredMessages = chatHistory.filter(
//     (msg) =>
//       (msg.fromUserId === selectedUserId && msg.toUserId === salesStaffId) ||
//       (msg.toUserId === selectedUserId && msg.fromUserId === salesStaffId)
//   );

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [filteredMessages]);

//   const sendMessage = async () => {
//     if (!newMessage.trim() || !selectedUserId || !salesStaffId) return;

//     const token = getAuthToken();
//     try {
//       await api.post(
//         "/chat/send",
//         {
//           toUserId: selectedUserId,
//           content: newMessage,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "text/plain",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Optimistically update UI or re-fetch messages
//       setChatHistory((prev) => [
//         ...prev,
//         {
//           id: Date.now(), // temporary ID
//           fromUserId: salesStaffId,
//           toUserId: selectedUserId,
//           content: newMessage,
//           isRead: false,
//           createdTime: new Date().toISOString(),
//           createdBy: `Sales Staff`, // temporary fallback
//         },
//       ]);
//       setNewMessage("");
//       scrollToBottom();
//     } catch (error) {
//       console.error("Failed to send message:", error);
//     }
//   };

//   if (!isAuthenticated || userRole !== "salesstaff") {
//     return <div>Please log in as a sales staff to access the chat.</div>;
//   }

//   return (
//     <div
//       style={{
//         display: "flex",
//         width: "100%",
//         maxWidth: "90vw",
//         margin: "0 auto",
//       }}
//     >
//       {/* Chat Window */}
//       <div
//         className={styles.chatContainer}
//         style={{ flex: 3, marginRight: "20px" }}
//       >
//         <h2>Chat with {selectedUserId || "..."}</h2>
//         <div className={styles.messageList}>
//           <List
//             dataSource={filteredMessages}
//             renderItem={(message) => (
//               <List.Item
//                 style={{
//                   justifyContent:
//                     message.fromUserId === salesStaffId
//                       ? "flex-end"
//                       : "flex-start",
//                   display: "flex",
//                 }}
//               >
//                 <div
//                   className={`${styles.messageBubble} ${
//                     message.fromUserId === salesStaffId
//                       ? styles.sent
//                       : styles.received
//                   }`}
//                 >
//                   <List.Item.Meta
//                     avatar={<Avatar>{message.createdBy.charAt(0)}</Avatar>}
//                     title={message.createdBy}
//                     description={
//                       <div>
//                         <div>{message.content}</div>
//                         <div style={{ fontSize: "12px", color: "#888" }}>
//                           {new Date(message.createdTime).toLocaleTimeString()}
//                         </div>
//                       </div>
//                     }
//                   />
//                 </div>
//               </List.Item>
//             )}
//           />
//           <div ref={messagesEndRef} />
//         </div>
//         <div className={styles.inputContainer}>
//           <Input
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type a message..."
//           />
//           <Button
//             type="primary"
//             icon={<SendOutlined />}
//             disabled={!newMessage.trim() || !selectedUserId}
//             onClick={sendMessage}
//           >
//             Send
//           </Button>
//         </div>
//       </div>

//       {/* Right-side Conversation List */}
//       <div className={styles.conversationList} style={{ flex: 1 }}>
//         <h3>Conversations</h3>
//         <List
//           dataSource={getConversations()}
//           renderItem={(conversation) => (
//             <List.Item
//               onClick={() => setSelectedUserId(conversation.userId)}
//               style={{
//                 cursor: "pointer",
//                 background:
//                   conversation.userId === selectedUserId
//                     ? "#e6f7ff"
//                     : "transparent",
//                 borderRadius: "8px",
//                 padding: "10px",
//               }}
//             >
//               <List.Item.Meta
//                 avatar={<Avatar>{conversation.userName.charAt(0)}</Avatar>}
//                 title={conversation.userName}
//                 description={
//                   <>
//                     <div>{conversation.lastMessage}</div>
//                     <div style={{ fontSize: "12px", color: "#888" }}>
//                       {new Date(conversation.timestamp).toLocaleTimeString()}
//                     </div>
//                   </>
//                 }
//               />
//             </List.Item>
//           )}
//         />
//       </div>
//     </div>
//   );
// };

// export default Chat;

// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { List, Input, Button, Avatar } from "antd";
// import { SendOutlined } from "@ant-design/icons";
// import styles from "./Chat.module.css";
// import { useAuth } from "@/app/AuthProvider";
// import { getAuthToken } from "@/lib/utils/auth.utils";
// import api from "@/config/axios.config";

// interface Message {
//   id: number;
//   fromUserId: string;
//   fromUserName: string;
//   fromUserAvatar: string;
//   toUserId: string;
//   toUserName: string;
//   toUserAvatar: string;
//   content: string;
//   isRead: boolean;
//   createdTime: string;
//   createdBy: string;
// }

// interface Conversation {
//   userId: string;
//   userName: string;
//   lastMessage: string;
//   timestamp: string;
// }

// const Chat: React.FC = () => {
//   const { isAuthenticated, userRole } = useAuth();
//   const [salesStaffId, setSalesStaffId] = useState<string | null>(null);
//   const [chatHistory, setChatHistory] = useState<Message[]>([]);
//   const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Fetch all chat history
//   const fetchAllMessages = async () => {
//     const token = getAuthToken();
//     try {
//       const response = await api.get(`/chat/history`, {
//         headers: {
//           accept: "text/plain",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const messages = response.data.value || [];

//       // Determine salesStaffId from messages
//       const firstMsg = messages.find(Boolean);
//       if (firstMsg) {
//         const isFromSales = firstMsg.createdBy?.startsWith("Sales Staff");
//         const staffId = isFromSales ? firstMsg.fromUserId : firstMsg.toUserId;
//         setSalesStaffId(staffId);
//       }

//       setChatHistory(messages);
//     } catch (error) {
//       console.error("Failed to fetch messages:", error);
//     }
//   };

//   useEffect(() => {
//     let interval: NodeJS.Timeout;

//     if (isAuthenticated && userRole === "salesstaff") {
//       fetchAllMessages(); // initial fetch

//       interval = setInterval(() => {
//         fetchAllMessages();
//       }, 5000); // poll every 5 seconds
//     }

//     return () => clearInterval(interval);
//   }, [isAuthenticated, userRole]);

//   // Utility: Get user name for the other participant
//   const getUserName = (msg: Message, salesStaffId: string | null): string => {
//     if (!salesStaffId) return "Unknown";

//     const isSentBySales = msg.fromUserId === salesStaffId;
//     const otherUserId = isSentBySales ? msg.toUserId : msg.fromUserId;

//     // Find a message from the other user to get their createdBy
//     const relatedMsg = chatHistory.find(
//       (m) =>
//         m.fromUserId === otherUserId && !m.createdBy.startsWith("Sales Staff")
//     );

//     if (relatedMsg) {
//       return relatedMsg.createdBy; // e.g., "Hoàng Trọng Luân"
//     }

//     // Fallback: Use toUserName for sent messages, createdBy for received
//     return isSentBySales ? msg.toUserName : msg.createdBy;
//   };

//   // Group messages by user
//   const getConversations = (): Conversation[] => {
//     const convoMap = new Map<string, Conversation>();

//     [...chatHistory].reverse().forEach((msg) => {
//       if (!salesStaffId) return;

//       const userId =
//         msg.fromUserId === salesStaffId ? msg.toUserId : msg.fromUserId;
//       const userName = getUserName(msg, salesStaffId);

//       // Skip if userName is empty or invalid
//       if (!userName || userName === "Unknown") {
//         console.log(
//           `Skipping conversation: userId=${userId}, userName=${userName}`
//         );
//         return;
//       }

//       if (!convoMap.has(userId)) {
//         console.log(
//           `Adding conversation: userId=${userId}, userName=${userName}, lastMessage=${msg.content}`
//         );
//         convoMap.set(userId, {
//           userId,
//           userName,
//           lastMessage: msg.content,
//           timestamp: msg.createdTime,
//         });
//       }
//     });

//     return Array.from(convoMap.values());
//   };

//   const filteredMessages = chatHistory.filter(
//     (msg) =>
//       (msg.fromUserId === selectedUserId && msg.toUserId === salesStaffId) ||
//       (msg.toUserId === selectedUserId && msg.fromUserId === salesStaffId)
//   );

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [filteredMessages]);

//   const sendMessage = async () => {
//     if (!newMessage.trim() || !selectedUserId || !salesStaffId) return;

//     const token = getAuthToken();
//     try {
//       await api.post(
//         "/chat/send",
//         {
//           toUserId: selectedUserId,
//           content: newMessage,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "text/plain",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Optimistically update UI
//       const newMsg: Message = {
//         id: Date.now(), // temporary ID
//         fromUserId: salesStaffId,
//         fromUserName: "salesstaff", // temporary
//         fromUserAvatar: "", // temporary
//         toUserId: selectedUserId,
//         toUserName: "", // temporary, will be updated by fetch
//         toUserAvatar: "", // temporary
//         content: newMessage,
//         isRead: false,
//         createdTime: new Date().toISOString(),
//         createdBy: `Sales Staff`, // temporary fallback
//       };
//       setChatHistory((prev) => [...prev, newMsg]);
//       setNewMessage("");
//       scrollToBottom();

//       // Fetch latest messages to ensure consistency
//       await fetchAllMessages();
//     } catch (error) {
//       console.error("Failed to send message:", error);
//     }
//   };

//   if (!isAuthenticated || userRole !== "salesstaff") {
//     return <div>Please log in as a sales staff to access the chat.</div>;
//   }

//   return (
//     <div
//       style={{
//         display: "flex",
//         width: "100%",
//         maxWidth: "90vw",
//         margin: "0 auto",
//       }}
//     >
//       {/* Chat Window */}
//       <div
//         className={styles.chatContainer}
//         style={{ flex: 3, marginRight: "20px" }}
//       >
//         <h2>Chat with {selectedUserId || "..."}</h2>
//         <div className={styles.messageList}>
//           <List
//             dataSource={filteredMessages}
//             renderItem={(message) => (
//               <List.Item
//                 style={{
//                   justifyContent:
//                     message.fromUserId === salesStaffId
//                       ? "flex-end"
//                       : "flex-start",
//                   display: "flex",
//                 }}
//               >
//                 <div
//                   className={`${styles.messageBubble} ${
//                     message.fromUserId === salesStaffId
//                       ? styles.sent
//                       : styles.received
//                   }`}
//                 >
//                   <List.Item.Meta
//                     avatar={<Avatar>{message.createdBy.charAt(0)}</Avatar>}
//                     title={message.createdBy}
//                     description={
//                       <div>
//                         <div>{message.content}</div>
//                         <div style={{ fontSize: "12px", color: "#888" }}>
//                           {new Date(message.createdTime).toLocaleTimeString()}
//                         </div>
//                       </div>
//                     }
//                   />
//                 </div>
//               </List.Item>
//             )}
//           />
//           <div ref={messagesEndRef} />
//         </div>
//         <div className={styles.inputContainer}>
//           <Input
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type a message..."
//           />
//           <Button
//             type="primary"
//             icon={<SendOutlined />}
//             disabled={!newMessage.trim() || !selectedUserId}
//             onClick={sendMessage}
//           >
//             Send
//           </Button>
//         </div>
//       </div>

//       {/* Right-side Conversation List */}
//       <div className={styles.conversationList} style={{ flex: 1 }}>
//         <h3>Conversations</h3>
//         <List
//           dataSource={getConversations()}
//           renderItem={(conversation) => (
//             <List.Item
//               onClick={() => setSelectedUserId(conversation.userId)}
//               style={{
//                 cursor: "pointer",
//                 background:
//                   conversation.userId === selectedUserId
//                     ? "#e6f7ff"
//                     : "transparent",
//                 borderRadius: "8px",
//                 padding: "10px",
//               }}
//             >
//               <List.Item.Meta
//                 avatar={<Avatar>{conversation.userName.charAt(0)}</Avatar>}
//                 title={conversation.userName}
//                 description={
//                   <>
//                     <div>{conversation.lastMessage}</div>
//                     <div style={{ fontSize: "12px", color: "#888" }}>
//                       {new Date(conversation.timestamp).toLocaleTimeString()}
//                     </div>
//                   </>
//                 }
//               />
//             </List.Item>
//           )}
//         />
//       </div>
//     </div>
//   );
// };

// export default Chat;

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
  const [userId, setUserId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isMarkingRead, setIsMarkingRead] = useState(false);
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
      if (firstMsg) {
        const isFromUser = firstMsg.createdBy?.startsWith("Farm Breeder");
        const id = isFromUser ? firstMsg.fromUserId : firstMsg.toUserId;
        setUserId(id);
        console.log(`Set userId: ${id}`);
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
          !msg.createdBy.startsWith("Farm Breeder")
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
          !msg.createdBy.startsWith("Farm Breeder")
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

    if (isAuthenticated && userRole === "farmbreeder" && !isMarkingRead) {
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

  const getUserName = (msg: Message, userId: string | null): string => {
    if (!userId) return "Unknown";

    const isSentByUser = msg.fromUserId === userId;
    const otherUserId = isSentByUser ? msg.toUserId : msg.fromUserId;

    const relatedMsg = chatHistory.find(
      (m) =>
        m.fromUserId === otherUserId && !m.createdBy.startsWith("Farm Breeder")
    );

    if (relatedMsg) {
      return relatedMsg.createdBy;
    }

    return isSentByUser ? msg.toUserId : msg.createdBy || otherUserId;
  };

  const getConversations = (): Conversation[] => {
    console.log("Generating conversations, userId:", userId);
    const convoMap = new Map<string, Conversation>();

    const userMessages = new Map<string, Message[]>();
    chatHistory.forEach((msg) => {
      const otherUserId =
        msg.fromUserId === userId ? msg.toUserId : msg.fromUserId;
      if (!userMessages.has(otherUserId)) {
        userMessages.set(otherUserId, []);
      }
      userMessages.get(otherUserId)!.push(msg);
    });

    userMessages.forEach((messages, otherUserId) => {
      if (!userId) return;

      const latestMsg = messages.sort(
        (a, b) =>
          new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
      )[0];

      const userName = getUserName(latestMsg, userId);
      if (!userName || userName === "Unknown") {
        console.log(
          `Skipping conversation: userId=${otherUserId}, userName=${userName}, messageId=${latestMsg.id}`
        );
        return;
      }

      const isUnread = messages.some(
        (msg) => !msg.isRead && !msg.createdBy.startsWith("Farm Breeder")
      );
      console.log(
        `Adding conversation: userId=${otherUserId}, userName=${userName}, lastMessage=${latestMsg.content}, isUnread=${isUnread}`
      );

      convoMap.set(otherUserId, {
        userId: otherUserId,
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
      (msg.fromUserId === selectedUserId && msg.toUserId === userId) ||
      (msg.toUserId === selectedUserId && msg.fromUserId === userId)
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId || !userId) return;

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
        fromUserId: userId,
        toUserId: selectedUserId,
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
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!isAuthenticated || userRole !== "farmbreeder") {
    return <div>Please log in as a farm breeder to access the chat.</div>;
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
            ?.userName ||
            selectedUserId ||
            "..."}
        </h2>
        <div className={styles.messageList}>
          {filteredMessages.length > 0 ? (
            <List
              dataSource={filteredMessages}
              renderItem={(message) => (
                <List.Item
                  style={{
                    justifyContent:
                      message.fromUserId === userId ? "flex-end" : "flex-start",
                    display: "flex",
                  }}
                >
                  <div
                    className={`${styles.messageBubble} ${
                      message.fromUserId === userId
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
