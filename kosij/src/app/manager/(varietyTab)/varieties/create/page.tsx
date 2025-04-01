/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Input, Upload, Button, Form, message, Image, Typography } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { Card } from "@/components/ui/card";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";
import api from "@/config/axios.config";
import ProtectedRoute from "@/app/ProtectedRoute";

const { Title, Text } = Typography;

const CreateVarietyForm = () => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (info: any) => {
    const { file } = info;
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must smaller than 5MB!");
      return;
    }

    setImageFile(file);
    message.success("Image selected!");
  };

  const removeImage = () => {
    setImageFile(null);
  };

  const uploadImageToFirebase = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      const storageRef = ref(
        storage,
        `koi-varieties/${Date.now()}-${file.name}`
      );
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } finally {
      setUploading(false);
    }
  };

  const onFinish = async (values: any) => {
    if (!imageFile) {
      message.warning("Please select an image first!");
      return;
    }

    try {
      setLoading(true);

      const firebaseImageUrl = await uploadImageToFirebase(imageFile);

      const response = await api.post("/koi-variety", {
        varietyName: values.varietyName,
        varietyDescription: values.varietyDescription,
        imageUrl: firebaseImageUrl,
        status: true,
      });

      message.success("Variety created successfully!");
      form.resetFields();
      setImageFile(null);
    } catch (error: any) {
      console.error("Creation error:", error);
      message.error(
        error.response?.data?.message || "Failed to create variety"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <ManagerLayout title="Create variety">
        <Card className="p-6 max-w-lg mx-auto mt-10 shadow-lg rounded-lg">
          <Title level={3} className="text-center mb-6">
            Create New Koi Variety
          </Title>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label={<Text strong>Variety Name</Text>}
              name="varietyName"
              rules={[{ required: true, message: "Please enter the name!" }]}
            >
              <Input placeholder="Enter variety name..." size="large" />
            </Form.Item>

            <Form.Item
              label={<Text strong>Description</Text>}
              name="varietyDescription"
              rules={[
                { required: true, message: "Please enter the description!" },
                {
                  max: 500,
                  message: "Description cannot exceed 500 characters!",
                },
              ]}
            >
              <Input.TextArea
                placeholder="Enter description..."
                rows={4}
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item label={<Text strong>Image</Text>}>
              <div className="flex flex-col gap-4">
                <Upload
                  name="file"
                  customRequest={({ file, onSuccess }) => onSuccess!("ok")}
                  showUploadList={false}
                  beforeUpload={(file) => {
                    handleUpload({ file });
                    return false;
                  }}
                  accept="image/*"
                  disabled={uploading}
                >
                  <Button
                    icon={<UploadOutlined />}
                    loading={uploading}
                    size="large"
                    block
                  >
                    {uploading ? "Uploading..." : "Select Image"}
                  </Button>
                </Upload>

                {imageFile && (
                  <div className="relative group">
                    <Image
                      src={URL.createObjectURL(imageFile)}
                      alt="Selected preview"
                      className="rounded-lg border border-gray-200"
                      width="100%"
                      height={200}
                      style={{ objectFit: "cover" }}
                      preview={{
                        mask: <span className="text-white">Preview</span>,
                      }}
                    />
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      shape="circle"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={removeImage}
                    />
                  </div>
                )}
              </div>
              <Text type="secondary" className="block mt-2">
                Supports: JPG, PNG. Max size: 5MB
              </Text>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading || uploading}
                disabled={!imageFile}
              >
                {uploading ? "Uploading Image..." : "Create Variety"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </ManagerLayout>
    </ProtectedRoute>
  );
};

export default CreateVarietyForm;
