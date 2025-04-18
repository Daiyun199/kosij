import React, { useState } from "react";
import {
  Card,
  Table,
  Descriptions,
  Collapse,
  Divider,
  Image,
  Popconfirm,
  Input,
  Modal,
} from "antd";
import { Button } from "@/components/ui/button";

import { BoxAllocation, OrderData, OrderDetail } from "@/model/OrderInfoProps";
import { useParams, useRouter } from "next/navigation";
import { EyeOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import api from "@/config/axios.config";
interface OrderInfoProps {
  data: OrderData;
  onActionComplete?: () => void;
}
const OrderInfo: React.FC<OrderInfoProps> = ({ data, onActionComplete }) => {
  const { role } = useParams();
  const router = useRouter();
  const handleAssign = () => {
    router.push(`/manager/selectStaff/deliveries?trackId=${data.id}`);
  };
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [denyReason, setDenyReason] = useState("");
  const [actionType, setActionType] = useState<"approve" | "deny">("approve");
  const showModal = (type: "approve" | "deny") => {
    setActionType(type);
    if (type === "deny") {
      setIsModalVisible(true);
    }
  };

  const handleOk = () => {
    if (actionType === "deny" && !denyReason.trim()) {
      toast.error("Please enter a reason for denial");
      return;
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setDenyReason("");
  };
  const handleExport = async () => {
    try {
      const response = await api.post(
        `order/${data.id}/export-bill`,
        {},
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url); // Set blob URL để hiển thị
      setIsPdfModalVisible(true);
    } catch (error) {
      toast.error("Failed to generate bill preview");
      console.error("Export failed", error);
    }
  };

  const handleConfirmAction = async () => {
    try {
      const requestBody = {
        isApproved: actionType === "approve",
        deniedReason: actionType === "deny" ? denyReason : "",
      };

      const response = await api.put(
        `order/${data.id}/approve-fish-death-refund`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(
          actionType === "approve"
            ? "Refund approved successfully!"
            : "Refund denied successfully!"
        );
        if (onActionComplete) {
          onActionComplete();
        }
      } else {
        throw new Error("Failed to process refund");
      }
    } catch (error) {
      toast.error("An error occurred while processing the refund");
      console.error(error);
    } finally {
      setDenyReason("");
    }
  };
  return (
    <Card title={`Order #${data.id}`} className="shadow-md p-4">
      <Descriptions
        title="Customer Information"
        bordered
        column={1}
        size="middle"
      >
        <Descriptions.Item label="Customer Name">
          {data.fullName}
        </Descriptions.Item>
        <Descriptions.Item label="Phone Number">
          {data.phoneNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Delivery Address">
          {data.deliveryAddress}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions title="Order Details" bordered column={1} size="middle">
        <Descriptions.Item label="Total Fish Value">
          {data.totalFishAmount.toLocaleString()} VNĐ
        </Descriptions.Item>
        <Descriptions.Item label="Total Delivery Fee">
          {data.totalDeliveringAmount.toLocaleString()} VNĐ
        </Descriptions.Item>
        <Descriptions.Item label="Total Order Amount">
          {data.totalOrderAmount.toLocaleString()} VNĐ
        </Descriptions.Item>
        <Descriptions.Item label="Order Status">
          {data.orderStatus}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions
        title="Payment Information"
        bordered
        column={1}
        size="middle"
      >
        <Descriptions.Item label="Paid Amount">
          {data.paidAmount.toLocaleString()} VNĐ
        </Descriptions.Item>
        <Descriptions.Item label="Remaining Amount">
          {data.remaining.toLocaleString()} VNĐ
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions
        title="Delivery & Commission Information"
        bordered
        column={1}
        size="middle"
      >
        <Descriptions.Item label="Commission Percentage">
          {data.commissionPercentage}%
        </Descriptions.Item>
        <Descriptions.Item label="Total Commission">
          {data.totalCommission.toLocaleString()} VNĐ
        </Descriptions.Item>
        <Descriptions.Item label="Total After Commission">
          {data.totalAfterCommission.toLocaleString()} VNĐ
        </Descriptions.Item>
        <Descriptions.Item label="Expected Delivery Date">
          {new Date(data.expectedDeliveryDate).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Delivery Staff">
          {data.deliveryStaffName}
        </Descriptions.Item>
      </Descriptions>
      <Collapse defaultActiveKey={["1", "2"]} className="mt-4">
        <Collapse.Panel header="Order Details" key="1">
          <Table
            dataSource={data.orderDetails}
            rowKey="id"
            pagination={false}
            columns={[
              { title: "Variety", dataIndex: "variety", key: "variety" },
              { title: "Quantity", dataIndex: "quantity", key: "quantity" },
              { title: "Length (cm)", dataIndex: "length", key: "length" },
              { title: "Weight (kg)", dataIndex: "weight", key: "weight" },
              { title: "Koi Price", dataIndex: "koiPrice", key: "koiPrice" },
              {
                title: "Images",
                key: "orderDetailImages",
                render: (_, record: OrderDetail) => (
                  <div className="flex space-x-2">
                    {record.orderDetailImages.map((img) => (
                      <Image
                        key={img.id}
                        src={img.imageUrl}
                        alt="Order Image"
                        width={50}
                        height={50}
                        className="rounded-md object-cover border border-gray-200 shadow-sm"
                        preview={{
                          mask: <EyeOutlined className="text-white" />,
                          maskClassName: "rounded-md",
                        }}
                      />
                    ))}
                  </div>
                ),
              },
            ]}
          />
        </Collapse.Panel>

        <Collapse.Panel header="Box Allocations" key="2">
          <Table
            dataSource={data.boxAllocations}
            rowKey="id"
            pagination={false}
            columns={[
              { title: "Box Type", dataIndex: "boxType", key: "boxType" },
              { title: "Quantity", dataIndex: "quantity", key: "quantity" },
              { title: "Cost", dataIndex: "cost", key: "cost" },
              {
                title: "Varieties in Box",
                key: "varieties",
                render: (_, record: BoxAllocation) =>
                  record.varieties.map((v) => v.varietyName).join(", "),
              },
            ]}
          />
        </Collapse.Panel>
      </Collapse>
      {role === "manager" && (
        <div className="mt-4 flex justify-between items-center">
          <Button variant="outline" onClick={handleExport}>
            Export
          </Button>

          <div className="flex space-x-2">
            {data.orderStatus === "Packaged" && (
              <Button variant="outline" onClick={handleAssign}>
                Assign
              </Button>
            )}
            {data.orderStatus === "PendingRefund" && (
              <>
                <Popconfirm
                  title="Are you sure to approve this refund?"
                  onConfirm={handleConfirmAction}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    variant="outline"
                    onClick={() => showModal("approve")}
                    className="bg-green-500 text-white hover:bg-green-600"
                  >
                    Approve Refund
                  </Button>
                </Popconfirm>

                <Button
                  variant="outline"
                  onClick={() => showModal("deny")}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Deny Refund
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <Modal
        title="Deny Refund Reason"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Popconfirm
            key="submit"
            title="Are you sure to deny this refund?"
            onConfirm={handleConfirmAction}
            okText="Yes"
            cancelText="No"
          >
            <Button key="submit" type="button">
              Submit
            </Button>
          </Popconfirm>,
        ]}
      >
        <Input.TextArea
          rows={4}
          value={denyReason}
          onChange={(e) => setDenyReason(e.target.value)}
          placeholder="Please enter the reason for denying the refund..."
        />
      </Modal>
      <Modal
        title="Exported Bill Preview"
        visible={isPdfModalVisible}
        onCancel={() => {
          setIsPdfModalVisible(false);
          setPdfUrl(null);
        }}
        footer={[
          <Button key="cancel" onClick={() => setIsPdfModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="download"
            onClick={() => {
              if (pdfUrl) {
                const link = document.createElement("a");
                link.href = pdfUrl;
                link.download = `Invoice_${data.fullName}_${data.id}.pdf`;
                document.body.appendChild(link);
                link.click();
                link.remove();
              }
            }}
            style={{ marginLeft: "10px" }}
          >
            Download
          </Button>,
        ]}
        width={800}
      >
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            title="Bill PDF"
            width="100%"
            height="600px"
            style={{ border: "none" }}
          />
        )}
      </Modal>
    </Card>
  );
};

export default OrderInfo;
