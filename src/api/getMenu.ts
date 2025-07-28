// src/api/getMenu.ts
import type { MenuProps } from "antd";
type MenuItem = Required<MenuProps>["items"][number];

export function getMenuItems(): Promise<MenuItem[]> {
  return Promise.resolve([
    {
      key: "/main/routes",
      label: "Routes",
    },
    {
      key: "/main/users",
      label: "User Management",
    },
    {
      key: "/main/settings",
      label: "Settings",
    },
  ]);
}
