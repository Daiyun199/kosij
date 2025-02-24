import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@/lib/types/ApiResponse";
import { UnauthorizedError } from "@/lib/error/unauthorized.error";

/**
 * This function adds typing to the response and error handling of an API call.
 * NOTE: if using AXIOS, only errors allowed through validateStatus will be caught in onError (for defaults, see axios.config.ts)
 *
 * @param response raw response
 * @param onSuccess response success handler
 * @param onError response error handler
 */
// export function parseApiResponse<T extends ApiResponse<T>>(
//    response: string,
//    onSuccess: (response: ApiSuccessResponse<T>) => unknown = (res) => res.data,
//    onError: (response: ApiErrorResponse) => unknown = (res) => {
//       console.error(res)
//       throw new Error(res.message)
//    },
// ) {
//    const parsedResponse = JSON.parse(response) // TODO some shit breaks here idfk wtf
//    if (parsedResponse.data !== undefined) {
//       // Response was successful
//       return onSuccess(parsedResponse as ApiSuccessResponse<T>)
//    } else {
//       if ((parsedResponse as ApiErrorResponse).statusCode === 403) {
//          throw new UnauthorizedError()
//       }
//       // error response
//       return onError(parsedResponse as ApiErrorResponse)
//    }
// }
export function parseApiResponse<T>(
   response: string | object,
   onSuccess: (response: ApiSuccessResponse<T>) => unknown = (res) => res.data,
   onError: (response: ApiErrorResponse) => unknown = (res) => {
     console.error(res);
     throw new Error(res.message);
   }
 ) {
   let parsedResponse: ApiSuccessResponse<T> | ApiErrorResponse;
 
   // If response is a string, parse it; otherwise, use as is
   if (typeof response === "string" && response.trim() !== "") {
     try {
       parsedResponse = JSON.parse(response) as ApiSuccessResponse<T> | ApiErrorResponse;
     } catch (err) {
       console.error("JSON Parsing Error:", err);
       throw new Error("Invalid JSON response");
     }
   } else {
     parsedResponse = {} as ApiSuccessResponse<T>; // Handle empty response case
   }
 
   // If status is 204 (No Content), return an empty array or default value
   if ("value" in parsedResponse) {
     return onSuccess({
       data: (parsedResponse.value || []) as T, // Ensure it's always an array
       statusCode: 200,
       message: parsedResponse.message || "No content",
     });
   } else {
     if (parsedResponse.statusCode === 403) {
       throw new UnauthorizedError();
     }
     return onError(parsedResponse as ApiErrorResponse);
   }
 }
 
