import api from "@/config/axios.config";
import { parseApiResponse } from "@/lib/utils/parseApiResponse.util";
import { NotFoundError } from "@/lib/error/not-found.error";
import { UnknownError } from "@/lib/error/unknown.error";

export type Request = {
  email: string;
  password: string;
};
export type Response = string; // jwt token

LoginCredentials.URL = "/authentication/login"
export default async function LoginCredentials(req: Request): Promise<Response> {
   return api
      .post<Response>(LoginCredentials.URL, req, {
         transformResponse: [
            (data) => {
               const parsedData = JSON.parse(data)
         
               if (parsedData?.message === "Login successfully" && parsedData?.value) {
                  return parsedData.value // ✅ Return JWT token instead of throwing error
               }
         
               return parseApiResponse(data, undefined, (err) => {
                  if (err.statusCode === 404 && err.message === "Account not found") {
                     throw new NotFoundError("Account")
                  }
                  throw new UnknownError(err)
               })
            },
         ],
         
      })
      .then((res) => res.data)
}
