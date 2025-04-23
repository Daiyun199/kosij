import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Form, Upload, App, Select, message } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Image } from "antd";
import { fetchKoiVarieties } from "../api/variety/all.api";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "@firebase/storage";
import { app as firebaseApp } from "@/config/firebase";
import api from "@/config/axios.config";

interface CreateVarietyModalProps {
  visible: boolean;
  onCancel: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: any) => void;
  varietyId?: number;
  fetchVarietyList: () => void;
}

function CreateVarietyModal({
  visible,
  onCancel,
  // onSubmit,
  fetchVarietyList,
}: CreateVarietyModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [varieties, setVarieties] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { notification } = App.useApp();

  const uploadImageToFirebase = async (file: File) => {
    const storage = getStorage(firebaseApp);
    const storageRef = ref(
      storage,
      `variety_images/${file.name}-${Date.now()}`
    );

    try {
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Error uploading image:", error);
      notification.error({
        message: "Failed to upload image.",
        placement: "topRight",
      });
      return null;
    }
  };
  useEffect(() => {
    const getVarieties = async () => {
      try {
        const varietiesData = await fetchKoiVarieties();
        setVarieties(varietiesData);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        message.error("Failed to load varieties");
      }
    };
    getVarieties();
  }, []);

  const handleCancel = () => {
    form.resetFields(); // Reset form fields
    setImageFile(null); // Clear image file state
    onCancel(); // Call the original onCancel to close modal
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: any) => {
    const { description, varietyName, varietyId } = values;
    setLoading(true);
    try {
      let imageUrl = form.getFieldValue("imageUrl");

      if (imageFile) {
        imageUrl = await uploadImageToFirebase(imageFile);
        if (!imageUrl) {
          throw new Error("Image upload failed");
        }
      }
      await api.post(`/farm-variety/variety/current-farm`, {
        varietyId,
        varietyName,
        description,
        imageUrl,
        isNew: !varietyId,
      });
      handleCancel();
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      notification.info({
        message: (
          <App>
            <div>
              New Variety has been created.{" "}
              <strong>PLEASE CHECK IT NOW!</strong>
              <div
                style={{ color: "#6B7280", fontSize: "12px", marginTop: "4px" }}
              >
                {timeString}
              </div>
            </div>
          </App>
        ),
        placement: "topRight",
        style: {
          backgroundColor: "white",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          borderRadius: "4px",
        },
        icon: <span style={{ color: "#1890ff", fontSize: "30px" }}>ⓘ</span>,
      });
      fetchVarietyList();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notification.error({
        message: error.message || "Failed to create new variety",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  return (
    <App>
      <Modal
        title="Create Variety"
        open={visible}
        onCancel={handleCancel}
        footer={null}
        centered
        bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }}
      >
        <p style={{ color: "#6B7280" }}>
          Please fill in the details below to create the variety.
        </p>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Variety Selection */}
          <Form.Item label="Variety" name="varietyId">
            <Select placeholder="Select a variety" allowClear>
              <Select.Option value={undefined}>(Select a variety)</Select.Option>
              {varieties.map((variety) => (
                <Select.Option key={variety.id} value={variety.varietyId}>
                  {variety.varietyName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* VarietyName */}
          <Form.Item label="Variety Name" name="varietyName">
            <Input.TextArea placeholder="Enter name" />
          </Form.Item>
          {/* Description */}
          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Enter description" rows={4} />
          </Form.Item>

          {/* Image Upload */}
          <Form.Item label="Image">
            <Upload
              accept=".jpg,.jpeg,.png"
              showUploadList={false}
              beforeUpload={(file) => {
                setImageFile(file);
                form.setFieldsValue({ imageUrl: URL.createObjectURL(file) });
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>

            {/* Preview the uploaded image */}
            {form.getFieldValue("imageUrl") && (
              <div style={{ marginTop: 10 }}>
                <Image
                  src={form.getFieldValue("imageUrl")}
                  alt="Uploaded"
                  width="100%"
                  height={200}
                  style={{ objectFit: "cover" }}
                  preview={false}
                />
              </div>
            )}
          </Form.Item>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            <Button type="link" icon={<ArrowLeftOutlined />} onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              htmlType="submit"
              loading={loading}
            >
              Create Variety
            </Button>
          </div>
        </Form>
      </Modal>
    </App>
  );
}

export default CreateVarietyModal;
