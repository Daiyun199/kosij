import api from "@/config/axios.config";
import { VarietyDto } from "@/lib/domain/Variety/Variety.dto";
import { parseApiResponse } from "@/lib/utils/parseApiResponse.util";

export type Request = { id: string };
export type Response = VarietyDto[];

FarmBreeder_Variety_All.URL = (req: Request) => `/farmvariety/varieties/by-farm/${req.id}`;
export default async function FarmBreeder_Variety_All(req: Request): Promise<Response> {
    return api.get<Response>(FarmBreeder_Variety_All.URL(req), {
        transformResponse: (data) => parseApiResponse(data),
        headers: {
            "Accept-Encoding": "gzip, deflate, br", 
            "Content-Type": "application/json",
          },
        }).then((res) => res.data);
      }
