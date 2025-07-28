// src/layouts/AdminLayout.tsx
import { Layout, Menu, Spin } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";
type MenuItem = Required<MenuProps>["items"][number];

const { Sider, Header, Content } = Layout;

interface AdminLayoutProps {
  menuPromise: Promise<MenuItem[]>;
}

export default function AdminLayout({ menuPromise }: AdminLayoutProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    menuPromise.then(setMenuItems);
  }, [menuPromise]);

  if (!menuItems) {
    return (
      <div
        style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={220}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }}>
          {/* 可放 logo / 用户名 / 主题切换 */}
        </Header>
        <Content style={{ margin: 24, background: "#fff", padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
