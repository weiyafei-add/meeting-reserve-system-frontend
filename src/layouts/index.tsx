import { LogoutOutlined } from "@ant-design/icons";
import type { ProSettings } from "@ant-design/pro-components";
import { ProCard, ProConfigProvider, ProLayout } from "@ant-design/pro-components";
import { ConfigProvider, Dropdown, notification } from "antd";
import React, { useState, useEffect } from "react";
import defaultProps from "./_defaultProps";
import { Link, Outlet, useLocation, history } from "umi";
import Login from "../pages/Login/index-sparex";
import Toggle from "./toggleTheme";
import styles from "./index.modules.less";
import io from "socket.io-client";
import { getUserInfo } from "@/pages/profile/api";

export default () => {
  const location = useLocation();
  if (location.pathname === "/login") {
    return <Login />;
  }

  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
    layout: "mix",
    navTheme: "light",
  });

  const [pathname, setPathname] = useState<any>(useLocation().pathname || "/");
  const [userInfo, setUserInfo] = useState<any>({});
  if (typeof document === "undefined") {
    return <div />;
  }

  useEffect(() => {
    getUserInfo().then((res) => {
      setUserInfo(res.data);
      sessionStorage.setItem("userInfo", JSON.stringify(res.data));
    });

    const client = io("http://localhost:3636");

    client.on("connect", () => {
      sessionStorage.setItem("clientId", client.id);
      notification.success({
        message: "成功连接到服务器",
      });
    });

    client.on("notice", () => {
      new Notification("会议开始通知", {
        body: "您预约的会议还有5分钟就开始，请注意及时入会哦！",
        tag: "0",
        icon: "",
        renotify: true,
        dir: "auto",
      });
    });
    return () => {
      client.disconnect();
    };
  }, []);

  return (
    <div id="test-pro-layout">
      <ProConfigProvider hashed={false}>
        <ConfigProvider
          getTargetContainer={() => {
            return document.getElementById("test-pro-layout") || document.body;
          }}
        >
          <ProLayout
            prefixCls="my-prefix"
            {...defaultProps}
            location={{
              pathname,
            }}
            token={{
              header: {
                colorBgMenuItemSelected: "rgba(0,0,0,0.04)",
              },
            }}
            menu={{
              collapsedShowGroupTitle: true,
            }}
            avatarProps={{
              src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
              size: "small",
              title: userInfo.nickName,
              render: (props, dom) => {
                return (
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "logout",
                          icon: <LogoutOutlined />,
                          label: "退出登录",
                          onClick: () => {
                            localStorage.removeItem("accessToken");
                            localStorage.removeItem("refreshToken");
                            history.push("/login");
                          },
                        },
                      ],
                    }}
                  >
                    {dom}
                  </Dropdown>
                );
              },
            }}
            actionsRender={(props) => {
              if (props.isMobile) return [];
              if (typeof window === "undefined") return [];
              return [
                <Toggle
                  themeChange={(toogle) => {
                    setSetting({
                      ...settings,
                      navTheme: toogle ? "realDark" : "light",
                    });
                  }}
                ></Toggle>,
              ];
            }}
            headerTitleRender={(logo, title, _) => {
              return <h1 className={styles.logo_text}>欢迎使用</h1>;
            }}
            menuItemRender={(menuItemProps, defaultDom) => {
              if (menuItemProps.isUrl || !menuItemProps.path) {
                return defaultDom;
              }
              return (
                <Link
                  onClick={() => {
                    setPathname(menuItemProps.path);
                  }}
                  to={menuItemProps.path}
                >
                  {defaultDom}
                </Link>
              );
            }}
            {...settings}
            contentStyle={{ minHeight: "calc(100vh - 56px)" }}
          >
            <ProCard style={{ height: "100%" }}>
              <Outlet />
            </ProCard>
          </ProLayout>
        </ConfigProvider>
      </ProConfigProvider>
    </div>
  );
};
