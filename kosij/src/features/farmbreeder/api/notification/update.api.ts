import api from "@/config/axios.config";
import { Notifications } from "@/lib/domain/Notification/Notification.dto";
import { getAuthToken } from "@/lib/utils/auth.utils";

export function useNotifications() {
  const token = getAuthToken();

  async function updateNotification(id: number): Promise<Notifications[]> {
    const response = await api.put<Notifications[]>(
      `/notification/${id}/mark-as-read`,
      {},
      {
        headers: {
          Accept: "text/plain",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async function updateAllNotification(): Promise<Notifications[]> {
    try {
      const response = await api.put<Notifications[]>(
        `/notifications/mark-as-read`,
        {},
        {
          headers: {
            Accept: "text/plain",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating all notifications:", error);
      throw error;
    }
  }

  return { updateNotification, updateAllNotification };
}
