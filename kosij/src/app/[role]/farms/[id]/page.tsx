/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import api from "@/config/axios.config";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { Card, CardContent } from "@/components/ui/card";
import SaleStaffLayout from "@/app/components/SaleStaffLayout/SaleStaffLayout";
import ProtectedRoute from "@/app/ProtectedRoute";
import { StarFilled, UserOutlined, CommentOutlined } from "@ant-design/icons";
import { Feedback } from "@/model/TourData";
import FarmDetailContent from "@/app/components/Farm/Farm";
export interface Variety {
  id: number;
  varietyName: string;
  description: string;
  imageUrl: string;
}

export interface Farm {
  id: number;
  farmName: string;
  description: string;
  breederId: number;
  breederName: string;
  location: string;
  imageUrl: string;
  openingHours: string;
  farmPhoneNumber: string;
  farmEmail: string;
  averageRating: number;
  status: boolean;
  varieties: Variety[];
  feedbacks: Feedback[];
}

export default function FarmDetail() {
  const { id } = useParams();
  const [farm, setFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(true);
  const { role } = useParams();
  const LayoutComponent = role === "manager" ? ManagerLayout : SaleStaffLayout;
  useEffect(() => {
    async function fetchFarm() {
      try {
        const { data } = await api.get(`farm/${id}`);
        setFarm(data.value);
      } catch (error) {
        console.error("Error fetching farm data:", error);
        setFarm(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchFarm();
  }, [id]);

  if (loading)
    return (
      <ProtectedRoute allowedRoles={["manager", "salesstaff"]}>
        <div className="text-center py-10 text-lg">Loading...</div>
      </ProtectedRoute>
    );
  if (!farm)
    return (
      <ProtectedRoute allowedRoles={["manager", "salesstaff"]}>
        <div className="text-center text-red-500 py-10 text-lg">
          Farm not found!
        </div>
      </ProtectedRoute>
    );

  return (
    <ProtectedRoute allowedRoles={["manager", "salesstaff"]}>
      <LayoutComponent title="Farm Detail">
        <FarmDetailContent farm={farm} />
      </LayoutComponent>
    </ProtectedRoute>
  );
}
