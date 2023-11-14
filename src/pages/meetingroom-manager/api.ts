import request from "@/utils/request";

export function getRoomList(params: any) {
  return request({
    url: "/meeting-room/list",
    params,
  });
}

// 新增会议室
export function createRoom(data: any) {
  return request({
    url: "/meeting-room/create",
    data,
    method: "POST",
  });
}
// 更新会议室
export function updateRoom(data: any) {
  return request({
    url: "/meeting-room/update",
    data,
    method: "POST",
  });
}
// 删除会议室
export function deleteRoom(params: any) {
  return request({
    url: `/meeting-room/${params.id}`,
    method: "delete",
  });
}
