"use-cilent";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import React from "react";
import styles from "./profile.module.css";
import Image from "next/image";
function page() {
  return (
    <div>
      <ManagerLayout title="Profile">
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>
                <Image
                  src="https://static.wikia.nocookie.net/hoducks/images/1/14/Game_Chapter_31_%28Full_1%29.png/revision/latest?cb=20240128195103"
                  alt="Avatar"
                  width={300}
                  height={300}
                />
              </div>
              <button className={styles.uploadButton}>Upload Image</button>
            </div>
            <div className={styles.infoSection}>
              <h2 className={styles.title}>Manager Information</h2>
              <form className={styles.form}>
                <input
                  type="text"
                  placeholder="Full Name"
                  className={styles.input}
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className={styles.input}
                />
                <input
                  type="text"
                  placeholder="Address"
                  className={styles.input}
                />
                <input
                  type="text"
                  placeholder="Citizen identification card"
                  className={styles.input}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className={styles.input}
                />
                <button type="submit" className={styles.updateButton}>
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </ManagerLayout>
    </div>
  );
}

export default page;
