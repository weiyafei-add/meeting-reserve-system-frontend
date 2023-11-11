import request from "@/utils/request";

// 更新密码
export async function updatePassword(data: any) {
  return request({
    url: "/user/update_password",
    data,
    method: "POST",
  });
}

// 获取验证码
export async function getUpdatePasswordCaptcha(params: any) {
  return request({
    url: "/user/update_password/captcha",
    params,
  });
}
// 用户信息
export async function getUserInfo() {
  return request({
    url: "/user/info",
  });
}
