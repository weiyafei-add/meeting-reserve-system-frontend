export const routes = [
  {
    path: "/",
    routes: [
      { path: "/", name: "欢迎", component: "index" },
      { path: "/docs", name: "文档", component: "docs" },
      { path: "/login", component: "@/pages/Login" },
      { path: "/room", name: "会议室", component: "@/pages/Room" },
      {
        path: "/meetingManager",
        name: "会议室管理",
        routes: [
          {
            path: "/meetingManager/reserve",
            name: "预定",
            component: "docs",
          },
        ],
      },
    ],
  },
];
