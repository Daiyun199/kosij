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

function Page() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const id = params.id;
  const { role } = useParams();
  const LayoutComponent = role === "manager" ? ManagerLayout : SaleStaffLayout;

  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState<OrderData>();

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
  }, [id]);

  if (loading) return <p>Loading...</p>;

  return (
    <LayoutComponent title="Order Details">
      <div className="p-6 max-w-5xl mx-auto">
        {loading ? (
          <Spin size="large" />
        ) : orders ? (
          <>
            <OrderInfo data={orders} />
          </>
        ) : (
          <Empty description="No order data available" />
        )}
      </div>
    </LayoutComponent>
  );
}

export default Page;
