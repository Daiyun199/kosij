import axios from "axios";
import Cookies from "js-cookie";
import { clientEnv } from "../../env";

const api = axios.create({
  baseURL: clientEnv.STATIC_PROD_BACKEND_URL,
  timeout: 10000,
  validateStatus: (status) => status >= 200 && status < 300,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.info(
      `[DEV MODE]: Request to ${config.method?.toUpperCase()} "${
        config.url
      }": `,
      config
    );
    return config;
  },
  (error) => {
    console.info("[DEV MODE]: Request error: ", JSON.stringify(error, null, 2));
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.info(
      `[DEV MODE]: Response from ${response.config.method?.toUpperCase()} "${
        response.config.url
      }" (${response.status}): `,
      response
    );
    return response;
  },
  (error) => {
    console.error("[DEV MODE]: Response error: ", error);
    return Promise.reject(error);
  }
);

export default api;
