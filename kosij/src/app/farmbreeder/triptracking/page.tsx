"use client";
import {
  PageContainer,
  ProTable,
  ProColumns,
} from "@ant-design/pro-components";

import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentFarmTrips } from "@/features/farmbreeder/api/trip/all.api";
import { Tag } from "antd";

type TripItem = {
  id: number;
  tourName: string;
  pickupTime: Date;
  numberOfVisitors: number;
  tripStatus: "open" | "closed" | "processing" | "done";
  tripType: "open" | "closed";
};

const statusColors: Record<string, { color: string; background: string }> = {
  Available: { color: "#1890ff", background: "#e6f7ff" }, // Light Blue
  "Not Available": { color: "#595959", background: "#f0f0f0" }, // Gray
  Full: { color: "#ff85c0", background: "#fff0f6" }, // Pink
  "Registration Closed": { color: "#fa8c16", background: "#fff7e6" }, // Orange
  "Not Started": { color: "#fadb14", background: "#feffe6" }, // Yellow
  "On Going": { color: "#1677ff", background: "#e6f4ff" }, // Blue
  Completed: { color: "#389e0d", background: "#f6ffed" }, // Green
  Canceled: { color: "#cf1322", background: "#fff1f0" }, // Red
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
    copyable: true,
    ellipsis: true,
    valueType: "text",
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
    ellipsis: true,
  },
  // {
  //   title: "Status",
  //   dataIndex: "tripStatus",
  //   key: "status",
  //   render: (_, entity) => {
  //     if (!entity || !entity.tripStatus) return "-"; // Prevent crashes

  //     const status = entity.tripStatus as keyof typeof statusColors; // Type safety
  //     const style = statusColors[status] || {
  //       color: "#000",
  //       background: "#eee",
  //     };

  //     if (typeof window === "undefined") {
  //       // Prevent errors during SSR
  //       return status;
  //     }

  //     return (
  //       <Tag
  //         style={{
  //           color: style.color,
  //           backgroundColor: style.background,
  //           borderRadius: 12,
  //           padding: "4px 12px",
  //           fontWeight: 500,
  //         }}
  //       >
  //         {status}
  //       </Tag>
  //     );
  //   },
  // },

  {
    title: "Type",
    dataIndex: "tripType",
    valueType: "select",
    valueEnum: {
      open: { text: "Scheduled", status: "Processing" },
      closed: { text: "Customized", status: "Success" },
    },
  },
];

export default function Page() {
  const actionRef = useRef();

  const { data, isLoading, error } = useQuery({
    queryKey: ["currentFarmTrips"],
    queryFn: getCurrentFarmTrips,
  });

  if (error) {
    return <p>Error loading data</p>;
  }

  return (
    <PageContainer title="Trip Tracking List">
      <section className="mt-5">
        <ProTable<TripItem>
          columns={columns}
          actionRef={actionRef}
          dataSource={data}
          cardBordered
          loading={isLoading}
          search={false}
        />
      </section>
    </PageContainer>
  );
}
