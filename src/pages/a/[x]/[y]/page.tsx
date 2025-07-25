import { useParams } from "react-router-dom";

export default function XPage() {
  const params = useParams(); // ✅ 获取当前路由的参数
  const x = params.x; // 注意：x 是 string | undefined
  const y = params.y; // 注意：y 是 string | undefined

  return (
    <div>
      <div>
        params: x: {x}, y: {y}
      </div>
      <p>
        Current path: /a/{x}/{y}
      </p>
    </div>
  );
}
