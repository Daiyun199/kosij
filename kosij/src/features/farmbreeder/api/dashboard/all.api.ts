import api from "@/config/axios.config";
import { getAuthToken } from "@/lib/utils/auth.utils";

export const fetchStatistics = async () => {
    const token = getAuthToken();
    const response = await api.get("/farm-variety/statistics/current-farm", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/plain",
      },
    });
    console.log("API Response:", response.data.value);

    return response.data.value;
  };