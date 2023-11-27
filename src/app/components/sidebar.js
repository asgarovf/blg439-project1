import { TeamOutlined, PlaySquareFilled } from "@ant-design/icons";
import { Menu } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const items = [
  {
    label: "Maçlar",
    key: "matches",
    icon: <PlaySquareFilled />,
  },
  {
    label: "Takımlar",
    key: "team",
    icon: <TeamOutlined />,
    disabled: false,
  },
];

export const Sidebar = () => {
  const [current, setCurrent] = useState("matches");
  const router = useRouter();

  const onClick = (e) => {
    setCurrent(e.key);
    if (e.key === "matches") {
      router.push(`/`);
    } else if (e.key === "team") {
      router.push(`/admin`);
    }
  };

  useEffect(() => {
    if (window.location.pathname === "/") {
      setCurrent("matches");
    } else if (window.location.pathname === "/admin") {
      setCurrent("team");
    }
  }, []);

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      defaultSelectedKeys={["matches"]}
      items={items}
    />
  );
};
