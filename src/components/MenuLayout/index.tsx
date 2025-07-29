import "./style.scss";
import logo from "@/assets/logo.png"; // 确保logo路径正确";
import { Layout, Menu, Spin, ConfigProvider } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";

const prefixCls = "menu-layout"; // 统一前缀

type MenuItem = Required<MenuProps>["items"][number];
interface AdminLayoutProps {
  menuPromise: Promise<MenuItem[]>;
}

const { Sider, Header, Content } = Layout;

export default function AdminLayout({ menuPromise }: AdminLayoutProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    menuPromise.then(setMenuItems);
  }, [menuPromise]);

  if (!menuItems) {
    return (
      <div className={`${prefixCls}-loading`}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            colorSplit: "transparent",
          },
        },
      }}
    >
      <Layout className={prefixCls}>
        <Sider className={`${prefixCls}-sider`} width={220} theme="light">
          <div className={`${prefixCls}-sider-logo`}>
            <img src={logo} alt="logo" />
            VMK
          </div>
          <div className={`${prefixCls}-sider-scroll`}>
            <Menu
              mode="inline"
              theme="light"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={({ key }) => navigate(key)}
              rootClassName={`${prefixCls}-menu`}
            />
          </div>
        </Sider>

        <Layout className={`${prefixCls}-content-layout`}>
          <Header className={`${prefixCls}-header`}>Header Content</Header>
          <Content className={`${prefixCls}-content`}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
