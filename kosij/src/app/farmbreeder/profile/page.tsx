// "use client";

// import ProtectedRoute from "@/app/ProtectedRoute";
// import { PageContainer } from "@ant-design/pro-layout";
// import {
//   Button,
//   Form,
//   Input,
//   Space,
//   Typography,
//   Upload,
//   UploadFile,
// } from "antd";
// import TextArea from "antd/es/input/TextArea";

// type FormFieldTypes = {
//   name: string;
//   quantity: number;
//   expirationDate: string;
//   machineModel: string;
//   image: UploadFile | undefined;
// };

// function Page() {
//   return (
//     <ProtectedRoute allowedRoles={["farmbreeder"]}>
//       <PageContainer
//         title="Profile"
//         extra={
//           <Space>
//             <Button
//               style={{
//                 borderRadius: "2rem",
//                 width: "5rem",
//                 borderColor: "#000000",
//               }}
//             >
//               ENG
//             </Button>
//           </Space>
//         }
//         header={{
//           style: {
//             boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
//             background: "white",
//             zIndex: 10,
//           },
//         }}
//       >
//         <section className="mt-5">
//           <Form style={{ width: "30rem", justifySelf: "center" }}>
//             <Typography.Title
//               level={3}
//               style={{ justifySelf: "center", color: "#1F41BB" }}
//             >
//               Koi Farm Information
//             </Typography.Title>
//             <Form.Item<FormFieldTypes> name="image">
//               <Upload.Dragger
//                 accept=".jpg,.jpeg,.png,.bmp,.svg,.webp,.gif"
//                 //   customRequest={async (props) => {
//                 //      const file = props.file as RcFile
//                 //      const response = await File_Image_Upload({ file })
//                 //      if (response.status === 201) props.onSuccess?.(response.data.path)
//                 //      else props.onError?.(new Error("Failed to upload file."), response)
//                 //   }}
//                 showUploadList={true}
//                 listType="picture"
//                 multiple={false}
//                 maxCount={1}
//                 method="POST"
//                 //   isImageUrl={checkImageUrl}
//                 //   onChange={(info) => {
//                 //      setLoadingImage(false)
//                 //      if (info.file.status === "done") {
//                 //         form.setFieldsValue({ image: info.file })
//                 //      }
//                 //      if (info.file.status === "uploading") {
//                 //         setLoadingImage(true)
//                 //      }
//                 //      if (info.file.status === "error") {
//                 //         message.error("Tải tệp thất bại")
//                 //      }
//                 //      if (info.file.status === "removed") {
//                 //         form.setFieldsValue({ image: {} })
//                 //         message.success("Tẹp đã bị xóa")
//                 //      }
//                 //   }}
//               >
//                 {" "}
//                 <div className="flex flex-col items-center justify-center">
//                   <Typography.Title level={5}>Nhấp vào đây</Typography.Title>
//                   <p>Vui lòng tải hình ảnh lên.</p>
//                 </div>
//               </Upload.Dragger>
//             </Form.Item>
//             <Form.Item<FormFieldTypes>>
//               <Input
//                 placeholder="Name"
//                 style={{ backgroundColor: "#C6CFED" }}
//               />
//             </Form.Item>
//             <Form.Item<FormFieldTypes>>
//               <Input
//                 placeholder="VAT Number"
//                 style={{ backgroundColor: "#C6CFED" }}
//               />
//             </Form.Item>
//             <Form.Item<FormFieldTypes>>
//               <Input
//                 placeholder="Opening Hours"
//                 style={{ backgroundColor: "#C6CFED" }}
//               />
//             </Form.Item>
//             <Form.Item<FormFieldTypes>>
//               <Input
//                 placeholder="Address"
//                 style={{ backgroundColor: "#C6CFED" }}
//               />
//             </Form.Item>
//             <section style={{ display: "flex", gap: "2rem" }}>
//               <Form.Item<FormFieldTypes>>
//                 <Input
//                   placeholder="Zip Code"
//                   style={{ backgroundColor: "#C6CFED" }}
//                 />
//               </Form.Item>
//               <Form.Item<FormFieldTypes>>
//                 <Input
//                   placeholder="City"
//                   style={{ backgroundColor: "#C6CFED", width: "17rem" }}
//                 />
//               </Form.Item>
//             </section>
//             <Form.Item<FormFieldTypes>>
//               <Input
//                 placeholder="Phone Number"
//                 style={{ backgroundColor: "#C6CFED" }}
//               />
//             </Form.Item>
//             <Form.Item<FormFieldTypes>>
//               <Input
//                 placeholder="Email"
//                 style={{ backgroundColor: "#C6CFED" }}
//               />
//             </Form.Item>
//             <Form.Item<FormFieldTypes>>
//               <TextArea
//                 autoSize={{ minRows: 3, maxRows: 5 }}
//                 placeholder="Description"
//                 style={{ backgroundColor: "#C6CFED" }}
//               />
//             </Form.Item>
//           </Form>
//           <div style={{ display: "flex", justifyContent: "center" }}>
//             <Button
//               className="font-medium text-base"
//               style={{
//                 backgroundColor: "#1F41BB",
//                 color: "#fff",
//                 width: "10rem",
//               }}
//             >
//               Update
//             </Button>
//           </div>
//         </section>
//       </PageContainer>
//     </ProtectedRoute>
//   );
// }

// export default Page;
// src/app/page.tsx
"use client";

import ProtectedRoute from "@/app/ProtectedRoute";
import { PageContainer } from "@ant-design/pro-layout";
import { Button, Form, Input, Space, Typography, Upload, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { updateFarmProfile } from "@/features/farmbreeder/api/profile/update.api";

type FormFieldTypes = {
  farmName: string;
  description: string;
  farmPhoneNumber: string;
  farmEmail: string;
  openingHours: string;
  address: string;
  zipCode: string;
  city: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any;
};

function Page() {
  const [form] = Form.useForm<FormFieldTypes>();
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileList, setFileList] = useState<any[]>([]);

  const handleSubmit = async (values: FormFieldTypes) => {
    setLoading(true);
    try {
      // const token = authContext?.user?.token;
      // if (!token) {
      //   message.error("Authentication token not found. Please log in.");
      //   setLoading(false);
      //   return;
      // }

      // Simulate image URL (replace with actual upload logic if needed)
      const imageUrl =
        fileList.length > 0 ? "https://example.com/uploaded-image.jpg" : "";

      const location = `${values.address || ""}, ${values.zipCode || ""}, ${
        values.city || ""
      }`
        .replace(/,\s*,/g, ",")
        .replace(/^\s*,|,\s*$/g, "")
        .trim();

      const requestData = {
        farmName: values.farmName || "",
        description: values.description || "",
        breederName: "",
        breederPhone: "",
        location: location || "",
        imageUrl,
        openingHours: values.openingHours || "",
        farmPhoneNumber: values.farmPhoneNumber || "",
        farmEmail: values.farmEmail || "",
      };

      await updateFarmProfile(requestData);
      message.success("Farm profile updated successfully!");
      form.resetFields();
      setFileList([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(error.message || "Failed to update farm profile");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUploadChange = ({ fileList }: { fileList: any[] }) => {
    setFileList(fileList.slice(-1));
    form.setFieldsValue({ image: fileList[0]?.originFileObj || null });
  };

  return (
    <ProtectedRoute allowedRoles={["farmbreeder"]}>
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
          <Form
            form={form}
            onFinish={handleSubmit}
            style={{ width: "30rem", margin: "0 auto" }}
            layout="vertical"
          >
            <Typography.Title
              level={3}
              style={{ textAlign: "center", color: "#1F41BB" }}
            >
              Koi Farm Information
            </Typography.Title>

            <Form.Item
              name="image"
              // rules={[{ required: false, message: "Please upload an image" }]} // Set required: true if image is mandatory
            >
              <Upload
                accept=".jpg,.jpeg,.png,.bmp,.svg,.webp,.gif"
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false}
                listType="picture"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="farmName"
              // rules={[
              //   { required: true, message: "Please enter the farm name" },
              // ]}
            >
              <Input
                placeholder="Farm Name"
                style={{ backgroundColor: "#C6CFED" }}
              />
            </Form.Item>

            <Form.Item name="vatNumber">
              <Input
                placeholder="VAT Number"
                style={{ backgroundColor: "#C6CFED" }}
              />
            </Form.Item>

            <Form.Item
              name="openingHours"
              // rules={[
              //   { required: true, message: "Please enter opening hours" },
              // ]}
            >
              <Input
                placeholder="Opening Hours"
                style={{ backgroundColor: "#C6CFED" }}
              />
            </Form.Item>

            <Form.Item
              name="address"
              // rules={[{ required: true, message: "Please enter the address" }]}
            >
              <Input
                placeholder="Address"
                style={{ backgroundColor: "#C6CFED" }}
              />
            </Form.Item>

            <section style={{ display: "flex", gap: "2rem" }}>
              <Form.Item name="zipCode">
                <Input
                  placeholder="Zip Code"
                  style={{ backgroundColor: "#C6CFED" }}
                />
              </Form.Item>
              <Form.Item name="city">
                <Input
                  placeholder="City"
                  style={{ backgroundColor: "#C6CFED", width: "17rem" }}
                />
              </Form.Item>
            </section>

            <Form.Item
              name="farmPhoneNumber"
              // rules={[
              //   { required: true, message: "Please enter the phone number" },
              // ]}
            >
              <Input
                placeholder="Phone Number"
                style={{ backgroundColor: "#C6CFED" }}
              />
            </Form.Item>

            <Form.Item
              name="farmEmail"
              // rules={[
              //   { required: true, message: "Please enter the email" },
              //   { type: "email", message: "Please enter a valid email" },
              // ]}
            >
              <Input
                placeholder="Email"
                style={{ backgroundColor: "#C6CFED" }}
              />
            </Form.Item>

            <Form.Item
              name="description"
              // rules={[
              //   { required: true, message: "Please enter a description" },
              // ]}
            >
              <TextArea
                autoSize={{ minRows: 3, maxRows: 5 }}
                placeholder="Description"
                style={{ backgroundColor: "#C6CFED" }}
              />
            </Form.Item>

            <Form.Item>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{
                    backgroundColor: "#1F41BB",
                    color: "#fff",
                    width: "10rem",
                  }}
                >
                  Update
                </Button>
              </div>
            </Form.Item>
          </Form>
        </section>
      </PageContainer>
    </ProtectedRoute>
  );
}

export default Page;
