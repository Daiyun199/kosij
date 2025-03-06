"use client";
import {
  PageContainer,
  ProTable,
  ProColumns,
} from "@ant-design/pro-components";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentFarmTrips } from "@/features/farmbreeder/api/trip/all.api";

type TripItem = {
  id: number;
  title: string;
  labels: { name: string; color: string }[];
  state: string;
  status: "open" | "closed" | "processing" | "done";
  type: "open" | "closed";
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
  // {
  //   title: "Pick-up Time",
  //   dataIndex: "pickupTime",
  //   search: false,
  //   render: (_, record) => (
  //     <Space>
  //       {record.labels.map(({ name, color }) => (
  //         <Tag color={color} key={name}>
  //           {name}
  //         </Tag>
  //       ))}
  //     </Space>
  //   ),
  // },
  {
    title: "Number of Visitors",
    dataIndex: "numberOfVisitors",
    filters: true,
    ellipsis: true,
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "tripStatus",
    valueType: "select",
    valueEnum: {
      open: { text: "Upcoming", status: "Processing" },
      closed: { text: "Completed", status: "Success" },
      processing: { text: "On-going", status: "Warning" },
      done: { text: "Done", status: "Default" },
    },
  },
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
