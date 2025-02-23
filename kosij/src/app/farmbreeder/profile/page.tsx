"use client";

import { PageContainer } from "@ant-design/pro-layout";
import {
  Button,
  Form,
  Input,
  Space,
  Typography,
  Upload,
  UploadFile,
} from "antd";
import TextArea from "antd/es/input/TextArea";

type FormFieldTypes = {
  name: string;
  quantity: number;
  expirationDate: string;
  machineModel: string;
  image: UploadFile | undefined;
};

function Page() {
  return (
    <PageContainer
      title="Profile"
      extra={
        <Space>
          <Button
            style={{
              borderRadius: "2rem",
              width: "5rem",
              borderColor: "#000000",
            }}
          >
            ENG
          </Button>
        </Space>
      }
      header={{
        style: {
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          background: "white",
          zIndex: 10,
        },
      }}
    >
      <section className="mt-5">
        <Form style={{ width: "30rem", justifySelf: "center" }}>
          <Typography.Title
            level={3}
            style={{ justifySelf: "center", color: "#1F41BB" }}
          >
            Koi Farm Information
          </Typography.Title>
          <Form.Item<FormFieldTypes> name="image">
            <Upload.Dragger
              accept=".jpg,.jpeg,.png,.bmp,.svg,.webp,.gif"
              //   customRequest={async (props) => {
              //      const file = props.file as RcFile
              //      const response = await File_Image_Upload({ file })
              //      if (response.status === 201) props.onSuccess?.(response.data.path)
              //      else props.onError?.(new Error("Failed to upload file."), response)
              //   }}
              showUploadList={true}
              listType="picture"
              multiple={false}
              maxCount={1}
              method="POST"
              //   isImageUrl={checkImageUrl}
              //   onChange={(info) => {
              //      setLoadingImage(false)
              //      if (info.file.status === "done") {
              //         form.setFieldsValue({ image: info.file })
              //      }
              //      if (info.file.status === "uploading") {
              //         setLoadingImage(true)
              //      }
              //      if (info.file.status === "error") {
              //         message.error("Tải tệp thất bại")
              //      }
              //      if (info.file.status === "removed") {
              //         form.setFieldsValue({ image: {} })
              //         message.success("Tẹp đã bị xóa")
              //      }
              //   }}
            >
              {" "}
              <div className="flex flex-col items-center justify-center">
                <Typography.Title level={5}>Nhấp vào đây</Typography.Title>
                <p>Vui lòng tải hình ảnh lên.</p>
              </div>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item<FormFieldTypes>>
            <Input placeholder="Name" style={{ backgroundColor: "#C6CFED" }} />
          </Form.Item>
          <Form.Item<FormFieldTypes>>
            <Input
              placeholder="VAT Number"
              style={{ backgroundColor: "#C6CFED" }}
            />
          </Form.Item>
          <Form.Item<FormFieldTypes>>
            <Input
              placeholder="Opening Hours"
              style={{ backgroundColor: "#C6CFED" }}
            />
          </Form.Item>
          <Form.Item<FormFieldTypes>>
            <Input
              placeholder="Address"
              style={{ backgroundColor: "#C6CFED" }}
            />
          </Form.Item>
          <section style={{ display: "flex", gap: "2rem" }}>
            <Form.Item<FormFieldTypes>>
              <Input
                placeholder="Zip Code"
                style={{ backgroundColor: "#C6CFED" }}
              />
            </Form.Item>
            <Form.Item<FormFieldTypes>>
              <Input
                placeholder="City"
                style={{ backgroundColor: "#C6CFED", width: "17rem" }}
              />
            </Form.Item>
          </section>
          <Form.Item<FormFieldTypes>>
            <Input
              placeholder="Phone Number"
              style={{ backgroundColor: "#C6CFED" }}
            />
          </Form.Item>
          <Form.Item<FormFieldTypes>>
            <Input placeholder="Email" style={{ backgroundColor: "#C6CFED" }} />
          </Form.Item>
          <Form.Item<FormFieldTypes>>
            <TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              placeholder="Description"
              style={{ backgroundColor: "#C6CFED" }}
            />
          </Form.Item>
        </Form>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button className="font-medium text-base" style={{ backgroundColor: "#1F41BB", color: "#fff", width: "10rem" }}>Update</Button>
        </div>
      </section>
    </PageContainer>
  );
}

export default Page;
