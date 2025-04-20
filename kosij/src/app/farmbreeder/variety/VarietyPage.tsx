"use client";

import { PageContainer } from "@ant-design/pro-layout";
import { Button, Image, message, Space } from "antd";
import {
  EditOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { VarietyDto } from "@/lib/domain/Variety/Variety.dto";
import { useEffect, useState } from "react";
import api from "@/config/axios.config";
import UpdateVarietyModal from "@/features/farmbreeder/component/UpdateVariety.modal";
import CreateVarietyModal from "@/features/farmbreeder/component/CreateVariety.modal";
import ProtectedRoute from "@/app/ProtectedRoute";

function VarietyPage() {
  const [varieties, setVarieties] = useState<VarietyDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const fetchVarietyList = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await api.get("/farm-variety/varieties/current-farm");
      setVarieties(response.data.value || []);
      setSelectedVarietyFarm(response.data.value?.[0]);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error("Failed to load varieties!");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVarietyList();
  }, []);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedVarietyFarm, setSelectedVarietyFarm] =
    useState<VarietyDto | null>(null);

  const handleUpdatedOpen = (variety: VarietyDto) => {
    setSelectedVarietyFarm(variety);
    setIsUpdateModalOpen(true);
    setTimeout(() => {
      console.log("Updated selectedVariety:", variety.varietyId);
    }, 0);
  };
  const handleUpdatedClose = () => {
    setIsUpdateModalOpen(false);
    setSelectedVarietyFarm(null);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdatedSubmit = (values: any) => {
    console.log("Form Submitted:", values);
    setIsUpdateModalOpen(false);
    fetchVarietyList();
  };

  const handleCreatedOpen = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    setIsCreateModalOpen(true);
  };

  const handleCreatedClose = () => {
    setIsCreateModalOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreatedSubmit = (values: any) => {
    console.log("Form Submitted:", values);
    setIsCreateModalOpen(false);
    fetchVarietyList()
  };
  return (
    <ProtectedRoute allowedRoles={["farmbreeder"]}>
      <PageContainer
        title="Varieties"
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
          <Button
            style={{
              backgroundColor: "#149D52",
              color: "#fff",
              height: "40px",
              fontWeight: "normal",
            }}
            icon={<PlusCircleOutlined />}
            onClick={handleCreatedOpen}
          >
            Add Variety
          </Button>
        </section>
        <section className="mt-5 grid grid-cols-2 gap-10 px-layout pb-layout">
          {loading && <p>Loading varieties...</p>}
          {error && <p>Error loading varieties.</p>}

          {!loading && !error && varieties.length > 0
            ? varieties.map((variety, index) => (
                <ProCard
                  className="relative h-96 w-full shadow-md p-4 flex flex-col justify-center"
                  key={variety.varietyId || `variety-${index}`}
                  bordered
                  title={variety.varietyName}
                >
                  <div className="absolute top-3 right-3 flex gap-2">
                    <EditOutlined
                      className="text-gray-600 hover:text-gray-800 cursor-pointer"
                      onClick={() => handleUpdatedOpen(variety)}
                    />
                    <MinusCircleOutlined className="text-gray-600 hover:text-gray-800 cursor-pointer" />
                  </div>

                  <div className="flex gap-4 w-full mt-6">
                    <div className="flex-shrink-0">
                      <Image
                        src={
                          Array.isArray(variety.imageUrl)
                            ? variety.imageUrl[0] || "/placeholder.png"
                            : variety.imageUrl || "/placeholder.png"
                        }
                        alt={variety.varietyName}
                        width={144}
                        height={224}
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-600">{variety.description}</p>
                    </div>
                  </div>
                </ProCard>
              ))
            : !loading && !error && <p>No varieties available</p>}
        </section>
        <UpdateVarietyModal
          visible={isUpdateModalOpen}
          onCancel={handleUpdatedClose}
          onSubmit={handleUpdatedSubmit}
          varietyId={selectedVarietyFarm?.varietyId}
          fetchVarietyList={fetchVarietyList}
        />
        <CreateVarietyModal
          visible={isCreateModalOpen}
          onCancel={handleCreatedClose}
          onSubmit={handleCreatedSubmit}
          fetchVarietyList={fetchVarietyList}
        />
      </PageContainer>
    </ProtectedRoute>
  );
}

export default VarietyPage;