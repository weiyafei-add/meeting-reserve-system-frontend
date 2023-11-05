import { message } from "antd";
import axios, { Method } from "axios";

let BaseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

const axiosInstance = axios.create({
  baseURL: BaseUrl,
});

axiosInstance.interceptors.response.use(
  (config) => {
    console.log(config);
    return config;
  },
  ({ response }) => {
    if (response.status === 400) {
      message.error(response.data.message);
    }
    return Promise.reject(response);
  }
);

const request = ({
  url,
  method = "GET",
  headers = {},
  params = {},
  data = {},
}: {
  url: string;
  method?: Method;
  headers?: any;
  params?: any;
  data?: any;
}) => {
  if (method === "POST") {
    headers = {
      ...headers,
      "Content-Type": "application/json",
    };
  }

  return axiosInstance({
    url: `${BaseUrl}${url}`,
    method,
    headers,
    params,
    data,
  });
};

export default request;
