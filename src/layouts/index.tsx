import { LogoutOutlined } from "@ant-design/icons";
import type { ProSettings } from "@ant-design/pro-components";
import { PageContainer, ProCard, ProConfigProvider, ProLayout } from "@ant-design/pro-components";
import { Button, ConfigProvider, Dropdown } from "antd";
import React, { useState } from "react";
import defaultProps from "./_defaultProps";
import { Link, Outlet, useLocation, history } from "umi";
import Login from "../pages/Login/index-sparex";
import Toggle from "./toggleTheme";
import styles from "./index.modules.less";

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
  const [num, setNum] = useState(40);
  if (typeof document === "undefined") {
    return <div />;
  }
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
              title: "妮妮",
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
              return <h1 className={styles.logo_text}>企业会议综合管理系统</h1>;
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
            <div style={{ height: "100%", backgroundColor: "#fff", color: "#000", borderRadius: "10px" }}>
              <Outlet />
            </div>
          </ProLayout>
        </ConfigProvider>
      </ProConfigProvider>
    </div>
  );
};
