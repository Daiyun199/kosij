import api from "@/config/axios.config";
import { getAuthToken } from "@/lib/utils/auth.utils";

export const updateOrderStatus = async ({ status, orderId }: { status: string, orderId: number }) => {
    const token = getAuthToken();
  
    const response = await api.put(`/order/${orderId}/breeder`, 
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };