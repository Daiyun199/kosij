import api from "@/config/axios.config";
import { getAuthToken } from "@/lib/utils/auth.utils";

export const getCurrentFarmTrips = async () => {
  const token = getAuthToken();

  const response = await api.get("/farm-variety/trips/current-farm", {
    headers: {
      Accept: "text/plain",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.value;
};
