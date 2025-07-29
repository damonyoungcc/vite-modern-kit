// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { AppRouter } from "./router";
import { ConfigProvider } from "antd";
import "./styles/global.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#bf0000", // 全局主题色
      },
    }}
  >
    <React.StrictMode>
      <AppRouter />
    </React.StrictMode>
  </ConfigProvider>
);
