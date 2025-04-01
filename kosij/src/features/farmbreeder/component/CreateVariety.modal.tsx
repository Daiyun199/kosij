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
      message.error("Failed to upload image.");
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
      message.success("Variety created successfully!");
      onCancel();
      fetchVarietyList();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error("Failed to create variety.");
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
        onCancel={onCancel}
        footer={null}
        centered
      >
        <p style={{ color: "#6B7280" }}>
          Please fill in the details below to create the variety.
        </p>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Variety Selection */}
          <Form.Item label="Variety" name="varietyId">
            <Select placeholder="Select a variety" allowClear>
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
            <Button type="link" icon={<ArrowLeftOutlined />} onClick={onCancel}>
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
