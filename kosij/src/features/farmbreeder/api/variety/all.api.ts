// import api from "@/config/axios.config";
// import { VarietyDto } from "@/lib/domain/Variety/Variety.dto";
// import { ApiSuccessResponse } from "@/lib/types/ApiResponse";
// import { parseApiResponse } from "@/lib/utils/parseApiResponse.util";
// import Cookies from "js-cookie";

import api from "@/config/axios.config";
import { VarietyDto } from "@/lib/domain/Variety/Variety.dto";
import { ApiSuccessResponse } from "@/lib/types/ApiResponse";
import { getAuthToken } from "@/lib/utils/auth.utils";

export type Response = ApiSuccessResponse<VarietyDto[]>;

export default async function FarmBreeder_Variety_All(): Promise<Response | null> {
  try {
    console.log("Fetching data from API...");
    const response = await api.get<Response>("/farm-variety/varieties/current-farm");

    console.log("Full API Response:", response);

    if (response.status === 204 || !response.data) {
      console.log("API returned 204 → Skipping update");
      return null;
    }

    console.log("API returned valid data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching varieties:", error);
    return { statusCode: 500, message: "Error fetching data", data: [] };
  }
}

export const fetchRecentOrders = async () => {
  const token = getAuthToken();
  const response = await api.get("/farm-variety/recent-orders/current-farm", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "text/plain",
    },
  });
  return response.data.value;
};