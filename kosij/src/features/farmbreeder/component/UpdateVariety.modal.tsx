// // import React, { useEffect, useState } from "react";
// // import { Modal, Input, Button, Form, Upload, App } from "antd";
// // import {
// //   ArrowLeftOutlined,
// //   ArrowRightOutlined,
// //   UploadOutlined,
// // } from "@ant-design/icons";
// // import api from "@/config/axios.config";
// // import { Image } from "antd";
// // interface UpdateVarietyModalProps {
// //   visible: boolean;
// //   onCancel: () => void;
// //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //   onSubmit: (values: any) => void;
// //   varietyId?: number;
// // }

// // function UpdateVarietyModal({
// //   visible,
// //   onCancel,
// //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
// //   onSubmit,
// //   varietyId,
// // }: UpdateVarietyModalProps) {
// //   const [form] = Form.useForm();
// //   const [loading, setLoading] = useState(false);
// //   const [imageFile, setImageFile] = useState<File | null>(null);
// //   const { message } = App.useApp();

// //   const handleSubmit = async (values: {
// //     description: string;
// //     imageUrl?: string;
// //   }) => {
// //     if (!varietyId) {
// //       message.error("Variety ID is missing!");
// //       return;
// //     }
// //     setLoading(true);
// //     try {
// //       await api.put(`/farm-variety/variety/${varietyId}/current-farm`, {
// //         description: values.description,
// //         imageUrl: values.imageUrl,
// //       });

// //       message.success("Variety updated successfully!");
// //       onCancel();
// //       // eslint-disable-next-line @typescript-eslint/no-unused-vars
// //     } catch (error) {
// //       message.error("Failed to update variety.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (visible) {
// //       form.resetFields();
// //     }
// //   }, [visible, form]);

// //   return (
// //     <App>
// //       <Modal
// //         title="Update Variety"
// //         open={visible}
// //         onCancel={onCancel}
// //         footer={null}
// //         centered
// //       >
// //         <p style={{ color: "#6B7280" }}>
// //           Please fill in the details below to update the variety.
// //         </p>

// //         <Form
// //           form={form}
// //           layout="vertical"
// //           onFinish={(values) => {
// //             console.log("Submitting form...", values);
// //             handleSubmit(values);
// //           }}
// //         >
// //           {/* Description */}
// //           <Form.Item
// //             label="Description"
// //             name="description"
// //             rules={[{ message: "Please enter description" }]}
// //           >
// //             <Input.TextArea placeholder="Enter description" rows={4} />
// //           </Form.Item>

// //           {/* Image Upload */}
// //           <Form.Item label="Image">
// //             <Upload
// //               accept=".jpg,.jpeg,.png"
// //               showUploadList={false}
// //               beforeUpload={(file) => {
// //                 setImageFile(file);
// //                 form.setFieldsValue({ imageUrl: URL.createObjectURL(file) });
// //                 return false;
// //               }}
// //             >
// //               <Button icon={<UploadOutlined />}>Upload Image</Button>
// //             </Upload>

// //             {/* Preview the uploaded image */}
// //             {form.getFieldValue("imageUrl") && (
// //               <div style={{ marginTop: 10 }}>
// //                 <Image
// //                   src={form.getFieldValue("imageUrl")}
// //                   alt="Uploaded"
// //                   width="100%"
// //                   height={200}
// //                   style={{ objectFit: "cover" }}
// //                   preview={false}
// //                 />
// //               </div>
// //             )}
// //           </Form.Item>

// //           {/* Buttons */}
// //           <div
// //             style={{
// //               display: "flex",
// //               justifyContent: "space-between",
// //               marginTop: "1rem",
// //             }}
// //           >
// //             <Button type="link" icon={<ArrowLeftOutlined />} onClick={onCancel}>
// //               Cancel
// //             </Button>
// //             <Button
// //               type="primary"
// //               icon={<ArrowRightOutlined />}
// //               loading={loading}
// //               onClick={() => form.submit()}
// //             >
// //               Update Variety
// //             </Button>
// //           </div>
// //         </Form>
// //       </Modal>
// //     </App>
// //   );
// // }

// // export default UpdateVarietyModal;
// import React, { useEffect, useState } from "react";
// import { Modal, Input, Button, Form, Upload, App, Image } from "antd";
// import {
//   ArrowLeftOutlined,
//   ArrowRightOutlined,
//   UploadOutlined,
// } from "@ant-design/icons";
// import api from "@/config/axios.config";

// interface UpdateVarietyModalProps {
//   visible: boolean;
//   onCancel: () => void;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   onSubmit: (values: any) => void;
//   varietyId?: number;
// }

// function UpdateVarietyModal({
//   visible,
//   onCancel,
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   onSubmit,
//   varietyId,
// }: UpdateVarietyModalProps) {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const { message } = App.useApp();

//   const handleSubmit = async (values: { description: string }) => {
//     if (!varietyId) {
//       message.error("Variety ID is missing!");
//       return;
//     }

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("description", values.description);
//       if (imageFile) {
//         formData.append("image", imageFile);
//       }

//       await api.put(`/farm-variety/variety/${varietyId}/current-farm`, formData, {
//         headers: {
//         },
//       });

//       message.success("Variety updated successfully!");
//       onCancel();
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (error) {
//       message.error("Failed to update variety.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (visible) {
//       form.resetFields();
//       setImageFile(null);
//       setPreviewImage(null);
//     }
//   }, [visible, form]);

//   return (
//     <App>
//       <Modal title="Update Variety" open={visible} onCancel={onCancel} footer={null} centered>
//         <p style={{ color: "#6B7280" }}>
//           Please fill in the details below to update the variety.
//         </p>

//         <Form form={form} layout="vertical" onFinish={handleSubmit}>
//           {/* Description */}
//           <Form.Item
//             label="Description"
//             name="description"
//             rules={[{ message: "Please enter a description" }]}
//           >
//             <Input.TextArea placeholder="Enter description" rows={4} />
//           </Form.Item>

//           {/* Image Upload */}
//           <Form.Item label="Image">
//             <Upload
//               accept=".jpg,.jpeg,.png"
//               showUploadList={false}
//               beforeUpload={(file) => {
//                 setImageFile(file);
//                 const previewUrl = URL.createObjectURL(file);
//                 setPreviewImage(previewUrl);
//                 return false;
//               }}
//             >
//               <Button icon={<UploadOutlined />}>Upload Image</Button>
//             </Upload>

//             {/* Preview the uploaded image */}
//             {previewImage && (
//               <div style={{ marginTop: 10 }}>
//                 <Image
//                   src={previewImage}
//                   alt="Uploaded"
//                   width="100%"
//                   height={200}
//                   style={{ objectFit: "cover" }}
//                   preview={false}
//                 />
//               </div>
//             )}
//           </Form.Item>

//           {/* Buttons */}
//           <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
//             <Button type="link" icon={<ArrowLeftOutlined />} onClick={onCancel}>
//               Cancel
//             </Button>
//             <Button
//               type="primary"
//               icon={<ArrowRightOutlined />}
//               loading={loading}
//               onClick={() => form.submit()}
//             >
//               Update Variety
//             </Button>
//           </div>
//         </Form>
//       </Modal>
//     </App>
//   );
// }

// export default UpdateVarietyModal;

import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Form, Upload, App, Image } from "antd";
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
  varietyId?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function UpdateVarietyModal({
  visible,
  onCancel,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSubmit,
  varietyId,
}: UpdateVarietyModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { message } = App.useApp();

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  //handle submit upload ảnh lên firebase BE chỉ lưu URL dưới dạng string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: { description: string }) => {
    console.log("Submitting form...");
    console.log("Current imageFile:", imageFile);
  
    if (!imageFile) {
      message.error("Please upload an image.");
      return;
    }
  
    setLoading(true);
    try {
      // Convert image to Base64
      const base64Image = await convertToBase64(imageFile);
  
      const payload = {
        description: values.description,
        imageUrl: base64Image, // Send as Base64 string
      };
  
      console.log("Payload:", payload);
  
      await api.put(`/farm-variety/variety/${varietyId}/current-farm`, payload, {
        headers: { "Content-Type": "application/json" }, // API expects JSON, not multipart/form-data
      });
  
      message.success("Variety updated successfully!");
      onCancel();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error("Failed to update variety.");
      console.error("API Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setImageFile(null);
      setPreviewImage(null);
    }
  }, [visible, form]);

  useEffect(() => {
    console.log("imageFile state updated:", imageFile);
  }, [imageFile]);

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
        {/* Description */}
        <Form.Item
          label="Description"
          name="description"
          rules={[{ message: "Please enter a description" }]}
        >
          <Input.TextArea placeholder="Enter description" rows={4} />
        </Form.Item>

        {/* Image Upload */}
        <Form.Item
          label="Image"
          name="image"
          rules={[{ required: true, message: "Please upload an image." }]}
        >
          <Upload
            accept=".jpg,.jpeg,.png"
            showUploadList={false}
            beforeUpload={(file) => {
              console.log("beforeUpload triggered!"); // ✅ Confirm function runs
              console.log("Selected file:", file); // ✅ See if a file is detected

              setImageFile(file); // ✅ Store file in state
              const previewUrl = URL.createObjectURL(file);
              setPreviewImage(previewUrl); // ✅ Show preview

              return false; // Prevent automatic upload
            }}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>

          {previewImage && (
            <div style={{ marginTop: 10 }}>
              <Image
                src={previewImage}
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
  );
}

export default UpdateVarietyModal;
