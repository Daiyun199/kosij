import api from "@/config/axios.config";
import { parseApiResponse } from "@/lib/utils/parseApiResponse.util";

export type Request = {
  email: string;
  password: string;
};
export type Response = string | null;

LoginCredentials.URL = "/authentication/login";
export default async function LoginCredentials(
  req: Request
): Promise<Response | null> {
  return api
    .post<Response>(LoginCredentials.URL, req, {
      transformResponse: [
        (data) => {
          const parsedData = JSON.parse(data);
          if (parsedData?.message === "Login successfully") {
            return parsedData.value ?? null;
          }

          return parseApiResponse(data, undefined, (err) => {
            if (err.statusCode === 400) {
              throw new Error(err.message || "The account does not exist.");
            }
            throw new Error(err.message || "Unknown error.");
          });
        },
      ],
    })
    .then((res) => res.data);
}
