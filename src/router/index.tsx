import { Suspense } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import routes from "virtual:vmk-routes";
function InnerRoutes() {
  const element = useRoutes(routes);
  return <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <InnerRoutes />
    </BrowserRouter>
  );
}
