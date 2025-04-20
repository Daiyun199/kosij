/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import {
//   PageContainer,
//   ProTable,
//   ProColumns,
// } from "@ant-design/pro-components";
// import { useRef } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getCurrentFarmTrips } from "@/features/farmbreeder/api/trip/all.api";
// import { Button, Space, Tag } from "antd";
// import ProtectedRoute from "@/app/ProtectedRoute";

// type TripItem = {
//   id: number;
//   tourName: string;
//   pickupTime: Date;
//   numberOfVisitors: number;
//   tripStatus: "open" | "closed" | "processing" | "done";
//   tripType: "open" | "closed";
// };

// const statusColors: Record<string, { color: string; background: string }> = {
//   Available: { color: "#1890ff", background: "#e6f7ff" },
//   "Not Available": { color: "#595959", background: "#f0f0f0" },
//   Full: { color: "#ff85c0", background: "#fff0f6" },
//   "Registration Closed": { color: "#fa8c16", background: "#fff7e6" },
//   "Not Started": { color: "#fadb14", background: "#feffe6" },
//   "On Going": { color: "#1677ff", background: "#e6f4ff" },
//   Completed: { color: "#389e0d", background: "#f6ffed" },
//   Canceled: { color: "#cf1322", background: "#fff1f0" },
// };

// const typeColors: Record<string, { color: string; background: string }> = {
//   Scheduled: { color: "#ffffff", background: "#2FBFDE" },
//   Customized: { color: "#ffffff", background: "#5A6ACF" },
// };

// const columns: ProColumns<TripItem>[] = [
//   {
//     title: "ID",
//     dataIndex: "id",
//     valueType: "index",
//     width: 58,
//   },
//   {
//     title: "Trip Name",
//     dataIndex: "tourName",
//     ellipsis: true,
//     valueType: "text",
//   },
//   {
//     title: "Pick-up Time",
//     dataIndex: "pickupTime",
//     search: false,
//   },
//   {
//     title: "Number of Visitors",
//     dataIndex: "numberOfVisitors",
//     filters: true,
//     ellipsis: true,
//   },
//   {
//     title: "Status",
//     dataIndex: "tripStatus",
//     key: "status",
//     render: (_, entity) => {
//       if (!entity || !entity.tripStatus) return "-";

//       const status = entity.tripStatus as keyof typeof statusColors;
//       const style = statusColors[status] || {
//         color: "#000",
//         background: "#eee",
//       };

//       if (typeof window === "undefined") {
//         return status;
//       }

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
//   {
//     title: "Type",
//     dataIndex: "tripType",
//     key: "type",
//     render: (_, entity) => {
//       if (!entity || !entity.tripType) return "-";

//       const type = entity.tripType as keyof typeof typeColors;
//       const style = typeColors[type] || {
//         color: "#000",
//         background: "#eee",
//       };

//       if (typeof window === "undefined") {
//         return type;
//       }

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
//           {type}
//         </Tag>
//       );
//     },
//   },
// ];

// export default function Page() {
//   const actionRef = useRef();

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["currentFarmTrips"],
//     queryFn: getCurrentFarmTrips,
//   });

//   if (error) {
//     return <p>Error loading data</p>;
//   }

//   return (
//     <ProtectedRoute allowedRoles={["farmbreeder"]}>
//       <PageContainer
//         title="Trip Tracking List"
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
//           <ProTable<TripItem>
//             columns={columns}
//             actionRef={actionRef}
//             dataSource={data}
//             cardBordered
//             loading={isLoading}
//             search={false}
//             pagination={{
//               pageSize: 10,
//               showTotal: (total) => `Total ${total} record(s)`,
//             }}
//           />
//         </section>
//       </PageContainer>
//     </ProtectedRoute>
//   );
// }

// "use client";
// import {
//   PageContainer,
//   ProTable,
//   ProColumns,
//   ProFormInstance, // Import ProFormInstance for form typing
// } from "@ant-design/pro-components";
// import { useRef } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getCurrentFarmTrips } from "@/features/farmbreeder/api/trip/all.api";
// import { Button, Space, Tag } from "antd";
// import ProtectedRoute from "@/app/ProtectedRoute";

// type TripItem = {
//   id: number;
//   tourName: string;
//   pickupTime: Date;
//   numberOfVisitors: number;
//   tripStatus: "open" | "closed" | "processing" | "done";
//   tripType: "open" | "closed";
// };

// const statusColors: Record<string, { color: string; background: string }> = {
//   Available: { color: "#1890ff", background: "#e6f7ff" },
//   "Not Available": { color: "#595959", background: "#f0f0f0" },
//   Full: { color: "#ff85c0", background: "#fff0f6" },
//   "Registration Closed": { color: "#fa8c16", background: "#fff7 parkinge6" },
//   "Not Started": { color: "#fadb14", background: "#feffe6" },
//   "On Going": { color: "#1677ff", background: "#e6f4ff" },
//   Completed: { color: "#389e0d", background: "#f6ffed" },
//   Canceled: { color: "#cf1322", background: "#fff1f0" },
// };

// const typeColors: Record<string, { color: string; background: string }> = {
//   Scheduled: { color: "#ffffff", background: "#2FBFDE" },
//   Customized: { color: "#ffffff", background: "#5A6ACF" },
// };

// const columns: ProColumns<TripItem>[] = [
//   {
//     title: "ID",
//     dataIndex: "id",
//     valueType: "index",
//     width: 58,
//   },
//   {
//     title: "Trip Name",
//     dataIndex: "tourName",
//     ellipsis: true,
//     valueType: "text",
//     search: {
//       transform: (value) => ({
//         tourName: value,
//       }),
//     },
//     formItemProps: {
//       label: "Trip Name",
//       tooltip: "Search by trip name",
//     },
//   },
//   {
//     title: "Pick-up Time",
//     dataIndex: "pickupTime",
//     search: false,
//   },
//   {
//     title: "Number of Visitors",
//     dataIndex: "numberOfVisitors",
//     filters: true,
//     ellipsis: true,
//   },
//   {
//     title: "Status",
//     dataIndex: "tripStatus",
//     key: "status",
//     valueType: "select",
//     valueEnum: {
//       open: { text: "Open" },
//       closed: { text: "Closed" },
//       processing: { text: "Processing" },
//       done: { text: "Done" },
//     },
//     search: {
//       transform: (value) => ({
//         tripStatus: value,
//       }),
//     },
//     formItemProps: {
//       label: "Status",
//       tooltip: "Search by trip status",
//     },
//     render: (_, entity) => {
//       if (!entity || !entity.tripStatus) return "-";

//       const status = entity.tripStatus as keyof typeof statusColors;
//       const style = statusColors[status] || {
//         color: "#000",
//         background: "#eee",
//       };

//       if (typeof window === "undefined") {
//         return status;
//       }

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
//   {
//     title: "Type",
//     dataIndex: "tripType",
//     key: "type",
//     valueType: "select",
//     valueEnum: {
//       open: { text: "Scheduled" },
//       closed: { text: "Customized" },
//     },
//     search: {
//       transform: (value) => ({
//         tripType: value,
//       }),
//     },
//     formItemProps: {
//       label: "Type",
//       tooltip: "Search by trip type",
//     },
//     render: (_, entity) => {
//       if (!entity || !entity.tripType) return "-";

//       const type = entity.tripType as keyof typeof typeColors;
//       const style = typeColors[type] || {
//         color: "#000",
//         background: "#eee",
//       };

//       if (typeof window === "undefined") {
//         return type;
//       }

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
//           {type}
//         </Tag>
//       );
//     },
//   },
// ];

// export default function Page() {
//   // Use formRef for search form actions, typed with ProFormInstance
//   const formRef = useRef<ProFormInstance>();

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["currentFarmTrips"],
//     queryFn: getCurrentFarmTrips,
//   });

//   if (error) {
//     return <p>Error loading data</p>;
//   }

//   return (
//     <ProtectedRoute allowedRoles={["farmbreeder"]}>
//       <PageContainer
//         title="Trip Tracking List"
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
//           <ProTable<TripItem>
//             columns={columns}
//             dataSource={data}
//             cardBordered
//             loading={isLoading}
//             // Pass formRef directly to ProTable
//             formRef={formRef}
//             search={{
//               labelWidth: "auto",
//               optionRender: () => [
//                 <Button
//                   key="search"
//                   type="primary"
//                   onClick={() => {
//                     formRef.current?.submit();
//                   }}
//                 >
//                   Search
//                 </Button>,
//                 <Button
//                   key="reset"
//                   onClick={() => {
//                     formRef.current?.resetFields();
//                   }}
//                 >
//                   Reset
//                 </Button>,
//               ],
//             }}
//             pagination={{
//               pageSize: 10,
//               showTotal: (total) => `Total ${total} record(s)`,
//             }}
//             locale={{
//               filterConfirm: "OK",
//               filterReset: "Reset",
//               emptyText: "No data",
//             }}
//           />
//         </section>
//       </PageContainer>
//     </ProtectedRoute>
//   );
// }

"use client";
import {
  PageContainer,
  ProTable,
  ProColumns,
  ProFormInstance,
} from "@ant-design/pro-components";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentFarmTrips } from "@/features/farmbreeder/api/trip/all.api";
import { Button, Space, Tag } from "antd";
import ProtectedRoute from "@/app/ProtectedRoute";
import { DownOutlined, UpOutlined } from '@ant-design/icons';

const tableLocale: {
  filterConfirm?: string;
  filterReset?: string;
  emptyText?: string;
  selectAll?: string;
  selectInvert?: string;
  selectionAll?: string;
  sortTitle?: string;
  expand?: string;
  collapse?: string;
  triggerDesc?: string;
  triggerAsc?: string;
  cancelSort?: string;
  searchCollapse?: string;
  searchExpand?: string;
} = {
  filterConfirm: "OK",
  filterReset: "Reset",
  emptyText: "No data",
  selectAll: "Select all",
  selectInvert: "Invert selection",
  selectionAll: "Select all data",
  sortTitle: "Sort",
  expand: "Expand row",
  collapse: "Collapse row",
  triggerDesc: "Click to sort descending",
  triggerAsc: "Click to sort ascending",
  cancelSort: "Click to cancel sorting",
  searchCollapse: "Collapse",
  searchExpand: "Expand",
};

const formLocale = {
  placeholder: {
    input: "Please input",
    select: "Please select",
  },
};
const proLocale = {
  locale: "en-US",
  table: tableLocale,
  form: formLocale,
  pagination: {
    total: {
      range: "{range0}-{range1} of {total} items",
      total: "Total {total} items",
    },
  },
};

type TripItem = {
  id: number;
  tourName: string;
  pickupTime: Date;
  numberOfVisitors: number;
  tripStatus:
    | "Available"
    | "Not Available"
    | "Full"
    | "Registration Closed"
    | "Not Started"
    | "On Going"
    | "Completed"
    | "Canceled";
  tripType: "Scheduled" | "Customized";
};

// const statusColors: Record<string, { color: string; background: string }> = {
//   open: { color: "#1890ff", background: "#e6f7ff" },
//   closed: { color: "#595959", background: "#f0f0f0" },
//   processing: { color: "#1677ff", background: "#e6f4ff" },
//   done: { color: "#389e0d", background: "#f6ffed" },
// };

// const typeColors: Record<string, { color: string; background: string }> = {
//   open: { color: "#ffffff", background: "#2FBFDE" },
//   closed: { color: "#ffffff", background: "#5A6ACF" },
// };

const statusColors: Record<string, { color: string; background: string }> = {
  Available: { color: "#1890ff", background: "#e6f7ff" },
  "Not Available": { color: "#595959", background: "#f0f0f0" },
  Full: { color: "#ff85c0", background: "#fff0f6" },
  "Registration Closed": { color: "#fa8c16", background: "#fff7e6" },
  "Not Started": { color: "#fadb14", background: "#feffe6" },
  "On Going": { color: "#1677ff", background: "#e6f4ff" },
  Completed: { color: "#389e0d", background: "#f6ffed" },
  Canceled: { color: "#cf1322", background: "#fff1f0" },
};

const statusMap: Record<string, string> = {
  Available: "Available",
  "Not Available": "Not Available",
  Full: "Full",
  "Registration Closed": "Registration Closed",
  "Not Started": "Not Started",
  "On Going": "On Going",
  Completed: "Completed",
  Canceled: "Canceled",
};

const typeColors: Record<string, { color: string; background: string }> = {
  Scheduled: { color: "#ffffff", background: "#2FBFDE" },
  Customized: { color: "#ffffff", background: "#5A6ACF" },
};

const typeMap: Record<string, string> = {
  Scheduled: "Scheduled",
  Customized: "Customized",
};

const normalizeValue = (value: string | undefined): string | undefined => {
  if (!value) return value;
  return value
    .toLowerCase()
    .replace(/(^|\s)\w/g, (letter) => letter.toUpperCase());
};

const columns: ProColumns<TripItem>[] = [
  {
    title: "ID",
    dataIndex: "id",
    valueType: "index",
    width: 58,
  },
  {
    title: "Trip Name",
    dataIndex: "tourName",
    ellipsis: true,
    fieldProps: {
      placeholder: "Enter text",
    },
    valueType: "text",
    search: {
      transform: (value) => ({
        tourName: value,
      }),
    },
    formItemProps: {
      label: "Trip Name",
      tooltip: "Search by trip name",
    },
  },
  {
    title: "Pick-up Time",
    dataIndex: "pickupTime",
    search: false,
  },
  {
    title: "Number of Visitors",
    dataIndex: "numberOfVisitors",
    filters: true,
    fieldProps: {
      placeholder: "Enter number",
    },
    ellipsis: true,
    search: {
      transform: (value) => ({
        numberOfVisitors: value,
      }),
    },
  },
  {
    title: "Status",
    dataIndex: "tripStatus",
    key: "tripStatus",
    fieldProps: {
      placeholder: "Select status",
    },
    valueType: "select",
    valueEnum: {
      Available: { text: "Available" },
      "Not Available": { text: "Not Available" },
      Full: { text: "Full" },
      "Registration Closed": { text: "Registration Closed" },
      "Not Started": { text: "Not Started" },
      "On Going": { text: "On Going" },
      Completed: { text: "Completed" },
      Canceled: { text: "Canceled" },
    },
    search: {
      transform: (value) => {
        const normalized = normalizeValue(value);
        console.log(`Transformed tripStatus: ${value} -> ${normalized}`);
        return { tripStatus: normalized };
      },
    },
    formItemProps: {
      label: "Status",
      tooltip: "Search by trip status",
    },
    render: (_, entity) => {
      if (!entity || !entity.tripStatus) return "-";

      const status = normalizeValue(
        entity.tripStatus
      ) as keyof typeof statusColors;
      const style = statusColors[status] || {
        color: "#000",
        background: "#eee",
      };

      if (typeof window === "undefined") {
        return status;
      }

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
  {
    title: "Type",
    dataIndex: "tripType",
    key: "tripType",
    fieldProps: {
      placeholder: "Select type",
    },
    valueType: "select",
    valueEnum: {
      Scheduled: { text: "Scheduled" },
      Customized: { text: "Customized" },
    },
    search: {
      transform: (value) => {
        const normalized = normalizeValue(value);
        console.log(`Transformed tripType: ${value} -> ${normalized}`);
        return { tripType: normalized };
      },
    },
    formItemProps: {
      label: "Type",
      tooltip: "Search by trip type",
    },
    render: (_, entity) => {
      if (!entity || !entity.tripType) return "-";

      const type = normalizeValue(entity.tripType) as keyof typeof typeColors;
      const style = typeColors[type] || {
        color: "#000",
        background: "#eee",
      };

      if (typeof window === "undefined") {
        return type;
      }

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
          {type}
        </Tag>
      );
    },
  },
];

export default function TripTrackingPage() {
  const formRef = useRef<ProFormInstance>();
  const [searchParams, setSearchParams] = useState<{
    tourName?: string;
    tripStatus?: string;
    tripType?: string;
    numberOfVisitors?: number;
  }>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ["currentFarmTrips"],
    queryFn: getCurrentFarmTrips,
  });

  if (error) {
    return <p>Error loading data: {error.message}</p>;
  }

  const normalizedData = data?.map(
    (item: { tripStatus: string; tripType: string }) => ({
      ...item,
      tripStatus: normalizeValue(item.tripStatus),
      tripType: normalizeValue(item.tripType),
    })
  );

  const filteredData =
    data?.filter(
      (item: {
        tourName: string;
        tripStatus: string;
        tripType: string;
        numberOfVisitors: number;
      }) => {
        const matchesTourName = searchParams.tourName
          ? item.tourName
              ?.toLowerCase()
              .includes(searchParams.tourName.toLowerCase())
          : true;
        const matchesStatus = searchParams.tripStatus
          ? item.tripStatus === searchParams.tripStatus
          : true;
        const matchesType = searchParams.tripType
          ? item.tripType === searchParams.tripType
          : true;
        const matchesNumber = searchParams.numberOfVisitors
          ? item.numberOfVisitors === Number(searchParams.numberOfVisitors)
          : true;
        return matchesTourName && matchesStatus && matchesType && matchesNumber;
      }
    ) ?? [];

  console.log("API Data:", data);
  console.log("Search Params:", searchParams);
  console.log("Filtered Data:", filteredData);

  return (
    <ProtectedRoute allowedRoles={["farmbreeder"]}>
      <PageContainer
        title="Trip Tracking List"
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
          <ProTable<TripItem>
            columns={columns}
            dataSource={
              filteredData.length > 0 ? filteredData : normalizedData ?? []
            }
            cardBordered
            loading={isLoading}
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
                      ...values,
                      tripStatus: normalizeValue(values.tripStatus),
                      tripType: normalizeValue(values.tripType),
                    });
                    console.log(
                      "Form State:",
                      formRef.current?.getFieldsValue(true)
                    );
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
              pageSize: 10,
              showTotal: (total) => `Total ${total} record(s)`,
            }}
            locale={tableLocale}
          />
        </section>
      </PageContainer>
    </ProtectedRoute>
  );
}
