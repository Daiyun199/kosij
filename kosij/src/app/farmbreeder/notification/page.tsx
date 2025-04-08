"use client";

import ProtectedRoute from "@/app/ProtectedRoute";
import { PageContainer } from "@ant-design/pro-layout";
import { useEffect, useState } from "react";
import { Button, Space, Typography, Tooltip } from "antd";
import { BellOutlined, CheckOutlined } from "@ant-design/icons";
import { useNotifications } from "@/features/farmbreeder/api/notification/all.api";

const { Text } = Typography;

function NotificationPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchNotification } = useNotifications();

  const updateNotification = async (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, markAsRead: true } : notif
      )
    );
  };

  const updateAllNotifications = async () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) => ({
        ...notif,
        markAsRead: true,
      }))
    );
  };

  useEffect(() => {
    const loadNotifications = async () => {
      const fetchedNotifications = await fetchNotification();
      setNotifications(fetchedNotifications);
      setLoading(false);
    };

    loadNotifications();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNotificationClick = (notification: any) => {
    updateNotification(notification.id);

    // Navigate to the respective details page (mocked here with logs)
    if (notification.referenceType === "Trip") {
      console.log("Navigate to Trip Details:", notification.refId);
    } else if (notification.referenceType === "Order") {
      console.log("Navigate to Order Details:", notification.refId);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.markAsRead
  ).length;

  return (
    <ProtectedRoute allowedRoles={["farmbreeder"]}>
      <PageContainer
        title="Notifications"
        extra={
          <Space>
            <Button
              style={{
                borderRadius: "2rem",
                width: "5rem",
                borderColor: "#000000",
              }}
            >
              ENG
            </Button>
          </Space>
        }
        header={{
          style: {
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            background: "white",
            zIndex: 10,
          },
        }}
      >
        <div
          style={{ padding: "20px", background: "#f8f8f8", minHeight: "100vh" }}
        >
          <div className="mb-3 flex justify-end">
            <Button
              type="primary"
              onClick={updateAllNotifications}
              icon={<CheckOutlined />}
            >
              Mark All as Read ({unreadCount})
            </Button>
          </div>
          {loading ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Text>Loading notifications...</Text>
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Text>No notifications available</Text>
            </div>
          ) : (
            notifications.map((notification) => {
              const isUnread = !notification.markAsRead;
              return (
                <div
                  key={notification.id}
                  style={{
                    backgroundColor: isUnread ? "#f0f8ff" : "white",
                    padding: "15px",
                    marginBottom: "15px",
                    borderRadius: "8px",
                    border: "1px solid #f0f0f0",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {/* {isUnread && ( */}
                    <BellOutlined
                      style={{
                        fontSize: "24px",
                        color: "#264eca",
                        marginRight: "1rem",
                      }}
                    />
                    {/* )} */}
                    <div>
                      <Tooltip title="Click to view details">
                        <Text
                          onClick={() => handleNotificationClick(notification)}
                          style={{
                            fontWeight: isUnread ? "bold" : "normal",
                            cursor: "pointer",
                          }}
                        >
                          {notification.actionType} {notification.referenceType}
                        </Text>
                      </Tooltip>
                      <br />
                      <Text>{notification.message}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {notification.createdTime}
                      </Text>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}

export default NotificationPage;
