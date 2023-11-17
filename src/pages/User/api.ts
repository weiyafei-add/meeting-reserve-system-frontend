import request from "@/utils/request";

export function getUserlist(params: any) {
  return request({
    url: "/user/list",
    params,
  });
}
