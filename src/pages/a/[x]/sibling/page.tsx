import { useParams } from "react-router-dom";

function SiblingPage() {
  const params = useParams(); // ✅ 获取当前路由的参数
  return (
    <div>
      <div>params: x: {params.x}</div>
      <p>Current path: /a/{params.x}/sibling</p>
    </div>
  );
}
export default SiblingPage;
