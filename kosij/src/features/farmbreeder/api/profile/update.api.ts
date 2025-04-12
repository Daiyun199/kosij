import api from "@/config/axios.config";
import { getAuthToken } from "@/lib/utils/auth.utils";

interface UpdateFarmRequest {
  farmName: string;
  description: string;
  breederName: string;
  breederPhone: string;
  location: string;
  imageUrl: string;
  openingHours: string;
  farmPhoneNumber: string;
  farmEmail: string;
}

export const updateFarmProfile = async (data: UpdateFarmRequest) => {
      const token = getAuthToken();
    
  try {
    const response = await api.put('/current-farm', data, {
      headers: {
        Accept: 'text/plain',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to update farm profile');
  }
};