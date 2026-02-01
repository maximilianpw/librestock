import axios, { type AxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function getAxiosInstance<T>(
  config: AxiosRequestConfig,
): Promise<T> {
  const response = await axiosInstance.request<T>(config)
  return response.data
}
