declare module "virtual:vmk-routes" {
  import type { RouteObject } from "react-router-dom";
  const routes: RouteObject[];
  export default routes;
}

declare module "*.scss";

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.png" {
  const src: string;
  export default src;
}
