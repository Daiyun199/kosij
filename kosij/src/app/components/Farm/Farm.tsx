// components/FarmDetailContent.tsx
import React from "react";
import Image from "next/image";
import { StarFilled, UserOutlined, CommentOutlined } from "@ant-design/icons";
import { Card, CardContent } from "@/components/ui/card"; // cập nhật đúng path nếu cần
import { Feedback } from "@/model/TourData";
import FarmMap from "../FarmMap/FarmMap";
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
  feedbacks: Feedback[];
}
interface Props {
  farm: Farm;
}

const FarmDetailContent: React.FC<Props> = ({ farm }) => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-lg shadow-md">
        <Image
          src={farm.imageUrl}
          alt={farm.farmName}
          width={500}
          height={300}
          className="rounded-lg shadow-sm object-cover w-full md:w-1/2"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">{farm.farmName}</h1>
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
            <p className="flex items-center">
              <strong>⭐ Rating:</strong>
              <span className="flex ml-2">
                {[...Array(5)].map((_, i) => (
                  <StarFilled
                    key={i}
                    className={
                      i < Math.floor(farm.averageRating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </span>
              <span className="ml-2">
                ({farm.feedbacks?.length || 0} reviews)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Koi Varieties */}
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

      {/* Feedback Section */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Customer Feedback
        </h2>

        {farm.feedbacks?.length > 0 ? (
          <div className="space-y-6">
            {farm.feedbacks.map((feedback) => (
              <div key={feedback.id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {feedback.customerAvatar ? (
                      <Image
                        src={feedback.customerAvatar}
                        alt={feedback.customerName}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserOutlined className="text-gray-400 text-xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="font-medium text-gray-800">
                        {feedback.customerName}
                      </h3>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarFilled
                            key={i}
                            className={
                              i < feedback.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 mt-3">{feedback.review}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CommentOutlined className="text-4xl text-gray-300" />
            <p className="mt-4 text-gray-500">No feedback available yet</p>
          </div>
        )}
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Farm Location
        </h2>
        <FarmMap address={farm.location} farmName={farm.farmName} />
      </div>
    </div>
  );
};

export default FarmDetailContent;
