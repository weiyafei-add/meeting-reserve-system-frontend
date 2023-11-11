import request from "@/utils/request";

export async function register(data: any = {}) {
  return request({
    url: "/user/register",
    method: "POST",
    data: data,
  });
}

export async function getCaptcha(params: any) {
  return request({
    url: "/user/register-captcha",
    params,
    method: "GET",
  });
}

export async function login(data: any) {
  return request({
    url: "/user/login",
    data,
    method: "post",
  });
}
