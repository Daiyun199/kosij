"use client";

import ClickableArea from "@/app/components/ClickableArea";
import { PageContainer } from "@ant-design/pro-layout";
import {
  Avatar,
  Button,
  List,
  Progress,
  Rate,
  Space,
  Statistic,
  Typography,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  StarFilled,
  WechatOutlined,
} from "@ant-design/icons";
import { cn } from "@/lib/utils/cn.util";
import { useQuery } from "@tanstack/react-query";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  AwaitedReactNode,
} from "react";
import { fetchRecentReviews } from "@/features/farmbreeder/api/feedback/all.api";
import { fetchStatistics } from "@/features/farmbreeder/api/dashboard/all.api";

// const ratings = [
//   { label: "5 stars", percent: 75 },
//   { label: "4 stars", percent: 15 },
//   { label: "3 stars", percent: 6 },
//   { label: "2 stars", percent: 3 },
//   { label: "1 star", percent: 1 },
// ];

const { Text } = Typography;

// const reviews = [
//   {
//     name: "Sarah Johnson",
//     avatar: "/avatar1.png",
//     rating: 5,
//     review:
//       "Excellent service! The customer support team was incredibly helpful and resolved my issue quickly. Would definitely recommend.",
//     time: "2 hours ago",
//   },
//   {
//     name: "Michael Chen",
//     avatar: "/avatar2.png",
//     rating: 4,
//     review:
//       "Good product overall, but there's room for improvement in the delivery process. Looking forward to seeing updates.",
//     time: "5 hours ago",
//   },
//   {
//     name: "Emily Rodriguez",
//     avatar: "/avatar3.png",
//     rating: 5,
//     review:
//       "Amazing experience from start to finish. The interface is intuitive and the features are exactly what I needed. Great job!",
//     time: "1 day ago",
//   },
// ];

function Page() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["farmStatistics"],
    queryFn: fetchStatistics,
  });

  const {
    data: reviews,
    isLoading: loadingReviews,
    isError: errorReviews,
  } = useQuery({
    queryKey: ["recentReviews"],
    queryFn: fetchRecentReviews,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <PageContainer
      title="Ratings & Reviews"
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
                <span className="text-lg font-normal">Average Rating</span>
              }
              value={`${data.averageRating}/5.0`}
              valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
            />
            <StarFilled className="text-yellow-500 text-2xl cursor-pointer" />
          </div>
          <Statistic
            value={3.2}
            valueStyle={{ fontSize: "1rem", color: "green" }}
            prefix={<ArrowUpOutlined />}
            suffix="% from last month"
          />
        </ClickableArea>
        <ClickableArea className={cn("block h-32 shadow-md p-4")}>
          <div className="flex items-start justify-between">
            <Statistic
              title={<span className="text-lg font-normal">Total Reviews</span>}
              value={data.totalFeedbacks}
              valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
            />
            <WechatOutlined className="text-blue-700 text-2xl cursor-pointer" />
          </div>
          <Statistic
            value={12.5}
            valueStyle={{ fontSize: "1rem", color: "red" }}
            prefix={<ArrowDownOutlined />}
            suffix="% from last month"
          />
        </ClickableArea>
      </section>
      <section className="mt-8 p-4 bg-white rounded-lg shadow-md">
        <h3 className="font-bold mb-2">Rating Distribution</h3>
        {data.feedbackStatistics.map(
          (rating: {
            star:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<unknown, string | JSXElementConstructor<unknown>>
              | Iterable<ReactNode>
              | ReactPortal
              | Promise<AwaitedReactNode>
              | null
              | undefined;
            percentage: number | undefined;
            count:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<unknown, string | JSXElementConstructor<unknown>>
              | Iterable<ReactNode>
              | ReactPortal
              | Promise<AwaitedReactNode>
              | null
              | undefined;
          }) => (
            <div
              key={`star-${rating.star}`}
              className="flex items-center gap-4 mb-2"
            >
              <span className="w-16 text-gray-700">{rating.star} stars</span>
              <Progress
                percent={rating.percentage}
                showInfo={false}
                strokeColor="#FFD700"
                trailColor="#f0f0f0"
                strokeWidth={12}
              />
              <span className="text-gray-700">{rating.percentage}%</span>
            </div>
          )
        )}
      </section>

      <section className="mt-5">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-4">Recent Reviews</h3>
          {loadingReviews ? (
            <div>Loading reviews...</div>
          ) : errorReviews ? (
            <div>Error fetching reviews.</div>
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={reviews}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={item.customerAvatar || "/default-avatar.png"}
                      />
                    }
                    title={
                      <div className="flex justify-between items-center">
                        <Text strong>{item.customerName}</Text>
                        <Text type="secondary">{item.postedDay}</Text>
                      </div>
                    }
                    description={
                      <>
                        <Rate
                          disabled
                          defaultValue={item.rating}
                          className="mb-1"
                        />
                        <p className="text-gray-600">{item.review}</p>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          )}
          <Button type="link" className="block mx-auto mt-4">
            Load More Reviews
          </Button>
        </div>
      </section>
    </PageContainer>
  );
}

export default Page;
