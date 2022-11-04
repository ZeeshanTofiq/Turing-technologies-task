import { CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { message } from "antd";
import React from "react";
import styles from "./styles.module.less";

export const ErrorNotification = (text: string, delay = 2): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let notify = () => {};

  notify = message.open({
    type: "error",
    content: (
      <div className={styles.notificationContent}>
        <span className={styles.notifyText}>{text}</span>
        <CloseOutlined className={styles.closeIcon} onClick={() => notify()} />
      </div>
    ),
    icon: <CloseCircleOutlined className={styles.notifyIcon} />,
    className: styles.notifyStyles,
    duration: delay,
  });
};

export default ErrorNotification;
