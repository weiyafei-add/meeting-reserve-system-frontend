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
            name: "我的预定",
            component: "@/pages/meetingroom-manager/reserve",
          },
        ],
      },
      {
        path: "/online-meeting",
        name: "在线会议",
        routes: [
          {
            path: "/online-meeting/online-meeting-list",
            name: "我的会议",
            component: "@/pages/online-meeting/online-meeting-list",
          },
          {
            path: "/online-meeting/create-online-meeting",
            name: "创建会议室",
            component: "@/pages/online-meeting/create-online-meeting",
          },
        ],
      },
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
      {
        path: "/profile",
        name: "个人信息",
        routes: [
          {
            path: "/profile/updatepassword",
            name: "密码修改",
            component: "@/pages/profile/updatePassword",
          },
          {
            path: "/profile/updateUserinfo",
            name: "信息修改",
            component: "@/pages/profile/updateUserinfo",
          },
        ],
      },
      { path: "/setting", name: "系统设置", component: "@/pages/setting" },
    ],
  },
];
