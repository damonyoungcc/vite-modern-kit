import AdminLayout from "../../components/MenuLayout";
import { getMenuItems } from "../../api/getMenu";

export default function RootLayout() {
  return (
    <div>
      <AdminLayout menuPromise={getMenuItems()} />
    </div>
  );
}
