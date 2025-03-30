"use client";
import { useState } from "react";
import { Input, Upload, Button, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Card } from "@/components/ui/card";
import { toast } from "react-toastify";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";

const CreateVarietyForm = () => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpload = (info: any) => {
    if (info.file.status === "done") {
      setImageUrl(info.file.response.url);
      toast.success("Upload Successful!");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = (values: any) => {
    console.log("Submitted values:", { ...values, imageUrl });
    toast.success("Create Successful!");
  };

  return (
    <ManagerLayout title="Create variety">
      <Card className="p-6 max-w-lg mx-auto mt-10 shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create New Variety</h2>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Variety Name"
            name="varietyName"
            rules={[{ required: true, message: "Please enter the name!" }]}
          >
            <Input placeholder="Enter variety name..." />
          </Form.Item>

          <Form.Item
            label="Description"
            name="varietyDescription"
            rules={[
              { required: true, message: "Please enter the description!" },
            ]}
          >
            <Input.TextArea placeholder="Enter description..." rows={4} />
          </Form.Item>

          <Form.Item label="Image">
            <Upload
              name="file"
              action="/api/upload"
              onChange={handleUpload}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Uploaded"
                className="mt-2 w-32 h-32 object-cover"
              />
            )}
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full mt-4">
            Create
          </Button>
        </Form>
      </Card>
    </ManagerLayout>
  );
};

export default CreateVarietyForm;
