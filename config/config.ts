export const routes = [
  {
    path: "/",
    routes: [
      { path: "/", name: "欢迎", component: "index" },
      { path: "/login", component: "@/pages/Login" },
      {
        path: "/meetingroom-manager",
        name: "会议室管理",
        routes: [
          {
            path: "/meetingroom-manager/roomlist",
            name: "会议室列表",
            component: "@/pages/meetingroom-manager/roomlist",
          },
          {
            path: "/meetingroom-manager/reserve",
            name: "预定会议室",
            component: "@/pages/meetingroom-manager/reserve",
          },
        ],
      },
      { path: "/room", name: "在线会议室", component: "@/pages/Room" },
      {
        path: "/user",
        name: "用户管理",
        routes: [
          {
            path: "/user/manager",
            name: "用户列表",
            component: "@/pages/User",
          },
        ],
      },
    ],
  },
];
