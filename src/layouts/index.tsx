import { LogoutOutlined } from "@ant-design/icons";
import type { ProSettings } from "@ant-design/pro-components";
import { PageContainer, ProCard, ProConfigProvider, ProLayout } from "@ant-design/pro-components";
import { Button, ConfigProvider, Dropdown } from "antd";
import React, { useState } from "react";
import defaultProps from "./_defaultProps";
import { Link, Outlet, useLocation, history } from "umi";
import Login from "../pages/Login";

export default () => {
  const location = useLocation();
  if (location.pathname === "/login") {
    return <Login />;
  }

  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
    layout: "mix",
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
            headerTitleRender={(logo, title, _) => {
              return <div>456</div>;
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
          >
            <PageContainer
              token={{
                paddingInlinePageContainerContent: num,
              }}
              extra={[
                <Button key="3">操作</Button>,
                <Button key="2">操作</Button>,
                <Button
                  key="1"
                  type="primary"
                  onClick={() => {
                    setNum(num > 0 ? 0 : 40);
                  }}
                >
                  主操作
                </Button>,
              ]}
            >
              <ProCard
                style={{
                  minHeight: 800,
                }}
              >
                <Outlet />
              </ProCard>
            </PageContainer>
          </ProLayout>
        </ConfigProvider>
      </ProConfigProvider>
    </div>
  );
};
