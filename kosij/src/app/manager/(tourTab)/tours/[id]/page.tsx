"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import TourDetail from "@/app/components/TourDetail/TourDetail";
import ProtectedRoute from "@/app/ProtectedRoute";
import api from "@/config/axios.config";
import { getAuthToken } from "@/lib/utils/auth.utils";
import { TourData } from "@/model/TourData";

import { useParams } from "next/navigation";

import React, { useEffect, useState } from "react";

function Page() {
  const params = useParams() as { id: string };
  const id = params.id;
  const [tourData, setTourData] = useState<TourData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchTourData = async () => {
      const token = getAuthToken();
      try {
        const response = await api.get(`/tour/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "text/plain",
          },
        });
        const data = response.data.value;
        if (!data) throw new Error("No data returned from API");
        let feedbackData = [];
        try {
          const feedbackResponse = await api.get(`/tour/${id}/feedbacks`);
          feedbackData = feedbackResponse.data.value || [];
        } catch (feedbackError) {
          console.warn("Không thể tải feedbacks:", feedbackError);
        }
        setTourData({
          id: data.id,
          isDeleted: data.isDeleted,
          title: data.tourName,
          tourCode: `TRP-${data.id}`,
          duration: `${data.days} Days ${data.nights} Nights`,
          type: data.tourStatus,
          imageUrl: data.imageUrl,
          price: {
            adult: `${
              data.tourPrices.find(
                (p: { ageGroup: string }) => p.ageGroup === "Adult"
              )?.price || 0
            } VND`,

            children1_11: `${
              data.tourPrices.find(
                (p: { ageGroup: string }) => p.ageGroup === "Child"
              )?.price || 0
            } VND`,

            children12_plus: `${
              data.tourPrices.find(
                (p: { ageGroup: string }) => p.ageGroup === "Infant"
              )?.price || 0
            } VND`,
          },
          tourStatus: data.tourStatus,
          departurePoints: data.departurePoint,
          destinationPoints: data.destinationPoint,

          tripList:
            data.tripsList?.map(
              (trip: { id: string; departureDate: string }) => ({
                id: trip.id,
                departureDate: trip.departureDate,
              })
            ) || [],
          numberOfTrips: data.numberOfTrips,
          tourPriceIncludes: data.tourPriceInclude?.split(", ") || [],

          tourPriceNotIncludes: data.tourPriceNotInclude?.split(", ") || [],
          cancelPolicy:
            data.cancellationPolicy
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ?.map((policy: { description: any }) => policy.description)
              .join("<br>") || [],
          depositPolicy:
            data.paymentPolicy && data.paymentPolicy.length > 0
              ? data.paymentPolicy
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .map((policy: { description: any }) => policy.description)
                  .join("<br>")
              : "",
          promotionPolicy:
            data.promotionPolicy && data.promotionPolicy.length > 0
              ? data.promotionPolicy
                  .map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (promotion: { description: any }) => promotion.description
                  )
                  .join("<br>")
              : "",

          itinerary:
            data.tourDetails?.map(
              (detail: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                day: any;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                itineraryName: any;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                itineraryDetails: any;
              }) => ({
                day: detail.day,
                itineraryName: detail.itineraryName,
                itineraryDetails: detail.itineraryDetails,
              })
            ) || [],
          feedbacks: feedbackData || [],
        });
      } catch (error) {
        console.error("Lỗi tải dữ liệu tour:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!tourData) return <p>Tour not found</p>;

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <ManagerLayout title="Tour Detail">
        <TourDetail data={tourData} />
      </ManagerLayout>
    </ProtectedRoute>
  );
}

export default Page;
