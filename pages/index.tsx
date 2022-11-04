import Head from "next/head";
import styles from "../styles/home.module.less";
import { Layout } from "../components";
import { CallTable } from "../components";

export default function Home() {
  return (
    <Layout>
      <CallTable />
    </Layout>
  );
}
