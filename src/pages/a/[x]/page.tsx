import { useParams } from "react-router-dom";

export default function XPage() {
  const params = useParams(); // ✅ 获取当前路由的参数
  const x = params.x; // 注意：x 是 string | undefined

  return <div>param x: {x}</div>;
}
