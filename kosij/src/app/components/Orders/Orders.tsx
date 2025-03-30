import React from "react";
import { Card, Table, Descriptions, Collapse, Divider, Image } from "antd";
import { Button } from "@/components/ui/button";

import { BoxAllocation, OrderData, OrderDetail } from "@/model/OrderInfoProps";
import { useParams, useRouter } from "next/navigation";
import { EyeOutlined } from "@ant-design/icons";
interface OrderInfoProps {
  data: OrderData;
}
const OrderInfo: React.FC<OrderInfoProps> = ({ data }) => {
  const { role } = useParams();
  const router = useRouter();
  const handleAssign = () => {
    router.push(`/manager/selectStaff/deliveries?trackId=${data.id}`);
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
      {role === "manager" && data.orderStatus === "Packaged" && (
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={handleAssign}>
            Assign
          </Button>
        </div>
      )}
    </Card>
  );
};

export default OrderInfo;
