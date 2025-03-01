"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import api from "@/config/axios.config";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { Card, CardContent } from "@/components/ui/card";

interface Variety {
  id: number;
  varietyName: string;
  description: string;
  imageUrl: string;
}

interface Farm {
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
}

export default function FarmDetail() {
  const { id } = useParams();
  const [farm, setFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(true);

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
    return <div className="text-center py-10 text-lg">Loading...</div>;
  if (!farm)
    return (
      <div className="text-center text-red-500 py-10 text-lg">
        Farm not found!
      </div>
    );

  return (
    <ManagerLayout title="Farm Detail">
      <div className="max-w-6xl mx-auto p-6">
        {/* Thông tin Farm */}
        <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-lg shadow-md">
          <Image
            src={farm.imageUrl}
            alt={farm.farmName}
            width={500}
            height={300}
            className="rounded-lg shadow-sm object-cover"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">
              {farm.farmName}
            </h1>
            <p className="text-gray-700 mt-2">{farm.description}</p>
            <div className="mt-4 space-y-2 text-gray-600">
              <p>
                <strong>📍 Location:</strong> {farm.location}
              </p>
              <p>
                <strong>👤 Breeder:</strong> {farm.breederName}
              </p>
              <p>
                <strong>🕒 Opening Hours:</strong> {farm.openingHours}
              </p>
              <p>
                <strong>📞 Contact:</strong> {farm.farmPhoneNumber} |{" "}
                {farm.farmEmail}
              </p>
              <p>
                <strong>⭐ Rating:</strong> {farm.averageRating}/5
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Koi Varieties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farm.varieties.map((variety) => (
              <Card
                key={variety.id}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-4">
                  <Image
                    src={variety.imageUrl}
                    alt={variety.varietyName}
                    width={300}
                    height={200}
                    className="rounded-md object-cover w-full h-[200px]"
                  />
                  <h3 className="text-lg font-bold mt-3 text-gray-800">
                    {variety.varietyName}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {variety.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ManagerLayout>
  );
}
