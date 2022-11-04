import { Layout, LoginForm } from "../components";
import styles from "../styles/login.module.less";

const Login = () => {
  return (
    <Layout>
      <div className={styles.login}>
        <div className={styles.loginForm}>
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
};

export default Login;
