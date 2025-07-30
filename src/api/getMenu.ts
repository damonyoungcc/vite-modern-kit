// src/api/getMenu.ts
import type { MenuProps } from "antd";
type MenuItem = Required<MenuProps>["items"][number];

export default function getMenuItems(): Promise<MenuItem[]> {
  return Promise.resolve([
    {
      key: "/vmk/routes",
      label: "Routes",
      children: [
        {
          key: "/vmk/routes/path",
          label: "Path Mapping",
        },
        {
          key: "/vmk/routes/layout",
          label: "Layout Wrapping",
        },
        {
          key: "/vmk/routes/engine",
          label: "Router Engine",
        },
      ],
    },
    {
      key: "/main/users",
      label: "User Management",
    },
    {
      key: "/main/settings",
      label: "Settings",
    },
    {
      key: "/main/about",
      label: "About",
    },
    {
      key: "/main/contact",
      label: "Contact",
    },
    { key: "/main/help", label: "Help" },
    { key: "/main/feedback", label: "Feedback" },
    { key: "/main/documentation", label: "Documentation" },
    { key: "/main/changelog", label: "Changelog" },
    { key: "/main/support", label: "Support" },
    { key: "/main/terms", label: "Terms of Service" },
    { key: "/main/privacy", label: "Privacy Policy" },
  ]);
}
