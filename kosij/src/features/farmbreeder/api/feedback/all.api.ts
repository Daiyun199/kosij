import api from "@/config/axios.config";
import { getAuthToken } from "@/lib/utils/auth.utils";

export const fetchRecentReviews = async () => {
    const token = getAuthToken();
    const response = await api.get("/farm-variety/feedbacks/current-farm", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/plain",
      },
    });
    return response.data.value;
  };