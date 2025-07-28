import "./style.scss";
import { Typography, ConfigProvider, Space, Switch } from "antd";
import { TranslationOutlined, GithubOutlined, SunOutlined, MoonOutlined } from "@ant-design/icons";

const prefix = "home-page";
const { Paragraph, Text, Link } = Typography;

export default function Home() {
  return (
    <div className={`${prefix}__page`}>
      <div className={`${prefix}__header`}>
        <Space>
          <GithubOutlined />
          <TranslationOutlined />
          <Switch
            defaultChecked
            checkedChildren={<SunOutlined />}
            unCheckedChildren={<MoonOutlined />}
          />
        </Space>
      </div>
      <h1>Damon Young</h1>
      <ConfigProvider
        theme={{
          token: {
            fontSize: 17,
            colorText: "rgb(85,85,85)",
            lineHeight: 1.6,
            colorLink: "#bf0000",
            colorLinkHover: "#bf000086",
          },
        }}
      >
        <Text strong>I'v been a frontend developer for over 7 years.</Text>
        <Paragraph>
          This project is a personal showcase of my frontend <Text strong>architecture skills</Text>
          , built to <Text strong>summarize and reflect</Text> on my 7 years of professional
          experience in web development.
        </Paragraph>
        <Paragraph>
          <Text strong>The stack includes:</Text>
        </Paragraph>
        <ConfigProvider
          theme={{
            token: {
              colorText: "#bf0000",
            },
          }}
        >
          <Paragraph>
            <ul>
              <li>
                <Text strong>
                  <Link>
                    React 18 with Vite for fast development and modern build capabilities.
                  </Link>
                </Text>
              </li>
              <li>
                <Text strong>
                  <Link>TypeScript for type-safe, scalable code.</Link>
                </Text>
              </li>
              <li>
                <Text strong>
                  <Link>Redux for state management.</Link>
                </Text>
              </li>
              <li>
                <Text strong>
                  <Link>Modular routing system based on file structure.</Link>
                </Text>
              </li>
              <li>
                <Text strong>
                  <Link>SCSS with CSS Variables for flexible, maintainable styling. </Link>
                </Text>
              </li>
              <li>
                <Text strong>
                  <Link>Global theme management.</Link>
                </Text>
              </li>
              <li>
                <Text strong>
                  <Link>Multi-language support.</Link>
                </Text>
              </li>
            </ul>
          </Paragraph>
        </ConfigProvider>

        <Paragraph>
          Each route in this system explores a specific topic in frontend engineering — including
          architecture, component design, state management, performance optimization, and developer
          experience.
        </Paragraph>
        <Paragraph>
          Through this project, I hope to present a clean, modular, and maintainable foundation that
          reflects how I approach real-world frontend systems — with a strong focus on clarity,
          reusability, and developer productivity.
        </Paragraph>
      </ConfigProvider>
    </div>
  );
}
