import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { useFeedback } from "@/context/RequestFeedbackContext";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
}

interface CustomAxiosConfig extends AxiosRequestConfig {
  skipErrorHandler?: boolean;
  skipLoading?: boolean;
}

const LOADING_DELAY = 200;
const BASE_URL = "/api";

export function useRequest() {
  const { dispatch } = useFeedback();
  let loadingTimer: ReturnType<typeof setTimeout> | null = null;

  const instance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 8000,
    headers: { "Content-Type": "application/json" },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      const c = config as CustomAxiosConfig;
      if (!c.skipLoading) {
        loadingTimer = setTimeout(() => {
          dispatch({ type: "START_LOADING" });
        }, LOADING_DELAY);
      }

      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      if (loadingTimer) {
        clearTimeout(loadingTimer);
        loadingTimer = null;
      }
      dispatch({ type: "STOP_LOADING" });
      return Promise.reject(error);
    }
  );

  // 响应拦截器（仅处理 loading，不改返回值）
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (loadingTimer) {
        clearTimeout(loadingTimer);
        loadingTimer = null;
      }
      dispatch({ type: "STOP_LOADING" });
      return response; // 保持 AxiosResponse 类型
    },
    (error) => {
      if (loadingTimer) {
        clearTimeout(loadingTimer);
        loadingTimer = null;
      }
      dispatch({ type: "STOP_LOADING" });
      return Promise.reject(error);
    }
  );

  // 对外暴露统一的请求函数，返回 ApiResponse
  async function request<T = any>(config: CustomAxiosConfig): Promise<ApiResponse<T>> {
    try {
      const response = await instance(config);
      const data = response.data;

      if (data?.code === 0) {
        return { success: true, data: data.data };
      } else {
        if (!config.skipErrorHandler) {
          dispatch({ type: "SHOW_ERROR", payload: data?.message || "Business Error" });
        }
        return { success: false, message: data?.message || "Error", code: data?.code };
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "Network Error";
      if (!config.skipErrorHandler) {
        dispatch({ type: "SHOW_ERROR", payload: msg });
      }
      return { success: false, message: msg };
    }
  }

  return { request };
}
