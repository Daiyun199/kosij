import api from "@/config/axios.config";

export const createWithdrawalRequest = async (data: {
  amount: number;
  bankName: string;
  bankNumber: string;
  holderName: string;
}) => {
  try {
    const response = await api.post("/withdrawal", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Withdrawal request failed:", error);
    throw error;
  }
};
