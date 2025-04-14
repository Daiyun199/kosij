"use client";

import ProtectedRoute from "@/app/ProtectedRoute";
import { exportOrderBill } from "@/features/farmbreeder/api/order/export.api";
import { fetchOrderDetails } from "@/features/farmbreeder/api/order/one-byId.api";
import { updateOrderStatus } from "@/features/farmbreeder/api/order/update.api";
import { Order, OrderDetail } from "@/lib/domain/Order/Order.dto";
import { PageContainer } from "@ant-design/pro-layout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, Descriptions, Table, Button, Tag, App } from "antd";
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
  const { notification } = App.useApp();
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

  const exportBillMutation = useMutation({
    mutationFn: exportOrderBill,
    onSuccess: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `OrderBill_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      notification.info({
        message: (
          <App>
            <div>
              Bill of Order #{data?.orderId} has been exported successfully.
              <strong>PLEASE CHECK IT NOW!</strong>
              <div
                style={{ color: "#6B7280", fontSize: "12px", marginTop: "4px" }}
              >
                {timeString}
              </div>
            </div>
          </App>
        ),
        placement: "topRight",
        style: {
          backgroundColor: "white",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          borderRadius: "4px",
        },
        icon: <span style={{ color: "#1890ff", fontSize: "30px" }}>ⓘ</span>,
      });
    },
    onError: (error) => {
      console.error("Error exporting bill", error);
      notification.error({
        message: error.message || "Failed to export bill",
        placement: "topRight",
      });
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

  const handleExportBill = () => {
    if (id) {
      exportBillMutation.mutate(id);
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
                onClick={() => router.back()}
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
        <div className="mt-1 mb-3 flex justify-end">
          <Button
            onClick={handleExportBill}
            loading={exportBillMutation.isPending}
          >
            Export Bill
          </Button>
          <Button
            className="ml-3"
            type="primary"
            onClick={() => handleStatusChange("Packed", data?.orderId || 0)}
          >
            Mark as Packed
          </Button>
        </div>
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
      </PageContainer>
    </ProtectedRoute>
  );
}

export default Page;
