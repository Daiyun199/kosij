import api from "@/config/axios.config";

export const exportOrderBill = async (orderId: string | string[]) => {
  const response = await api.post(
    `/order/${orderId}/export-bill`,
    {},
    {
      responseType: "blob",
    }
  );
  return response.data;
};