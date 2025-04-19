/* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { ProColumns, ProTable } from "@ant-design/pro-components";
// import { PageContainer } from "@ant-design/pro-layout";
// import { Button, Space, Tag, Dropdown, Menu } from "antd";
// import { EyeOutlined } from "@ant-design/icons";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { fetchCurrentFarmOrders } from "@/features/farmbreeder/api/order/all.api";
// import { updateOrderStatus } from "@/features/farmbreeder/api/order/update.api";
// import { Order } from "@/lib/domain/Order/Order.dto";
// import dayjs from "dayjs";
// import ProtectedRoute from "@/app/ProtectedRoute";
// import { useRouter } from "next/navigation";

// const statusColors: { [key in Order["orderStatus"]]: string } = {
//   Pending: "default",
//   Deposited: "orange",
//   Packed: "blue",
//   Delivering: "gold",
//   Delivered: "green",
//   Cancelled: "red",
//   Refunded: "purple",
// };

// function Page() {
//   const router = useRouter();
//   const { data, isLoading, refetch } = useQuery({
//     queryKey: ["currentFarmOrders"],
//     queryFn: fetchCurrentFarmOrders,
//   });

//   const mutation = useMutation({
//     mutationFn: updateOrderStatus,
//     onSuccess: () => {
//       refetch();
//       console.log("Order status updated!");
//     },
//     onError: (error) => {
//       console.error("Error updating order status", error);
//     },
//   });

//   const handleStatusChange = async (
//     status: Order["orderStatus"],
//     orderId: number
//   ) => {
//     try {
//       await mutation.mutateAsync({ status, orderId });
//     } catch (error) {
//       console.error("Error updating order status", error);
//     }
//   };

//   const columns: ProColumns<Order>[] = [
//     {
//       title: "ID",
//       dataIndex: "orderId",
//       key: "orderId",
//       width: 98,
//     },
//     {
//       title: "Customer Name",
//       dataIndex: "fullName",
//       key: "fullName",
//     },
//     {
//       title: "Order Date",
//       dataIndex: "createdTime",
//       key: "createdTime",
//       render: (_, record) =>
//         record.createdTime
//           ? dayjs(record.createdTime).format("DD-MM-YYYY")
//           : "N/A",
//     },
//     {
//       title: "Delivery Date (Expected)",
//       dataIndex: "expectedDeliveryDate",
//       key: "expectedDeliveryDate",
//       render: (_, record) =>
//         record.createdTime
//           ? dayjs(record.createdTime).format("DD-MM-YYYY")
//           : "N/A",
//     },
//     {
//       title: "Status",
//       dataIndex: "orderStatus",
//       key: "orderStatus",
//       render: (_, record: Order) => (
//         <Dropdown
//           overlay={
//             <Menu
//               onClick={(e) =>
//                 handleStatusChange(
//                   e.key as Order["orderStatus"],
//                   record.orderId
//                 )
//               }
//             >
//               <Menu.Item>Deposited</Menu.Item>
//               <Menu.Item>Packed</Menu.Item>
//             </Menu>
//           }
//           trigger={["click"]}
//         >
//           <Tag color={statusColors[record.orderStatus]}>
//             {record.orderStatus}
//           </Tag>
//         </Dropdown>
//       ),
//     },
//     {
//       title: "Total",
//       dataIndex: "totalOrderAmount",
//       key: "totalOrderAmount",
//       align: "right",
//       render: (_, record: Order) =>
//         `${record.totalOrderAmount.toLocaleString()} VND`,
//     },
//     {
//       title: "Paid",
//       dataIndex: "paidAmount",
//       key: "paidAmount",
//       align: "right",
//       render: (_, record: Order) => (
//         <span style={{ color: "green" }}>
//           {record.paidAmount.toLocaleString()} VND
//         </span>
//       ),
//     },
//     {
//       title: "Remaining",
//       dataIndex: "remaining",
//       key: "remaining",
//       align: "right",
//       render: (_, record: Order) => (
//         <span style={{ color: record.remaining === 0 ? "black" : "red" }}>
//           {record.remaining.toLocaleString()} VND
//         </span>
//       ),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <Space>
//           <Button
//             icon={<EyeOutlined />}
//             onClick={() => {
//               router.push(`/farmbreeder/order/${record.orderId}`);
//               console.log("id: ", record.orderId);
//             }}
//           />
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <ProtectedRoute allowedRoles={["farmbreeder"]}>
//       <PageContainer
//         title="Order List"
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
//         {" "}
//         <section className="mt-5">
//           <ProTable<Order>
//             columns={columns}
//             dataSource={data}
//             rowKey="orderId"
//             search={false}
//             pagination={{
//               pageSize: 5,
//               showTotal: (total) => `Total ${total} record(s)`,
//             }}
//             loading={isLoading}
//             onRow={(record) => ({
//               onClick: () => {
//                 router.push(`/farmbreeder/order/${record.orderId}`);
//                 console.log("Navigated to order ID:", record.orderId);
//               },
//             })}
//           />
//         </section>
//       </PageContainer>
//     </ProtectedRoute>
//   );
// }

// export default Page;
"use client";

import {
  ProColumns,
  ProFormInstance,
  ProTable,
} from "@ant-design/pro-components";
import { PageContainer } from "@ant-design/pro-layout";
import { Button, Space, Tag, Dropdown, Menu } from "antd";
import { DownOutlined, EyeOutlined, UpOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchCurrentFarmOrders } from "@/features/farmbreeder/api/order/all.api";
import { updateOrderStatus } from "@/features/farmbreeder/api/order/update.api";
import { Order } from "@/lib/domain/Order/Order.dto";
import dayjs from "dayjs";
import ProtectedRoute from "@/app/ProtectedRoute";
import { useRouter } from "next/navigation";
import enUS from "antd/es/calendar/locale/en_US";
import { useRef, useState } from "react";

const statusColors: { [key in Order["orderStatus"]]: string } = {
  Pending: "default",
  Deposited: "orange",
  Packed: "blue",
  Delivering: "gold",
  Delivered: "green",
  Cancelled: "red",
  Refunded: "purple",
};

function Page() {
  const router = useRouter();
  const formRef = useRef<ProFormInstance>();
  const [searchParams, setSearchParams] = useState<{
    createdTime?: string;
    expectedDeliveryDate?: string;
    fullName?: string;
    orderStatus?: string;
    totalOrderAmount?: number;
  }>({});
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

  const normalizeValue = (value: string | undefined): string | undefined => {
    if (!value) return value;
    return value
      .toLowerCase()
      .replace(/(^|\s)\w/g, (letter) => letter.toUpperCase());
  };

  const columns: ProColumns<Order>[] = [
    {
      title: "ID",
      dataIndex: "orderId",
      key: "orderId",
      width: 98,
      search: false,
    },
    {
      title: "Customer Name",
      dataIndex: "fullName",
      key: "fullName",
      ellipsis: true,
      fieldProps: {
        placeholder: "Enter text",
      },
      valueType: "text",
      search: {
        transform: (value) => ({
          fullName: value,
        }),
      },
      formItemProps: {
        label: "Customer Name",
        tooltip: "Search by customer name",
      },
    },
    // {
    //   title: "Order Date",
    //   dataIndex: "createdTime",
    //   key: "createdTime",
    //   render: (_, record) =>
    //     record.createdTime
    //       ? dayjs(record.createdTime).format("DD-MM-YYYY")
    //       : "N/A",
    // },
    // {
    //   title: "Delivery Date (Expected)",
    //   dataIndex: "expectedDeliveryDate",
    //   key: "expectedDeliveryDate",
    //   render: (_, record) =>
    //     record.createdTime
    //       ? dayjs(record.createdTime).format("DD-MM-YYYY")
    //       : "N/A",
    // },
    {
      title: "Order Date",
      dataIndex: "createdTime",
      key: "createdTime",
      valueType: "date",
      fieldProps: {
        format: "DD-MM-YYYY",
        placeholder: "Select order date",
        locale: enUS,
      },
      search: {
        transform: (value: string) => ({
          createdTime: value,
        }),
      },
      render: (_, record) =>
        record.createdTime
          ? dayjs(record.createdTime).format("DD-MM-YYYY")
          : "N/A",
    },
    {
      title: "Delivery Date (Expected)",
      dataIndex: "expectedDeliveryDate",
      key: "expectedDeliveryDate",
      valueType: "date",
      fieldProps: {
        format: "DD-MM-YYYY",
        placeholder: "Select delivery date",
        locale: enUS,
      },
      search: {
        transform: (value: string) => ({
          expectedDeliveryDate: value,
        }),
      },
      render: (_, record) =>
        record.expectedDeliveryDate
          ? dayjs(record.expectedDeliveryDate).format("DD-MM-YYYY")
          : "N/A",
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      fieldProps: {
        placeholder: "Select status",
      },
      valueType: "select",
      valueEnum: {
        Deposited: { text: "Deposited", status: "Deposited" },
        Packed: { text: "Packed", status: "Packed" },
        Delivered: { text: "Delivered", status: "Delivered" },
        Delivering: { text: "Delivering", status: "Delivering" },
        Cancelled: { text: "Cancelled", status: "Cancelled" },
        Refunded: { text: "Refunded", status: "Refunded" },
      },
      search: {
        transform: (value) => {
          const normalized = normalizeValue(value);
          console.log(`Transformed orderStatus: ${value} -> ${normalized}`);
          return { orderStatus: normalized };
        },
      },
      formItemProps: {
        label: "Status",
        tooltip: "Search by order status",
      },
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
      fieldProps: {
        placeholder: "Enter number",
      },
      ellipsis: true,
      search: {
        transform: (value) => ({
          totalOrderAmount: value,
        }),
      },
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
      search: false,
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
      search: false,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              router.push(`/farmbreeder/order/${record.orderId}`);
              console.log("id: ", record.orderId);
            }}
          />
        </Space>
      ),
      search: false,
    },
  ];

  const normalizedData = data?.map(
    (item: {
      orderStatus: string;
      createdTime: string;
      expectedDeliveryDate: string;
    }) => ({
      ...item,
      orderStatus: normalizeValue(item.orderStatus) ?? item.orderStatus,
      createdTime: item.createdTime
        ? dayjs(item.createdTime).format("DD-MM-YYYY")
        : undefined,
      expectedDeliveryDate: item.expectedDeliveryDate
        ? dayjs(item.expectedDeliveryDate).format("DD-MM-YYYY")
        : undefined,
    })
  );

  const filteredData =
    data?.filter(
      (item: {
        createdTime: string | Date | dayjs.Dayjs;
        expectedDeliveryDate: string | Date | dayjs.Dayjs;
        fullName: string;
        orderStatus: string;
        totalOrderAmount: number;
      }) => {
        const matchesCreatedTime = searchParams.createdTime
          ? dayjs(item.createdTime).isValid() &&
            dayjs(item.createdTime).format("DD-MM-YYYY") ===
              dayjs(searchParams.createdTime).format("DD-MM-YYYY")
          : true;
        const matchesDeliveryDate = searchParams.expectedDeliveryDate
          ? dayjs(item.expectedDeliveryDate).isValid() &&
            dayjs(item.expectedDeliveryDate).format("DD-MM-YYYY") ===
              dayjs(searchParams.expectedDeliveryDate).format("DD-MM-YYYY")
          : true;
        const matchesCustomerName = searchParams.fullName
          ? item.fullName
              ?.toLowerCase()
              .includes(searchParams.fullName.toLowerCase().trim())
          : true;
        const matchesStatus = searchParams.orderStatus
          ? normalizeValue(item.orderStatus) ===
            normalizeValue(searchParams.orderStatus)
          : true;
        const matchesNumber = searchParams.totalOrderAmount
          ? item.totalOrderAmount === Number(searchParams.totalOrderAmount)
          : true;

        return (
          matchesCreatedTime &&
          matchesDeliveryDate &&
          matchesStatus &&
          matchesCustomerName &&
          matchesNumber
        );
      }
    ) ?? [];

  console.log("API Data:", data);
  console.log("Search Params:", searchParams);
  console.log("Filtered Data:", filteredData);

  return (
    <ProtectedRoute allowedRoles={["farmbreeder"]}>
      <PageContainer
        title="Order List"
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
        {" "}
        <section className="mt-5">
          <ProTable<Order>
            columns={columns}
            // dataSource={data}
            dataSource={
              filteredData.length > 0 ? filteredData : normalizedData ?? []
            }
            rowKey="orderId"
            formRef={formRef}
            search={{
              labelWidth: "auto",
              optionRender: () => [
                <Button
                  key="search"
                  type="primary"
                  onClick={() => {
                    const values = formRef.current?.getFieldsValue();
                    console.log("Search Values:", values);
                    setSearchParams({
                      fullName: values.fullName || undefined,
                      createdTime: values.createdTime
                        ? dayjs(values.createdTime).format("DD-MM-YYYY")
                        : undefined,
                      expectedDeliveryDate: values.expectedDeliveryDate
                        ? dayjs(values.expectedDeliveryDate).format(
                            "DD-MM-YYYY"
                          )
                        : undefined,
                      orderStatus: values.orderStatus
                        ? normalizeValue(values.orderStatus)
                        : undefined,
                      totalOrderAmount: values.totalOrderAmount
                        ? Number(values.totalOrderAmount)
                        : undefined,
                    });
                  }}
                >
                  Search
                </Button>,
                <Button
                  key="reset"
                  onClick={() => {
                    formRef.current?.resetFields();
                    setSearchParams({});
                    console.log("Reset Search Params:", searchParams);
                  }}
                >
                  Reset
                </Button>,
              ],
              collapseRender: (collapsed) => {
                return (
                  <Button type="link" style={{ padding: 0 }}>
                    {collapsed ? (
                      <>
                        Expand <DownOutlined />
                      </>
                    ) : (
                      <>
                        Collapse <UpOutlined />
                      </>
                    )}
                  </Button>
                );
              },
            }}
            pagination={{
              pageSize: 5,
              showTotal: (total) => `Total ${total} record(s)`,
            }}
            loading={isLoading}
            onRow={(record) => ({
              onClick: () => {
                router.push(`/farmbreeder/order/${record.orderId}`);
                console.log("Navigated to order ID:", record.orderId);
              },
            })}
            locale={{
              emptyText: "No results found. Try adjusting your search filters.",
            }}
          />
        </section>
      </PageContainer>
    </ProtectedRoute>
  );
}

export default Page;
