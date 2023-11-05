import axios, { Method } from "axios";

let BaseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

const axiosInstance = axios.create({
  baseURL: BaseUrl,
});

const request = ({ url, method = "GET", headers = {} }: { url: string; method?: Method; headers?: any }) => {
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
  });
};

export default request;
