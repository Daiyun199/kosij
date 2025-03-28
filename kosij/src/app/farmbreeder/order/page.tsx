"use client";

import { ProColumns, ProTable } from "@ant-design/pro-components";
import { PageContainer } from "@ant-design/pro-layout";
import { Button, Space, Tag, Dropdown, Menu } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchCurrentFarmOrders } from "@/features/farmbreeder/api/order/all.api";
import { updateOrderStatus } from "@/features/farmbreeder/api/order/update.api";
import { Order } from "@/lib/domain/Order/Order.dto";
import dayjs from "dayjs";

const statusColors: { [key in Order["orderStatus"]]: string } = {
  Pending: "default",
  Unpacked: "default",
  Packed: "blue",
  Shipping: "gold",
  Completed: "green",
  Cancelled: "red",
};

function Page() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["currentFarmOrders"],
    queryFn: fetchCurrentFarmOrders,
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

  const columns: ProColumns<Order>[] = [
    {
      title: "ID",
      dataIndex: "orderId",
      key: "orderId",
      width: 98,
    },
    {
      title: "Customer Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Order Date",
      dataIndex: "createdTime",
      key: "createdTime",
      render: (_, record) =>
        record.createdTime
          ? dayjs(record.createdTime).format("DD-MM-YYYY")
          : "N/A",
    },
    {
      title: "Delivery Date (Expected)",
      dataIndex: "expectedDeliveryDate",
      key: "expectedDeliveryDate",
      render: (_, record) =>
        record.createdTime
          ? dayjs(record.createdTime).format("DD-MM-YYYY")
          : "N/A",
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (_, record: Order) => (
        <Dropdown
          overlay={
            <Menu
              onClick={(e) =>
                handleStatusChange(
                  e.key as Order["orderStatus"],
                  record.orderId
                )
              }
            >
              <Menu.Item>Deposited</Menu.Item>
              <Menu.Item>Packed</Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Tag color={statusColors[record.orderStatus]}>
            {record.orderStatus}
          </Tag>
        </Dropdown>
      ),
    },
    {
      title: "Total",
      dataIndex: "totalOrderAmount",
      key: "totalOrderAmount",
      align: "right",
      render: (_, record: Order) =>
        `${record.totalOrderAmount.toLocaleString()} VND`,
    },
    {
      title: "Paid",
      dataIndex: "paidAmount",
      key: "paidAmount",
      align: "right",
      render: (_, record: Order) => (
        <span style={{ color: "green" }}>
          {record.paidAmount.toLocaleString()} VND
        </span>
      ),
    },
    {
      title: "Remaining",
      dataIndex: "remaining",
      key: "remaining",
      align: "right",
      render: (_, record: Order) => (
        <span style={{ color: record.remaining === 0 ? "black" : "red" }}>
          {record.remaining.toLocaleString()} VND
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space>
          <Button icon={<EyeOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="Orders List">
      <section className="mt-5">
        <ProTable<Order>
          columns={columns}
          dataSource={data}
          rowKey="orderId"
          search={false}
          pagination={{
            pageSize: 5,
            showTotal: (total) => `Total ${total} record(s)`,
          }}
          loading={isLoading}
        />
      </section>
    </PageContainer>
  );
}

export default Page;
