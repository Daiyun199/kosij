import api from "@/config/axios.config";
import { VarietyDto } from "@/lib/domain/Variety/Variety.dto";
import { ApiSuccessResponse } from "@/lib/types/ApiResponse";

export type Response = ApiSuccessResponse<VarietyDto[]>;

export default async function FarmBreeder_Variety_All(): Promise<Response | null> {
  try {
    console.log("Fetching data from API...");
    const response = await api.get<Response>(
      "/farm-variety/varieties/current-farm"
    );

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

export const fetchKoiVarieties = async () => {
  try {
    const response = await api.get(`/koi-varieties`);
    return response.data.value;
  } catch (error) {
    console.error("Error fetching koi varieties:", error);
    throw new Error("Failed to fetch koi varieties");
  }
};