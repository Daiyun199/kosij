import api from "@/config/axios.config";
import { Order } from "@/lib/domain/Order/Order.dto";
import { getAuthToken } from "@/lib/utils/auth.utils";
import { QueryFunctionContext } from "@tanstack/react-query";

export const fetchOrderDetails = async ({ queryKey }: QueryFunctionContext): Promise<Order> => {
  const id = queryKey[1];
  const token = getAuthToken();

  try {
    const response = await api.get(`/farm-variety/order/${id}/current-farm`, {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.value
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
};