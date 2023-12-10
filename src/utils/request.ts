import { message } from "antd";
import axios, { Method } from "axios";
import { history } from "umi";

let BaseUrl = "https://116.204.21.112/end";

const axiosInstance = axios.create({
  baseURL: BaseUrl,
});

axiosInstance.interceptors.response.use(
  (config) => {
    return config;
  },
  ({ response }) => {
    // if (`${response.status}`.startsWith("4")) {
    //   message.error(response.data.message);
    //   localStorage.removeItem("access_token");
    //   localStorage.removeItem("refresh_token");
    //   history.push("/login");
    // }
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
  headers = {
    ...headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };

  return axiosInstance({
    url: `${BaseUrl}${url}`,
    method,
    headers,
    params,
    data,
  }).then((res) => res.data);
};

export default request;
