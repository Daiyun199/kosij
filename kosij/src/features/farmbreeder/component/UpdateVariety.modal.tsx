import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Form, Upload, message } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import api from "@/config/axios.config";

interface UpdateVarietyModalProps {
  visible: boolean;
  onCancel: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: any) => void;
}

function UpdateVarietyModal({
  visible,
  onCancel,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSubmit,
}: UpdateVarietyModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch variety details on open
  useEffect(() => {
    if (visible) {
      fetchVarietyDetails();
    }
  }, [visible]);

  const fetchVarietyDetails = async () => {
    try {
      const response = await api.get("/farm-variety/variety/farm");
      const { varietyName, description, imageUrl } = response.data.value;
      form.setFieldsValue({ varietyName, description, imageUrl });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error("Failed to fetch variety details.");
    }
  };

  // Handle form submission
  const handleSubmit = async (values: {
    varietyName: string;
    description: string;
    imageUrl?: string;
  }) => {
    setLoading(true);
    try {
      let imageUrl = values.imageUrl;

      // If a new image is uploaded, handle the upload first
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadResponse = await api.post("/upload-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadResponse.data.url; // Assume the API returns an image URL
      }

      // Submit updated variety details
      await api.put("/farm-variety/variety/farm", {
        varietyName: values.varietyName,
        description: values.description,
        imageUrl,
      });

      message.success("Variety updated successfully!");
      onCancel();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error("Failed to update variety.");
    } finally {
      setLoading(false);
    }
  };

  return (
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

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Variety Name */}
        <Form.Item
          label="Variety Name"
          name="varietyName"
          rules={[{ required: true, message: "Please enter variety name" }]}
        >
          <Input placeholder="Enter variety name" />
        </Form.Item>

        {/* Description */}
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
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
              <img
                src={form.getFieldValue("imageUrl")}
                alt="Uploaded"
                style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
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
            htmlType="submit"
            icon={<ArrowRightOutlined />}
            loading={loading}
          >
            Update Variety
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default UpdateVarietyModal;
