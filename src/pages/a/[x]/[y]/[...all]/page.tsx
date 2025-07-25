import { useParams } from "react-router-dom";

export default function CatchAllYPage() {
  const params = useParams(); // ✅ 获取当前路由的参数
  console.log("CatchAllYPage params:", params);

  return (
    <div>
      fallback for /a/[x]/[y]/[...all] route
      <div>
        params: x: {params.x}, y: {params.y}, all: {params.all}
      </div>
      <p>
        Current path: /a/{params.x}/{params.y}/{params.all}
      </p>
      {/* 其他内容 */}
    </div>
  )
}
