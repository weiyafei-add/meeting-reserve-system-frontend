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

// 预定会议室
export function bookingRoom(data: { id: number; startTime: number; endTime: number; clientId: string }) {
  return request({
    url: "/booking/room",
    data,
    method: "POST",
  });
}

/**
 * 我的预定
 */

export function getMyBookingList() {
  return request({
    url: "/booking/myBooking",
    method: "GET",
  });
}

// 取消预定
export function cancelBookingRoom(data: { id: number }) {
  return request({
    url: "/booking/cancel",
    data,
    method: "POST",
  });
}
