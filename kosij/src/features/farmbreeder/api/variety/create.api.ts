import api from "@/config/axios.config";
import { getAuthToken } from "@/lib/utils/auth.utils";

export const createVariety = async (data: {
  varietyId: number;
  varietyName: string;
  description: string;
  imageUrl: string;
  isNew: boolean;
}) => {
  const token = getAuthToken();

  try {
    await api.post(`/farm-variety/variety/current-farm`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Variety created successfully!");
  } catch (error) {
    console.error("Failed to create variety:", error);
    throw new Error("Failed to create variety");
  }
};
