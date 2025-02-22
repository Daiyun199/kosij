"use client";

import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button, Dropdown, Space, Tag } from "antd";
import { useRef } from "react";

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  status: "open" | "closed" | "processing" | "done";
  type: "open" | "closed";
};

const columns: ProColumns<GithubIssueItem>[] = [
  {
    title: "ID",
    dataIndex: "index",
    valueType: "indexBorder",
    width: 58,
  },
  {
    title: "Trip Name",
    dataIndex: "title",
    copyable: true,
    ellipsis: true,
    formItemProps: {
      rules: [
        {
          required: true,
          message: "This field is required",
        },
      ],
    },
  },
  {
    disable: true,
    title: "Pick-up Time",
    dataIndex: "labels",
    search: false,
    renderFormItem: (_, { defaultRender }) => {
      return defaultRender(_);
    },
    render: (_, record) => (
      <Space>
        {record.labels.map(({ name, color }) => (
          <Tag color={color} key={name}>
            {name}
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    disable: true,
    title: "Number of Visitors",
    dataIndex: "state",
    filters: true,
    onFilter: true,
    ellipsis: true,
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    valueType: "select",
    valueEnum: {
      open: {
        text: "Upcoming",
        status: "Upcoming",
      },
      closed: {
        text: "Completed",
        status: "Completed",
      },
      processing: {
        text: "On-going",
        status: "On-going",
      },
      done: {
        text: "Done",
        status: "Done",
      },
    },
  },
  {
    title: "Type",
    dataIndex: "type",
    valueType: "select",
    valueEnum: {
      open: {
        text: "Scheduled",
        status: "Scheduled",
      },
      closed: {
        text: "Customized",
        status: "Customized",
      },
    },
  },
  {
    title: "Details",
    valueType: "option",
    key: "option",
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        Edit
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        View
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: "copy", name: "Copy" },
          { key: "delete", name: "Delete" },
        ]}
      />,
    ],
  },
];

const fakeData: GithubIssueItem[] = [
  {
    url: "https://example.com/trip/1",
    id: 1,
    number: 101,
    title: "Sunset Safari Tour",
    labels: [{ name: "10:00 AM", color: "blue" }],
    state: "5",
    comments: 12,
    created_at: "2024-07-01T10:00:00Z",
    updated_at: "2024-07-02T10:30:00Z",
    status: "open",
    type: "open",
  },
  {
    url: "https://example.com/trip/2",
    id: 2,
    number: 102,
    title: "City Sightseeing Bus",
    labels: [{ name: "12:30 PM", color: "green" }],
    state: "20",
    comments: 5,
    created_at: "2024-07-03T12:30:00Z",
    updated_at: "2024-07-04T13:00:00Z",
    status: "processing",
    type: "closed",
  },
  {
    url: "https://example.com/trip/3",
    id: 3,
    number: 103,
    title: "Desert Adventure",
    labels: [{ name: "3:00 PM", color: "red" }],
    state: "8",
    comments: 7,
    created_at: "2024-07-05T15:00:00Z",
    updated_at: "2024-07-06T16:00:00Z",
    status: "closed",
    type: "open",
  },
  {
    url: "https://example.com/trip/4",
    id: 4,
    number: 104,
    title: "Mountain Hiking",
    labels: [{ name: "7:00 AM", color: "purple" }],
    state: "15",
    comments: 9,
    created_at: "2024-07-07T07:00:00Z",
    updated_at: "2024-07-08T08:30:00Z",
    status: "done",
    type: "closed",
  },
  {
    url: "https://example.com/trip/5",
    id: 5,
    number: 105,
    title: "Beach Picnic",
    labels: [{ name: "4:00 PM", color: "orange" }],
    state: "10",
    comments: 3,
    created_at: "2024-07-09T16:00:00Z",
    updated_at: "2024-07-10T17:00:00Z",
    status: "open",
    type: "open",
  },
];

function Page() {
  const actionRef = useRef<ActionType>();
  return (
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
        <ProTable<GithubIssueItem>
          columns={columns}
          actionRef={actionRef}
          dataSource={fakeData}
          cardBordered
          editable={{
            type: "multiple",
          }}
          columnsState={{
            persistenceKey: "pro-table-single-demos",
            persistenceType: "localStorage",
            defaultValue: {
              option: { fixed: "right", disable: true },
            },
            onChange(value) {
              console.log("value: ", value);
            },
          }}
          rowKey="id"
          search={{
            labelWidth: "auto",
          }}
          options={{
            setting: {
              listsHeight: 400,
            },
          }}
          form={{
            syncToUrl: (values, type) => {
              if (type === "get") {
                return {
                  ...values,
                  created_at: [values.startTime, values.endTime],
                };
              }
              return values;
            },
          }}
          pagination={{
            pageSize: 5,
            onChange: (page) => console.log(page),
          }}
          dateFormatter="string"
          headerTitle="Advanced Table"
          toolBarRender={() => [
            <Button
              key="button"
              icon={<PlusOutlined />}
              onClick={() => {
                actionRef.current?.reload();
              }}
              type="primary"
            >
              New
            </Button>,
            <Dropdown
              key="menu"
              menu={{
                items: [
                  { label: "1st item", key: "1" },
                  { label: "2nd item", key: "2" },
                  { label: "3rd item", key: "3" },
                ],
              }}
            >
              <Button>
                <EllipsisOutlined />
              </Button>
            </Dropdown>,
          ]}
        />
      </section>
    </PageContainer>
  );
}

export default Page;
