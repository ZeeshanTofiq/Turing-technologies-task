import { ReactNode } from "react";
import { Layout as AntLayout, Button } from "antd";
import styles from "./Layout.module.less";
import Logo from "../../assets/TT Logo.png";
import Image from "next/image";
import { useUser } from "../../context/UserContext";

interface LayoutInterface {
  children: ReactNode;
}
const { Header, Content } = AntLayout;

export const Layout = ({ children }: LayoutInterface) => {
  const { me, logout } = useUser();

  return (
    <AntLayout>
      <Header className={styles.header}>
        <Image
          src={Logo}
          width={200}
          height={24}
          alt="logo"
          objectFit="contain"
        />
        {me && (
          <Button type="primary" onClick={logout}>
            Logout
          </Button>
        )}
      </Header>
      <Content className={styles.content}>{children}</Content>
    </AntLayout>
  );
};

export default Layout;
