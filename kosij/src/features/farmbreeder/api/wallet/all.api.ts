import api from "@/config/axios.config";
import { getAuthToken } from "@/lib/utils/auth.utils";

export const fetchTransaction = async () => {
    const token = getAuthToken();
    const response = await api.get("/transactions/current-user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/plain",
      },
    });
    console.log("API Response:", response.data.value);

    return response.data.value;
  };