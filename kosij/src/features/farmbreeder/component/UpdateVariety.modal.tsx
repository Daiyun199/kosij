import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Form, Upload, App } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import api from "@/config/axios.config";
import { Image } from "antd";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app as firebaseApp } from "@/config/firebase";

interface UpdateVarietyModalProps {
  visible: boolean;
  onCancel: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: any) => void;
  varietyId?: number;
  fetchVarietyList: () => void;
}

function UpdateVarietyModal({
  visible,
  onCancel,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSubmit,
  varietyId,
  fetchVarietyList,
}: UpdateVarietyModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { notification } = App.useApp()

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
      });      return null;
    }
  };

  const handleSubmit = async (values: { description: string }) => {
    if (!varietyId) {
      message.error("Variety ID is missing!");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = form.getFieldValue("imageUrl");
      if (imageFile) {
        imageUrl = await uploadImageToFirebase(imageFile);
        if (!imageUrl) {
          throw new Error("Image upload failed");
        }
      }

      await api.put(`/farm-variety/variety/${varietyId}/current-farm`, {
        description: values.description,
        imageUrl,
      });
      onCancel();
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
              Koi Variety has been updated.{" "}
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
      fetchVarietyList()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notification.error({
        message: error.message || "Failed to update Koi variety",
        placement: "topRight",
      });    } finally {
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
        title="Update Variety"
        open={visible}
        onCancel={onCancel}
        footer={null}
        centered
      >
        <p style={{ color: "#6B7280" }}>
          Please fill in the details below to update the variety.
        </p>

        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            console.log("Submitting form...", values);
            handleSubmit(values);
          }}
        >
          {/* Description */}
          <Form.Item
            label="Description"
            name="description"
            rules={[{ message: "Please enter description" }]}
          >
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
            <Button type="link" icon={<ArrowLeftOutlined />} onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              loading={loading}
              onClick={() => form.submit()}
            >
              Update Variety
            </Button>
          </div>
        </Form>
      </Modal>
    </App>
  );
}

export default UpdateVarietyModal;
