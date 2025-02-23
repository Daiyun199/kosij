"use client";
import React, { useState, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";
import api from "@/config/axios.config";

import styles from "./Profile.module.css";
import ImageUploader from "@/app/components/ImageUpload/ImageUpload";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { Button } from "@/components/ui/button";
import { Modal, Input, Row, Col, Select } from "antd";
import { toast } from "react-toastify";
interface UserProfile {
  fullName: string | null;
  phoneNumber: string;
  email: string;
  role: string;
  sex: string;
  urlAvatar: string | null;
  address: string;
  certificateUrl: string;
}

function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/accounts/current-user");
        setUser(response.data.value);
        setEditedUser(response.data.value);
      } catch (error) {
        console.error("Lỗi lấy thông tin user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Vui lòng chọn ảnh trước!");
      return;
    }

    setUploading(true);

    try {
      const storageRef = ref(storage, `avatars/${selectedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Đang tải lên: ${progress}%`);
        },
        (error) => {
          console.error("Lỗi khi upload:", error);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Ảnh tải lên thành công:", downloadURL);

          if (user) {
            const updatedUser = {
              ...user,
              urlAvatar: downloadURL,
            };

            await api.put("/accounts/current-user", updatedUser);
            setUser(updatedUser);

            alert("Cập nhật avatar thành công!");
          }
          setUploading(false);
        }
      );
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      setUploading(false);
    }
  };

  const handleEdit = () => {
    setIsModalOpen(true);
    setEditedUser(user);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    if (!editedUser) return;

    try {
      await api.put("/accounts/current-user", editedUser);
      setUser(editedUser);
      setIsModalOpen(false);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <ManagerLayout title="Profile">
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.avatarSection}>
            <ImageUploader
              onFileSelected={setSelectedFile}
              initialImage={user?.urlAvatar || "/default-avatar.png"}
            />
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className={styles.uploadButton}
            >
              {uploading ? "Uploading..." : "Save Image"}
            </Button>
          </div>
          <div className={styles.infoSection}>
            <h2 className={styles.title}>Personal Information</h2>
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
                  <strong>Gender:</strong> {user.sex}
                </p>
                <p>
                  <strong>Address:</strong> {user.address || "N/A"}
                </p>
              </div>
            ) : (
              <p>Loading...</p>
            )}
            <Button className={styles.editButton} onClick={handleEdit}>
              Edit
            </Button>
          </div>
        </div>
        <Modal
          title="Edit Information"
          open={isModalOpen}
          onOk={handleSave}
          onCancel={handleCancel}
          okText="Save"
          cancelText="Cancel"
        >
          <div className={styles.modalContent}>
            <Row gutter={[16, 16]} align="middle">
              <Col span={8}>
                <label>Full Name</label>
              </Col>
              <Col span={16}>
                <Input
                  placeholder="Full Name"
                  value={editedUser?.fullName || ""}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser!, fullName: e.target.value })
                  }
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} align="middle">
              <Col span={8}>
                <label>Phone Number</label>
              </Col>
              <Col span={16}>
                <Input
                  placeholder="Phone Number"
                  value={editedUser?.phoneNumber || ""}
                  onChange={(e) =>
                    setEditedUser({
                      ...editedUser!,
                      phoneNumber: e.target.value,
                    })
                  }
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} align="middle">
              <Col span={8}>
                <label>Gender</label>
              </Col>
              <Col span={16}>
                <Select
                  placeholder="Select Gender"
                  value={editedUser?.sex || ""}
                  onChange={(value) =>
                    setEditedUser({ ...editedUser!, sex: value })
                  }
                  style={{ width: "100%" }}
                >
                  <Select.Option value="Male">Male</Select.Option>
                  <Select.Option value="Female">Female</Select.Option>
                </Select>
              </Col>
            </Row>

            <Row gutter={[16, 16]} align="middle">
              <Col span={8}>
                <label>Address</label>
              </Col>
              <Col span={16}>
                <Input
                  placeholder="Address"
                  value={editedUser?.address || ""}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser!, address: e.target.value })
                  }
                />
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    </ManagerLayout>
  );
}

export default Profile;
