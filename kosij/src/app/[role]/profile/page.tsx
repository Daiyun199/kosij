/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Popconfirm, Row, Select } from "antd";
import styles from "./profile.module.css";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import SaleStaffLayout from "@/app/components/SaleStaffLayout/SaleStaffLayout";
import api from "@/config/axios.config";
import ImageUploader from "@/app/components/ImageUpload/ImageUpload";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/config/firebase";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  sex: string;
  address: string;
  urlAvatar: string;
}

function Profile() {
  const { role } = useParams();
  const LayoutComponent = role === "manager" ? ManagerLayout : SaleStaffLayout;
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/accounts/current-user");
        setUser(response.data.value);
        setEditedUser(response.data.value);
      } catch (error) {
        console.error("Lỗi lấy thông tin user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warning("Please select an image first!");
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
          console.log(`Uploading: ${progress}%`);
        },
        (error) => {
          console.error("Error uploading:", error);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Image uploaded successfully:", downloadURL);

          if (user) {
            const updatedUser = { ...user, urlAvatar: downloadURL };

            await api.put("/accounts/current-user", updatedUser);
            setUser(updatedUser);
            toast.success("Avatar updated successfully!");
          }
          setUploading(false);
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploading(false);
    }
  };

  const handleEdit = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleSave = async () => {
    if (!editedUser) return;

    try {
      await api.put("/accounts/current-user", editedUser);
      setUser(editedUser);
      setIsModalOpen(false);
      toast.success("Update Infomation Succcessfully!!!");
    } catch (error) {
      console.error("Update information error:", error);
      toast.error("Update information error");
    }
  };

  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  const validatePassword = (password: string) => {
    const uppercaseRegex = /[A-Z]/;
    const specialCharRegex = /[@#$%^&*()_+!]/;

    if (!uppercaseRegex.test(password)) {
      return "Password must contain at least one uppercase letter (A-Z)";
    }
    if (!specialCharRegex.test(password)) {
      return "Password must contain at least one special character (@, #, $, ...)";
    }
    return "";
  };
  const handleConfirmChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required!");
      return;
    }

    const validationError = validatePassword(newPassword);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password must match!");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/accounts/password/reset", {
        oldPassword,
        newPassword,
        confirmPassword,
      });

      toast.success("Password changed successfully!");
      handleClosePasswordModal();
    } catch (error: any) {
      toast.error(error.response?.data?.value || "Failed to change password");
    }
    setLoading(false);
  };
  if (isLoading) {
    return (
      <LayoutComponent title="Profile">
        <div className={styles.loadingContainer}>Loading...</div>
      </LayoutComponent>
    );
  }

  return (
    
    <LayoutComponent title="Profile">
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.avatarSection}>
            <ImageUploader
              onFileSelected={setSelectedFile}
              initialImage={
                user?.urlAvatar ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd1VYKzrXv11-IzWaTgoSQVepzpku0hrr1Ww&s"
              }
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
            <div className={styles.info}>
              <p>
                <strong>Full Name:</strong> {user?.fullName || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Phone Number:</strong> {user?.phoneNumber}
              </p>
              <p>
                <strong>Role:</strong> {user?.role}
              </p>
              <p>
                <strong>Gender:</strong> {user?.sex}
              </p>
              <p>
                <strong>Address:</strong> {user?.address || "N/A"}
              </p>
            </div>
            <div className={styles.buttonGroup}>
              <Button className={styles.editButton} onClick={handleEdit}>
                Edit
              </Button>
              <Button
                onClick={handleOpenPasswordModal}
                className={styles.changePasswordButton}
              >
                Change Password
              </Button>
            </div>
          </div>

          <Modal
            title="Change Password"
            open={isPasswordModalOpen}
            onCancel={handleClosePasswordModal}
            footer={[
              <Button key="cancel" onClick={handleClosePasswordModal}>
                Cancel
              </Button>,
              <Popconfirm
                key="confirm"
                title="Are you sure you want to change your password?"
                onConfirm={handleConfirmChangePassword}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" loading={loading}>
                  Change Password
                </Button>
              </Popconfirm>,
            ]}
          >
            <Form layout="vertical">
              <Form.Item label="Old Password">
                <Input.Password
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item label="New Password">
                <Input.Password
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item label="Confirm New Password">
                <Input.Password
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Item>
            </Form>
          </Modal>
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
    </LayoutComponent>
  );
}

export default Profile;
