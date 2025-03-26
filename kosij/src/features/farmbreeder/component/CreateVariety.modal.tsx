import React from "react";
import { Modal, Input, Button, Form, Upload, App } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Image } from "antd";

interface CreateVarietyModalProps {
  visible: boolean;
  onCancel: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: any) => void;
  varietyId?: number;
}

function CreateVarietyModal({
  visible,
  onCancel,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSubmit,
}: CreateVarietyModalProps) {
  const [form] = Form.useForm();
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
            <Upload accept=".jpg,.jpeg,.png" showUploadList={false}>
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
              onClick={() => form.submit()}
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
