"use client";

import { PageContainer } from "@ant-design/pro-layout";
import { Button, Space } from "antd";
import { EditOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import farmbreeder_queries from "@/features/farmbreeder/queries";
import { VarietyDto } from "@/lib/domain/Variety/Variety.dto";

function Page({ params }: { params: { id: string } }) {
  const {
    data: api_variety,
    isLoading,
    isError,
  } = farmbreeder_queries.variety.all({ id: params.id });
  return (
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
      <section className="mt-5">
        {isLoading && <p>Loading varieties...</p>}
        {isError && <p>Error loading varieties.</p>}
        {api_variety && (
          <Space direction="vertical" size="large">
            {api_variety.map((variety: VarietyDto) => (
              <ProCard
                key={variety.id}
                bordered
                style={{ width: 400 }}
                title={variety.varietyName}
                extra={
                  <>
                    <EditOutlined style={{ marginRight: 8 }} />
                    <MinusCircleOutlined />
                  </>
                }
                direction="row"
              >
                <img
                  src={variety.imageUrl[0] || "/placeholder.png"}
                  alt={variety.varietyName}
                  style={{ width: 120, height: "auto", borderRadius: 10 }}
                />
                <p style={{ marginLeft: 16 }}>{variety.description}</p>
              </ProCard>
            ))}
          </Space>
        )}
      </section>
    </PageContainer>
  );
}

export default Page;
