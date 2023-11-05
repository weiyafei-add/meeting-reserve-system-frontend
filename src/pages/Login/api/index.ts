import request from "@/utils/request";

export async function register(data: any = {}) {
  return request({
    url: "/user/register",
    method: "POST",
    data: data,
  });
}
