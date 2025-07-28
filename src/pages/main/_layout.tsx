// src/pages/_layout.tsx
import AdminLayout from "../../components/MenuLayout";
import { getMenuItems } from "../../api/getMenu";

export default function RootLayout() {
  return <AdminLayout menuPromise={getMenuItems()} />;
}
