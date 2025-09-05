import axios, { AxiosInstance } from "axios";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export const createAPIClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
  });

  instance.interceptors.response.use(undefined, async (error) => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    config.__retryCount = config.__retryCount || 0;
    const maxRetries = 2;

    if (
      config.method?.toLowerCase() === "get" &&
      config.__retryCount < maxRetries
    ) {
      config.__retryCount += 1;
      const delay = 300 * Math.pow(2, config.__retryCount);
      await new Promise((res) => setTimeout(res, delay));
      return instance(config);
    }

    return Promise.reject(error);
  });

  return instance;
};

export const api = createAPIClient();
