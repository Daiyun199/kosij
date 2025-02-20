"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";
import Image from "next/image";
import api from "@/config/axios.config";

interface UserProfile {
  fullName: string | null;
  phoneNumber: string;
  email: string;
  role: string;
  sex: string;
  urlAvatar: string | null;
}

function Page() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/accounts/current-user");
        setUser(response.data.value); // ✅ Lấy dữ liệu từ `value`
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <ManagerLayout title="Profile">
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>
                <Image
                  src={user?.urlAvatar || "/default-avatar.png"}
                  alt="Avatar"
                  width={150}
                  height={150}
                  className={styles.avatarImage}
                />
              </div>
              <button className={styles.uploadButton}>Upload Image</button>
            </div>
            <div className={styles.infoSection}>
              <h2 className={styles.title}>Manager Information</h2>
              {user ? (
                <div className={styles.info}>
                  <p>
                    <strong>Full Name:</strong> {user.fullName || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Phone Number:</strong> {user.phoneNumber}
                  </p>
                  <p>
                    <strong>Role:</strong> {user.role}
                  </p>
                  <p>
                    <strong>Sex:</strong> {user.sex}
                  </p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </ManagerLayout>
    </div>
  );
}

export default Page;
