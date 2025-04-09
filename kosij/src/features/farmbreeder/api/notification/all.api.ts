import api from "@/config/axios.config";
import { Notifications } from "@/lib/domain/Notification/Notification.dto";
import { getAuthToken } from "@/lib/utils/auth.utils";

export function useNotification() {
  async function fetchNotification(): Promise<Notifications[]> {
    const token = getAuthToken();

    try {
      const response = await api.get<{ value: Notifications[] }>(
        `/notifications`,
        {
          headers: {
            Accept: "text/plain",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.value;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  return { fetchNotification };
}
