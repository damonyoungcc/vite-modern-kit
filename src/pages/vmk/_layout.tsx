import MenuLayout from "@/components/MenuLayout";
import getMenuItems from "@/api/getMenu";

export default function Layout() {
  return <MenuLayout menuPromise={getMenuItems()} />;
}
