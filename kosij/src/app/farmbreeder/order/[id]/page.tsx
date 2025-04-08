"use client";

import ProtectedRoute from "@/app/ProtectedRoute";
import { fetchOrderDetails } from "@/features/farmbreeder/api/order/one-byId.api";
import { updateOrderStatus } from "@/features/farmbreeder/api/order/update.api";
import { Order, OrderDetail } from "@/lib/domain/Order/Order.dto";
import { PageContainer } from "@ant-design/pro-layout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, Descriptions, Table, Button, Tag } from "antd";
import { useParams, useRouter } from "next/navigation";

const statusColors: { [key in Order["orderStatus"]]: string } = {
  Pending: "default",
  Deposited: "orange",
  Packaged: "blue",
  Delivering: "gold",
  Delivered: "green",
  Cancelled: "red",
  Refunded: "purple",
};

function Page() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { data, isLoading, refetch } = useQuery<Order>({
    queryKey: ["currentFarmOrderDetails", id],
    queryFn: fetchOrderDetails,
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      refetch();
      console.log("Order status updated!");
    },
    onError: (error) => {
      console.error("Error updating order status", error);
    },
  });

  const handleStatusChange = async (
    status: Order["orderStatus"],
    orderId: number
  ) => {
    try {
      await mutation.mutateAsync({ status, orderId });
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  const orderDetails = data?.orderDetails || [];
  const deliveryInfo = {
    staffName: data?.deliveryStaffName || "N/A",
    expectedDelivery: data?.expectedDeliveryDate || "N/A",
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "id",
      key: "key",
      align: "center" as const,
    },
    {
      title: "Image",
      key: "image",
      align: "center" as const,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: OrderDetail) => {
        const imageUrl = record.orderDetailImages[0]?.imageUrl;
        return imageUrl ? (
          <img src={imageUrl} alt="koi" style={{ width: 100 }} />
        ) : (
          "No Image"
        );
      },
    },

    {
      title: "Name",
      dataIndex: "variety",
      key: "name",
      align: "center" as const,
    },
    {
      title: "Length",
      dataIndex: "length",
      key: "length",
      align: "center" as const,
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
      align: "center" as const,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center" as const,
    },
    {
      title: "Price",
      dataIndex: "koiPrice",
      key: "price",
      align: "center" as const,
      render: (value: number) => `${value.toLocaleString()} VND`,
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["farmbreeder"]}>
      <PageContainer
        title="Order Detail"
        loading={isLoading}
        header={{
          title: (
            <div className="flex">
              <Button
                onClick={() => router.back()} // Navigate back to the previous page
                type="text"
                style={{ fontSize: "20px" }}
              >
                &lt;
              </Button>
              <h1>Order Detail</h1>
            </div>
          ),
        }}
      >
        <Card>
          <Descriptions
            title={`Order ${data?.orderId}`}
            column={1}
            extra={
              <Tag
                className="rounded-xl"
                color={statusColors[data?.orderStatus || "Pending"]}
              >
                {data?.orderStatus}
              </Tag>
            }
          >
            <Descriptions.Item label="Customer Information">
              <Descriptions>
                <Descriptions.Item label="Name">
                  {data?.fullName || "N/A"}{" "}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {data?.phoneNumber || "N/A"}{" "}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  {data?.deliveryAddress || "N/A"}{" "}
                </Descriptions.Item>
              </Descriptions>
            </Descriptions.Item>
            <Descriptions.Item label="Delivery Information">
              <Descriptions>
                <Descriptions.Item label="Staff Name">
                  {deliveryInfo.staffName}
                </Descriptions.Item>
                <Descriptions.Item label="Expected Delivery">
                  {deliveryInfo.expectedDelivery}
                </Descriptions.Item>
              </Descriptions>
            </Descriptions.Item>
            <Descriptions.Item label="Customer Notes">
              {data?.note}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card className="mt-3">
          <Table
            columns={columns}
            dataSource={orderDetails}
            pagination={false}
          />
          <div className="mt-4">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 60,
                borderBottom: "1px solid #dcdcdc",
                paddingBottom: "8px",
                marginBottom: "8px",
              }}
            >
              <span>Total Order:</span>
              <strong>{data?.totalOrderAmount.toLocaleString()} VND</strong>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 60,
                paddingBottom: "8px",
                marginBottom: "8px",
              }}
            >
              <span>Amount:</span>
              <strong>{data?.totalAfterCommission.toLocaleString()} VND</strong>
            </div>
          </div>
        </Card>
        <div className="mt-3 flex justify-end">
          <Button
            type="primary"
            onClick={
              () => handleStatusChange("Packed", data?.orderId || 0) // Pass fixed status and orderId
            }
          >
            Mark as Packed
          </Button>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}

export default Page;
