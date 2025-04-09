"use client";

import { PageContainer } from "@ant-design/pro-layout";
import { Button, Space, Statistic, Table, Tag } from "antd";
import ClickableArea from "@/app/components/ClickableArea";
import { cn } from "@/lib/utils/cn.util";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  MoneyCollectOutlined,
  ShopOutlined,
  TeamOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Order } from "@/lib/domain/Order/Order.dto";
import { ColumnsType } from "antd/es/table";
import { fetchRecentOrders } from "@/features/farmbreeder/api/order/recent.api";
import { fetchStatistics } from "@/features/farmbreeder/api/dashboard/all.api";
import ProtectedRoute from "@/app/ProtectedRoute";

const statusColors: Record<string, { color: string; background: string }> = {
  Cancelled: { color: "#cf1322", background: "#fff1f0" },
  Delivering: { color: "#ad6800", background: "#fffbe6" },
  Pending: { color: "#595959", background: "#f0f0f0" },
  Deposited: { color: "#ad6800", background: "#fffbe6" },
  Packed: { color: "#1677ff", background: "#e6f4ff" },
  Delivered: { color: "#389e0d", background: "#f6ffed" },
  Refunded: { color: "#722ed1", background: "#f9f0ff" },
};

const formatNumber = (num: { toString: () => string }) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const columns: ColumnsType<Order> = [
  {
    title: "Order ID",
    dataIndex: "orderId",
    key: "orderId",
    fixed: "left",
  },
  {
    title: "Customer Name",
    dataIndex: "fullName",
    key: "customerName",
  },
  {
    title: "Amount",
    dataIndex: "totalOrderAmount",
    key: "amount",
    render: (amount?: number) => (amount ? `${formatNumber(amount)} VND` : "-"),
  },
  {
    title: "Status",
    dataIndex: "orderStatus",
    key: "status",
    render: (status: string) => {
      const style = statusColors[status] || {
        color: "#000",
        background: "#eee",
      };
      return (
        <Tag
          style={{
            color: style.color,
            backgroundColor: style.background,
            borderRadius: 12,
            padding: "4px 12px",
            fontWeight: 500,
          }}
        >
          {status}
        </Tag>
      );
    },
  },
];

function Page() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["farmStatistics"],
    queryFn: fetchStatistics,
  });

  const { data: orders } = useQuery<Order[]>({
    queryKey: ["recentOrders"],
    queryFn: fetchRecentOrders,
  });

  const statistics = data || {
    totalOrders: {},
    totalCustomers: 0,
    totalRevenue: 0,
    currentBalance: 0,
  };

  const totalOrders = statistics.totalOrders ?? {};
  const totalCustomers = statistics.totalCustomers ?? 0;
  const totalRevenue = statistics.totalRevenue ?? 0;
  const currentBalance = statistics.currentBalance ?? 0;

  const totalOrderCount =
    (totalOrders.totalPendingOrders ?? 0) +
    (totalOrders.totalCompletedOrders ?? 0) +
    (totalOrders.totalCanceledOrders ?? 0);
  console.log("totalOrders: ", totalOrderCount);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;
  return (
    <ProtectedRoute allowedRoles={["farmbreeder"]}>
      <PageContainer
        title="Dashboard"
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
        <section className={"mt-3 grid grid-cols-2 gap-3 px-layout pb-layout"}>
          <ClickableArea className={cn("block h-32 shadow-md p-4")}>
            <div className="flex items-start justify-between">
              <Statistic
                title={
                  <span className="text-lg font-normal">Total Customers</span>
                }
                value={totalCustomers}
                valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
              />
              <TeamOutlined className="text-blue-600 text-2xl cursor-pointer" />
            </div>
            <Statistic
              value={12}
              valueStyle={{ fontSize: "1rem", color: "green" }}
              prefix={<ArrowUpOutlined />}
              suffix="% from last month"
            />
          </ClickableArea>
          <ClickableArea className={cn("block h-32 shadow-md p-4")}>
            <div className="flex items-start justify-between">
              <Statistic
                title={
                  <span className="text-lg font-normal">Total Orders</span>
                }
                value={totalOrderCount}
                valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
              />
              <ShopOutlined className="text-violet-500 text-2xl cursor-pointer" />
            </div>
            <Statistic
              value={12}
              valueStyle={{ fontSize: "1rem", color: "red" }}
              prefix={<ArrowDownOutlined />}
              suffix="% from last month"
            />
          </ClickableArea>
          <ClickableArea className={cn("block h-32 shadow-md p-4")}>
            <div className="flex items-start justify-between">
              <Statistic
                title={
                  <span className="text-lg font-normal">Total Revenue</span>
                }
                value={totalRevenue}
                valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
              />
              <WalletOutlined className="text-green-600 text-2xl cursor-pointer" />
            </div>
            <Statistic
              value={12}
              valueStyle={{ fontSize: "1rem", color: "green" }}
              prefix={<ArrowUpOutlined />}
              suffix="% from last month"
            />
          </ClickableArea>
          <ClickableArea className={cn("block h-32 shadow-md p-4")}>
            <div className="flex items-start justify-between">
              <Statistic
                title={
                  <span className="text-lg font-normal">Total Withdrawals</span>
                }
                value={currentBalance}
                valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
              />
              <MoneyCollectOutlined className="text-orange-500 text-2xl cursor-pointer" />
            </div>
            <Statistic
              value={12}
              valueStyle={{ fontSize: "1rem", color: "green" }}
              prefix={<ArrowUpOutlined />}
              suffix="% from last month"
            />
          </ClickableArea>
        </section>
        <section className="mt-3">
          <h2 className="mt-5 mb-3 font-medium text-lg">Recent Orders</h2>
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="orderId"
            bordered
            pagination={{ pageSize: 10 }}
            scroll={{ x: "max-content" }}
          />
        </section>
      </PageContainer>
    </ProtectedRoute>
  );
}

export default Page;
// "use client";

// import { PageContainer } from "@ant-design/pro-layout";
// import { Button, Space, Statistic, Table, Tag } from "antd";
// import ClickableArea from "@/app/components/ClickableArea";
// import { cn } from "@/lib/utils/cn.util";
// import {
//   ArrowDownOutlined,
//   ArrowUpOutlined,
//   MoneyCollectOutlined,
//   ShopOutlined,
//   TeamOutlined,
//   WalletOutlined,
// } from "@ant-design/icons";
// import { useQuery } from "@tanstack/react-query";
// import { Order } from "@/lib/domain/Order/Order.dto";
// import { ColumnsType } from "antd/es/table";
// import { fetchRecentOrders } from "@/features/farmbreeder/api/order/recent.api";
// import { fetchStatistics } from "@/features/farmbreeder/api/dashboard/all.api";
// import ProtectedRoute from "@/app/ProtectedRoute";

// const statusColors: Record<string, { color: string; background: string }> = {
//   Cancelled: { color: "#cf1322", background: "#fff1f0" },
//   Delivering: { color: "#ad6800", background: "#fffbe6" },
//   Pending: { color: "#595959", background: "#f0f0f0" },
//   Deposited: { color: "#ad6800", background: "#fffbe6" },
//   Packed: { color: "#1677ff", background: "#e6f4ff" },
//   Delivered: { color: "#389e0d", background: "#f6ffed" },
//   Refunded: { color: "#722ed1", background: "#f9f0ff" },
// };

// const formatNumber = (num: { toString: () => string }) => {
//   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// };

// const columns: ColumnsType<Order> = [
//   {
//     title: "Order ID",
//     dataIndex: "orderId",
//     key: "orderId",
//     fixed: "left",
//   },
//   {
//     title: "Customer Name",
//     dataIndex: "fullName",
//     key: "customerName",
//   },
//   {
//     title: "Amount",
//     dataIndex: "totalOrderAmount",
//     key: "amount",
//     render: (amount?: number) => (amount ? `${formatNumber(amount)} VND` : "-"),
//   },
//   {
//     title: "Status",
//     dataIndex: "orderStatus",
//     key: "status",
//     render: (status: string) => {
//       const style = statusColors[status] || {
//         color: "#000",
//         background: "#eee",
//       };
//       return (
//         <Tag
//           style={{
//             color: style.color,
//             backgroundColor: style.background,
//             borderRadius: 12,
//             padding: "4px 12px",
//             fontWeight: 500,
//           }}
//         >
//           {status}
//         </Tag>
//       );
//     },
//   },
// ];

// function Page() {
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["farmStatistics"],
//     queryFn: fetchStatistics,
//   });

//   const { data: orders } = useQuery<Order[]>({
//     queryKey: ["recentOrders"],
//     queryFn: fetchRecentOrders,
//   });

//   const statistics = data || {
//     totalOrders: {},
//     totalCustomers: 0,
//     totalRevenue: 0,
//     currentBalance: 0,
//   };

//   const totalOrders = statistics.totalOrders ?? {};
//   const totalCustomers = statistics.totalCustomers ?? 0;
//   const totalRevenue = statistics.totalRevenue ?? 0;
//   const currentBalance = statistics.currentBalance ?? 0;

//   const totalOrderCount =
//     (totalOrders.totalPendingOrders ?? 0) +
//     (totalOrders.totalCompletedOrders ?? 0) +
//     (totalOrders.totalCanceledOrders ?? 0);
//   console.log("totalOrders: ", totalOrderCount);

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Error fetching data</div>;
//   return (
//     <ProtectedRoute allowedRoles={["farmbreeder"]}>
//       <PageContainer
//         title="Dashboard"
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
//         <section className={"mt-3 grid grid-cols-2 gap-3 px-layout pb-layout"}>
//           <ClickableArea className={cn("block h-32 shadow-md p-4")}>
//             <div className="flex items-start justify-between">
//               <Statistic
//                 title={
//                   <span className="text-lg font-normal">Total Customers</span>
//                 }
//                 value={totalCustomers}
//                 valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
//               />
//               <TeamOutlined className="text-blue-600 text-2xl cursor-pointer" />
//             </div>
//             <Statistic
//               value={12}
//               valueStyle={{ fontSize: "1rem", color: "green" }}
//               prefix={<ArrowUpOutlined />}
//               suffix="% from last month"
//             />
//           </ClickableArea>
//           <ClickableArea className={cn("block h-32 shadow-md p-4")}>
//             <div className="flex items-start justify-between">
//               <Statistic
//                 title={
//                   <span className="text-lg font-normal">Total Orders</span>
//                 }
//                 value={totalOrderCount}
//                 valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
//               />
//               <ShopOutlined className="text-violet-500 text-2xl cursor-pointer" />
//             </div>
//             <Statistic
//               value={12}
//               valueStyle={{ fontSize: "1rem", color: "red" }}
//               prefix={<ArrowDownOutlined />}
//               suffix="% from last month"
//             />
//           </ClickableArea>
//           <ClickableArea className={cn("block h-32 shadow-md p-4")}>
//             <div className="flex items-start justify-between">
//               <Statistic
//                 title={
//                   <span className="text-lg font-normal">Total Revenue</span>
//                 }
//                 value={totalRevenue}
//                 valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
//               />
//               <WalletOutlined className="text-green-600 text-2xl cursor-pointer" />
//             </div>
//             <Statistic
//               value={12}
//               valueStyle={{ fontSize: "1rem", color: "green" }}
//               prefix={<ArrowUpOutlined />}
//               suffix="% from last month"
//             />
//           </ClickableArea>
//           <ClickableArea className={cn("block h-32 shadow-md p-4")}>
//             <div className="flex items-start justify-between">
//               <Statistic
//                 title={
//                   <span className="text-lg font-normal">Total Withdrawals</span>
//                 }
//                 value={currentBalance}
//                 valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
//               />
//               <MoneyCollectOutlined className="text-orange-500 text-2xl cursor-pointer" />
//             </div>
//             <Statistic
//               value={12}
//               valueStyle={{ fontSize: "1rem", color: "green" }}
//               prefix={<ArrowUpOutlined />}
//               suffix="% from last month"
//             />
//           </ClickableArea>
//         </section>
//         <section className="mt-3">
//           <h2 className="mt-5 mb-3 font-medium text-lg">Recent Orders</h2>
//           <Table
//             columns={columns}
//             dataSource={orders}
//             rowKey="orderId"
//             bordered
//             pagination={{ pageSize: 10 }}
//             scroll={{ x: "max-content" }}
//           />
//         </section>
//       </PageContainer>
//     </ProtectedRoute>
//   );
// }

// export default Page;
// "use client";

// import { PageContainer } from "@ant-design/pro-layout";
// import { Button, Space, Statistic, Table, Tag } from "antd";
// import ClickableArea from "@/app/components/ClickableArea";
// import { cn } from "@/lib/utils/cn.util";
// import {
//   ArrowDownOutlined,
//   ArrowUpOutlined,
//   MoneyCollectOutlined,
//   ShopOutlined,
//   TeamOutlined,
//   WalletOutlined,
// } from "@ant-design/icons";
// import { useQuery } from "@tanstack/react-query";
// import { Order } from "@/lib/domain/Order/Order.dto";
// import { ColumnsType } from "antd/es/table";
// import { fetchRecentOrders } from "@/features/farmbreeder/api/order/recent.api";
// import { fetchStatistics } from "@/features/farmbreeder/api/dashboard/all.api";
// import ProtectedRoute from "@/app/ProtectedRoute";

// const statusColors: Record<string, { color: string; background: string }> = {
//   Cancelled: { color: "#cf1322", background: "#fff1f0" },
//   Delivering: { color: "#ad6800", background: "#fffbe6" },
//   Pending: { color: "#595959", background: "#f0f0f0" },
//   Deposited: { color: "#ad6800", background: "#fffbe6" },
//   Packed: { color: "#1677ff", background: "#e6f4ff" },
//   Delivered: { color: "#389e0d", background: "#f6ffed" },
//   Refunded: { color: "#722ed1", background: "#f9f0ff" },
// };

// const formatNumber = (num: { toString: () => string }) => {
//   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// };

// const columns: ColumnsType<Order> = [
//   {
//     title: "Order ID",
//     dataIndex: "orderId",
//     key: "orderId",
//     fixed: "left",
//   },
//   {
//     title: "Customer Name",
//     dataIndex: "fullName",
//     key: "customerName",
//   },
//   {
//     title: "Amount",
//     dataIndex: "totalOrderAmount",
//     key: "amount",
//     render: (amount?: number) => (amount ? `${formatNumber(amount)} VND` : "-"),
//   },
//   {
//     title: "Status",
//     dataIndex: "orderStatus",
//     key: "status",
//     render: (status: string) => {
//       const style = statusColors[status] || {
//         color: "#000",
//         background: "#eee",
//       };
//       return (
//         <Tag
//           style={{
//             color: style.color,
//             backgroundColor: style.background,
//             borderRadius: 12,
//             padding: "4px 12px",
//             fontWeight: 500,
//           }}
//         >
//           {status}
//         </Tag>
//       );
//     },
//   },
// ];

// function Page() {
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["farmStatistics"],
//     queryFn: fetchStatistics,
//   });

//   const { data: orders } = useQuery<Order[]>({
//     queryKey: ["recentOrders"],
//     queryFn: fetchRecentOrders,
//   });

//   const statistics = data || {
//     totalOrders: {},
//     totalCustomers: 0,
//     totalRevenue: 0,
//     currentBalance: 0,
//   };

//   const totalOrders = statistics.totalOrders ?? {};
//   const totalCustomers = statistics.totalCustomers ?? 0;
//   const totalRevenue = statistics.totalRevenue ?? 0;
//   const currentBalance = statistics.currentBalance ?? 0;

//   const totalOrderCount =
//     (totalOrders.totalPendingOrders ?? 0) +
//     (totalOrders.totalCompletedOrders ?? 0) +
//     (totalOrders.totalCanceledOrders ?? 0);
//   console.log("totalOrders: ", totalOrderCount);

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Error fetching data</div>;
//   return (
//     <ProtectedRoute allowedRoles={["farmbreeder"]}>
//       <PageContainer
//         title="Dashboard"
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
//         <section className={"mt-3 grid grid-cols-2 gap-3 px-layout pb-layout"}>
//           <ClickableArea className={cn("block h-32 shadow-md p-4")}>
//             <div className="flex items-start justify-between">
//               <Statistic
//                 title={
//                   <span className="text-lg font-normal">Total Customers</span>
//                 }
//                 value={totalCustomers}
//                 valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
//               />
//               <TeamOutlined className="text-blue-600 text-2xl cursor-pointer" />
//             </div>
//             <Statistic
//               value={12}
//               valueStyle={{ fontSize: "1rem", color: "green" }}
//               prefix={<ArrowUpOutlined />}
//               suffix="% from last month"
//             />
//           </ClickableArea>
//           <ClickableArea className={cn("block h-32 shadow-md p-4")}>
//             <div className="flex items-start justify-between">
//               <Statistic
//                 title={
//                   <span className="text-lg font-normal">Total Orders</span>
//                 }
//                 value={totalOrderCount}
//                 valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
//               />
//               <ShopOutlined className="text-violet-500 text-2xl cursor-pointer" />
//             </div>
//             <Statistic
//               value={12}
//               valueStyle={{ fontSize: "1rem", color: "red" }}
//               prefix={<ArrowDownOutlined />}
//               suffix="% from last month"
//             />
//           </ClickableArea>
//           <ClickableArea className={cn("block h-32 shadow-md p-4")}>
//             <div className="flex items-start justify-between">
//               <Statistic
//                 title={
//                   <span className="text-lg font-normal">Total Revenue</span>
//                 }
//                 value={totalRevenue}
//                 valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
//               />
//               <WalletOutlined className="text-green-600 text-2xl cursor-pointer" />
//             </div>
//             <Statistic
//               value={12}
//               valueStyle={{ fontSize: "1rem", color: "green" }}
//               prefix={<ArrowUpOutlined />}
//               suffix="% from last month"
//             />
//           </ClickableArea>
//           <ClickableArea className={cn("block h-32 shadow-md p-4")}>
//             <div className="flex items-start justify-between">
//               <Statistic
//                 title={
//                   <span className="text-lg font-normal">Total Withdrawals</span>
//                 }
//                 value={currentBalance}
//                 valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
//               />
//               <MoneyCollectOutlined className="text-orange-500 text-2xl cursor-pointer" />
//             </div>
//             <Statistic
//               value={12}
//               valueStyle={{ fontSize: "1rem", color: "green" }}
//               prefix={<ArrowUpOutlined />}
//               suffix="% from last month"
//             />
//           </ClickableArea>
//         </section>
//         <section className="mt-3">
//           <h2 className="mt-5 mb-3 font-medium text-lg">Recent Orders</h2>
//           <Table
//             columns={columns}
//             dataSource={orders}
//             rowKey="orderId"
//             bordered
//             pagination={{ pageSize: 10 }}
//             scroll={{ x: "max-content" }}
//           />
//         </section>
//       </PageContainer>
//     </ProtectedRoute>
//   );
// }

// export default Page;
// "use client";

// import { PageContainer } from "@ant-design/pro-layout";
// import { Button, Space, Statistic, Table, Tag } from "antd";
// import ClickableArea from "@/app/components/ClickableArea";
// import { cn } from "@/lib/utils/cn.util";
// import {
//   ArrowDownOutlined,
//   ArrowUpOutlined,
//   MoneyCollectOutlined,
//   ShopOutlined,
//   TeamOutlined,
//   WalletOutlined,
// } from "@ant-design/icons";
// import { useQuery } from "@tanstack/react-query";
// import { Order } from "@/lib/domain/Order/Order.dto";
// import { ColumnsType } from "antd/es/table";
// import { fetchRecentOrders } from "@/features/farmbreeder/api/order/recent.api";
// import { fetchStatistics } from "@/features/farmbreeder/api/dashboard/all.api";
// import ProtectedRoute from "@/app/ProtectedRoute";

// const statusColors: Record<string, { color: string; background: string }> = {
//   Cancelled: { color: "#cf1322", background: "#fff1f0" },
//   Delivering: { color: "#ad6800", background: "#fffbe6" },
//   Pending: { color: "#595959", background: "#f0f0f0" },
//   Deposited: { color: "#ad6800", background: "#fffbe6" },
//   Packed: { color: "#1677ff", background: "#e6f4ff" },
//   Delivered: { color: "#389e0d", background: "#f6ffed" },
//   Refunded: { color: "#722ed1", background: "#f9f0ff" },
// };

// const formatNumber = (num: { toString: () => string }) => {
//   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// };

// const columns: ColumnsType<Order> = [
//   {
//     title: "Order ID",
//     dataIndex: "orderId",
//     key: "orderId",
//     fixed: "left",
//   },
//   {
//     title: "Customer Name",
//     dataIndex: "fullName",
//     key: "customerName",
//   },
//   {
//     title: "Amount",
//     dataIndex: "totalOrderAmount",
//     key: "amount",
//     render: (amount?: number) => (amount ? `${formatNumber(amount)} VND` : "-"),
//   },
//   {
//     title: "Status",
//     dataIndex: "orderStatus",
//     key: "status",
//     render: (status: string) => {
//       const style = statusColors[status] || {
//         color: "#000",
//         background: "#eee",
//       };
//       return (
//         <Tag
//           style={{
//             color: style.color,
//             backgroundColor: style.background,
//             borderRadius: 12,
//             padding: "4px 12px",
//             fontWeight: 500,
//           }}
//         >
//           {status}
//         </Tag>
//       );
//     },
//   },
// ];

// function Page() {
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["farmStatistics"],
//     queryFn: fetchStatistics,
//   });

//   const { data: orders } = useQuery<Order[]>({
//     queryKey: ["recentOrders"],
//     queryFn: fetchRecentOrders,
//   });

//   const statistics = data || {
//     totalOrders: {},
//     totalCustomers: 0,
//     totalRevenue: 0,
//     currentBalance: 0,
//   };

//   const totalOrders = statistics.totalOrders ?? {};
//   const totalCustomers = statistics.totalCustomers ?? 0;
//   const totalRevenue = statistics.totalRevenue ?? 0;
//   const currentBalance = statistics.currentBalance ?? 0;

//   const totalOrderCount =
//     (totalOrders.totalPendingOrders ?? 0) +
//     (totalOrders.totalCompletedOrders ?? 0) +
//     (totalOrders.totalCanceledOrders ?? 0);
//   console.log("totalOrders: ", totalOrderCount);

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Error fetching data</div>;
//   return (
//     <ProtectedRoute allowedRoles={["farmbreeder"]}>
//       <PageContainer
//         title="Dashboard"
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
//         <section className={"mt-3 grid grid-cols-2 gap-3 px-layout pb-layout"}>
//           <ClickableArea className={cn("block h-32 shadow-md p-4")}>
//             <div className="flex items-start justify-between">
//               <Statistic
//                 title={
//                   <span className="text-lg font-normal">Total Customers</span>
//                 }
//                 value={totalCustomers}
//                 valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
//               />
//               <TeamOutlined className="text-blue-600 text-2xl cursor-pointer" />
//             </div>
//             <Statistic
//               value={12}
//               valueStyle={{ fontSize: "1rem", color: "green" }}
//               prefix={<ArrowUpOutlined />}
//               suffix="% from last month"
//             />
//           </ClickableArea>
//           <ClickableArea className={cn("block h-32 shadow-md p-4")}>
//             <div className="flex items-start justify-between">
//               <Statistic
//                 title={
//                   <span className="text-lg font-normal">Total Orders</span>
//                 }
//                 value={totalOrderCount}
//                 valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
//               />
//               <ShopOutlined className="text-violet-500 text-2xl cursor-pointer" />
//             </div>
//             <Statistic
//               value={12}
//               valueStyle={{ fontSize: "1rem", color: "red" }}
//               prefix={<ArrowDownOutlined />}
//               suffix="% from last month"
//             />
//           </ClickableArea>
//           <ClickableArea className={cn("block h-32 shadow-md p-4")}>
//             <div className="flex items-start justify-between">
//               <Statistic
//                 title={
//                   <span className="text-lg font-normal">Total Revenue</span>
//                 }
//                 value={totalRevenue}
//                 valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
//               />
//               <WalletOutlined className="text-green-600 text-2xl cursor-pointer" />
//             </div>
//             <Statistic
//               value={12}
//               valueStyle={{ fontSize: "1rem", color: "green" }}
//               prefix={<ArrowUpOutlined />}
//               suffix="% from last month"
//             />
//           </ClickableArea>
//           <ClickableArea className={cn("block h-32 shadow-md p-4")}>
//             <div className="flex items-start justify-between">
//               <Statistic
//                 title={
//                   <span className="text-lg font-normal">Total Withdrawals</span>
//                 }
//                 value={currentBalance}
//                 valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
//               />
//               <MoneyCollectOutlined className="text-orange-500 text-2xl cursor-pointer" />
//             </div>
//             <Statistic
//               value={12}
//               valueStyle={{ fontSize: "1rem", color: "green" }}
//               prefix={<ArrowUpOutlined />}
//               suffix="% from last month"
//             />
//           </ClickableArea>
//         </section>
//         <section className="mt-3">
//           <h2 className="mt-5 mb-3 font-medium text-lg">Recent Orders</h2>
//           <Table
//             columns={columns}
//             dataSource={orders}
//             rowKey="orderId"
//             bordered
//             pagination={{ pageSize: 10 }}
//             scroll={{ x: "max-content" }}
//           />
//         </section>
//       </PageContainer>
//     </ProtectedRoute>
//   );
// }

// export default Page;
// "use client";

// import { PageContainer } from "@ant-design/pro-layout";
// import { Button, Space, Statistic, Table, Tag } from "antd";
// import ClickableArea from "@/app/components/ClickableArea";
// import { cn } from "@/lib/utils/cn.util";
// import {
//   ArrowDownOutlined,
//   ArrowUpOutlined,
//   MoneyCollectOutlined,
//   ShopOutlined,
//   TeamOutlined,
//   WalletOutlined,
// } from "@ant-design/icons";
// import { useQuery } from "@tanstack/react-query";
// import { Order } from "@/lib/domain/Order/Order.dto";
// import { ColumnsType } from "antd/es/table";
// import { fetchRecentOrders } from "@/features/farmbreeder/api/order/recent.api";
// import { fetchStatistics } from "@/features/farmbreeder/api/dashboard/all.api";
// import ProtectedRoute from "@/app/ProtectedRoute";

// const statusColors: Record<string, { color: string; background: string }> = {
//   Cancelled: { color: "#cf1322", background: "#fff1f0" },
//   Delivering: { color: "#ad6800", background: "#fffbe6" },
//   Pending: { color: "#595959", background: "#f0f0f0" },
//   Deposited: { color: "#ad6800", background: "#fffbe6" },
//   Packed: { color: "#1677ff", background: "#e6f4ff" },
//   Delivered: { color: "#389e0d", background: "#f6ffed" },
//   Refunded: { color: "#722ed1", background: "#f9f0ff" },
// };

// const formatNumber = (num: { toString: () => string }) => {
//   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// };

// const columns: ColumnsType<Order> = [
//   {
//     title: "Order ID",
//     dataIndex: "orderId",
//     key: "orderId",
//     fixed: "left",
//   },
//   {
//     title: "Customer Name",
//     dataIndex: "fullName",
//     key: "customerName",
//   },
//   {
//     title: "Amount",
//     dataIndex: "totalOrderAmount",
//     key: "amount",
//     render: (amount?: number) => (amount ? `${formatNumber(amount)} VND` : "-"),
//   },
//   {
//     title: "Status",
//     dataIndex: "orderStatus",
//     key: "status",
//     render: (status: string) => {
//       const style = statusColors[status] || {
//         color: "#000",
//         background: "#eee",
//       };
//       return (
//         <Tag
//           style={{
//             color: style.color,
//             backgroundColor: style.background,
//             borderRadius: 12,
//             padding: "4px 12px",
//             fontWeight: 500,
//           }}
//         >
//           {status}
//         </Tag>
//       );
//     },
//   },
// ];

// function Page() {
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["farmStatistics"],
//     queryFn: fetchStatistics,
//   });

//   const { data: orders } = useQuery<Order[]>({
//     queryKey: ["recentOrders"],
//     queryFn: fetchRecentOrders,
//   });

//   const statistics = data || {
//     totalOrders: {},
//     totalCustomers: 0,
//     totalRevenue: 0,
//     currentBalance: 0,
//   };

//   const totalOrders = statistics.totalOrders ?? {};
//   const totalCustomers = statistics.totalCustomers ?? 0;
//   const totalRevenue = statistics.totalRevenue ?? 0;
//   const currentBalance = statistics.currentBalance ?? 0;

//   const totalOrderCount =
//     (totalOrders.totalPendingOrders ?? 0) +
//     (totalOrders.totalCompletedOrders ?? 0) +
//     (totalOrders.totalCanceledOrders ?? 0);
//   console.log("totalOrders: ", totalOrderCount);

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Error fetching data</div>;
//   return (
//     <ProtectedRoute allowedRoles={["farmbreeder"]}>
//       <PageContainer
//         title="Dashboard"
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
//         <section className={"mt-3 grid grid-cols-2 gap-3 px-layout pb-layout"}>
//           <ClickableArea className={cn("block h-32 shadow-md p-4")}>
//             <div className="flex items-start justify-between">
//               <Statistic
//                 title={
//                   <span className="text-lg font-normal">Total Customers</span>
//                 }
//                 value={totalCustomers}
//                 valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
//               />
//               <TeamOutlined className="text-blue-600 text-2xl cursor-pointer" />
//             </div>
//             <Statistic
//               value={12}
//               valueStyle={{ fontSize: "1rem", color: "green" }}
//               prefix={<ArrowUpOutlined />}
//               suffix="% from last month"
//             />
//           </ClickableArea>
//           <ClickableArea className={cn("block h-32 shadow-md p-4")}>
//             <div className="flex items-start justify-between">
//               <Statistic
//                 title={
//                   <span className="text-lg font-normal">Total Orders</span>
//                 }
//                 value={totalOrderCount}
//                 valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
//               />
//               <ShopOutlined className="text-violet-500 text-2xl cursor-pointer" />
//             </div>
//             <Statistic
//               value={12}
//               valueStyle={{ fontSize: "1rem", color: "red" }}
//               prefix={<ArrowDownOutlined />}
//               suffix="% from last month"
//             />
//           </ClickableArea>
//           <ClickableArea className={cn("block h-32 shadow-md p-4")}>
//             <div className="flex items-start justify-between">
//               <Statistic
//                 title={
//                   <span className="text-lg font-normal">Total Revenue</span>
//                 }
//                 value={totalRevenue}
//                 valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
//               />
//               <WalletOutlined className="text-green-600 text-2xl cursor-pointer" />
//             </div>
//             <Statistic
//               value={12}
//               valueStyle={{ fontSize: "1rem", color: "green" }}
//               prefix={<ArrowUpOutlined />}
//               suffix="% from last month"
//             />
//           </ClickableArea>
//           <ClickableArea className={cn("block h-32 shadow-md p-4")}>
//             <div className="flex items-start justify-between">
//               <Statistic
//                 title={
//                   <span className="text-lg font-normal">Total Withdrawals</span>
//                 }
//                 value={currentBalance}
//                 valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
//               />
//               <MoneyCollectOutlined className="text-orange-500 text-2xl cursor-pointer" />
//             </div>
//             <Statistic
//               value={12}
//               valueStyle={{ fontSize: "1rem", color: "green" }}
//               prefix={<ArrowUpOutlined />}
//               suffix="% from last month"
//             />
//           </ClickableArea>
//         </section>
//         <section className="mt-3">
//           <h2 className="mt-5 mb-3 font-medium text-lg">Recent Orders</h2>
//           <Table
//             columns={columns}
//             dataSource={orders}
//             rowKey="orderId"
//             bordered
//             pagination={{ pageSize: 10 }}
//             scroll={{ x: "max-content" }}
//           />
//         </section>
//       </PageContainer>
//     </ProtectedRoute>
//   );
// }

// export default Page;
