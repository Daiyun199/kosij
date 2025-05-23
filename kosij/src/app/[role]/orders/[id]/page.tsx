/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";

import SaleStaffLayout from "@/app/components/SaleStaffLayout/SaleStaffLayout";
import api from "@/config/axios.config";
import { Button, Empty, Spin } from "antd";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import OrderInfo from "@/app/components/Orders/Orders";
import { OrderData } from "@/model/OrderInfoProps";
import ProtectedRoute from "@/app/ProtectedRoute";

function Page() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const id = params.id;
  const { role } = useParams();
  const LayoutComponent = role === "manager" ? ManagerLayout : SaleStaffLayout;

  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState<OrderData>();
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const ordersResponse = await api.get(`/order/${id}`);
        setOrders(ordersResponse.data.value);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, refreshKey]);
  const handleActionComplete = () => {
    setRefreshKey((prev) => prev + 1);
  };
  if (loading)
    return (
      <ProtectedRoute allowedRoles={["manager", "salesstaff"]}>
        Loading...
      </ProtectedRoute>
    );

  return (
    <ProtectedRoute allowedRoles={["manager", "salesstaff"]}>
      <LayoutComponent title="Order Details">
        <div className="p-6 max-w-5xl mx-auto">
          {loading ? (
            <Spin size="large" />
          ) : orders ? (
            <>
              <OrderInfo
                data={orders}
                onActionComplete={handleActionComplete}
              />
            </>
          ) : (
            <Empty description="No order data available" />
          )}
        </div>
      </LayoutComponent>
    </ProtectedRoute>
  );
}

export default Page;
