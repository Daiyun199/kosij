// import api from "@/config/axios.config";
// import { VarietyDto } from "@/lib/domain/Variety/Variety.dto";
// import { ApiSuccessResponse } from "@/lib/types/ApiResponse";
// import { parseApiResponse } from "@/lib/utils/parseApiResponse.util";
// import Cookies from "js-cookie";

import api from "@/config/axios.config";
import { VarietyDto } from "@/lib/domain/Variety/Variety.dto";
import { ApiSuccessResponse } from "@/lib/types/ApiResponse";

export type Response = ApiSuccessResponse<VarietyDto[]>;

// FarmBreeder_Variety_All.URL = "/farm-variety/varieties/current-farm";
// // export default async function FarmBreeder_Variety_All(): Promise<Response> {
// //   return api
// //     .get<Response>(FarmBreeder_Variety_All.URL, {
// //       transformResponse: (data) => parseApiResponse(data),
// //       headers: {
// //         Authorization: `Bearer ${Cookies.get("token")}`,
// //       },
// //     })
// //     .then((res) => res.data);
// // }
// export default async function FarmBreeder_Variety_All(): Promise<Response> {
//   return api
//     .get<Response>(FarmBreeder_Variety_All.URL, {
//       transformResponse: (data) => (data ? parseApiResponse<Response>(data) : { data: [], statusCode: 204, message: "No content" }),
//       headers: {
//         Authorization: `Bearer ${Cookies.get("token")}`,
//       },
//     })
//     .then((res) => res.data);
// }

export default async function FarmBreeder_Variety_All(): Promise<Response | null> {
  try {
    console.log("Fetching data from API...");
    const response = await api.get<Response>("/farm-variety/varieties/current-farm");

    console.log("Full API Response:", response);

    if (response.status === 204 || !response.data) {
      console.log("API returned 204 → Skipping update");
      return null; // ✅ Không cập nhật state nếu là 204
    }

    console.log("API returned valid data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching varieties:", error);
    return { statusCode: 500, message: "Error fetching data", data: [] };
  }
}
