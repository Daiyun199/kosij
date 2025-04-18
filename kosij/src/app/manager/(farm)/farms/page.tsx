"use client";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Table, Button, message } from "antd";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import api from "@/config/axios.config";
import { FarmBreeder } from "@/model/FarmBreeder";
import SearchBar from "@/app/components/SearchBar/SearchBar";
import isBetween from "dayjs/plugin/isBetween";
import ProtectedRoute from "@/app/ProtectedRoute";

dayjs.extend(isBetween);

function Page() {
  const router = useRouter();
  const [farmBreederData, setFarmBreederData] = useState<FarmBreeder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    fetchFarmBreeder();
  }, []);

  const fetchFarmBreeder = async () => {
    setLoading(true);
    try {
      const response = await api.get("/manager/users/FarmBreeder");
      const transformedData = response.data.value.map(
        (breeder: FarmBreeder) => ({
          ...breeder,
          status: breeder.status ? "Active" : "Inactive",
        })
      );
      setFarmBreederData(transformedData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error("Failed to fetch farm breeders");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = farmBreederData.filter((customer) => {
    return (
      customer.fullName.toLowerCase().includes(searchValue.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchValue.toLowerCase()) ||
      customer.phoneNumber.includes(searchValue)
    );
  });

  const farmBreederColumns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Farm Email",
      dataIndex: "farmEmail",
      key: "farmEmail",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Farm Phone Number",
      dataIndex: "farmPhoneNumber",
      key: "farmPhoneNumber",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "Active" },
        { text: "Inactive", value: "Inactive" },
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onFilter: (value: any, record: FarmBreeder) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: FarmBreeder) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            onClick={() =>
              router.push(
                `/manager/farms/${record.accountId}?farmId=${record.farmId}`
              )
            }
          >
            Detail
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => console.log("Delete:", record.accountId)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <ManagerLayout title="Farm Breeder List">
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <SearchBar
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <Table
          columns={farmBreederColumns}
          dataSource={filteredData}
          rowKey="accountId"
          loading={loading}
          bordered
          pagination={{ pageSize: 5 }}
        />
      </ManagerLayout>
    </ProtectedRoute>
  );
}

export default Page;
