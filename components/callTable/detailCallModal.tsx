import { Modal } from "antd";
import React from "react";
import styles from "./styles.module.less";
import classNames from "classnames";
import { fmtMSS } from "../../helper";
import { gql } from "@apollo/client";

const callSubscription = gql`
  subscription ($id: ID!) {
    onUpdatedCall(id: $id) {
      id
      direction
      from
      to
      duration
      via
      is_archived
      call_type
      created_at
      notes {
        id
        content
      }
    }
  }
`;

interface AddNoteModalInterface {
  visible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  record: any;
}

export const DetailCallModal = ({
  visible,
  handleOk,
  handleCancel,
  record,
}: AddNoteModalInterface) => {
  return (
    <>
      <Modal
        title={
          <div className={styles.modalHeader}>
            <div>Detail</div>
            <div className={classNames([styles.primaryText, styles.callId])}>
              Call ID {record?.id}
            </div>
          </div>
        }
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className={styles.modalContent}>
          <div className={styles.contentItem}>
            <span className={styles.label}>Call Type</span>
            <span
              className={classNames([
                styles.value,
                {
                  [styles.primaryText]: record?.callType === "Voice Mail",
                  [styles.redText]: record?.callType === "Missed",
                  [styles.cyanText]: record?.callType === "Answered",
                },
              ])}
            >
              {record?.callType}
            </span>
          </div>
          <div className={styles.contentItem}>
            <span className={styles.label}>Duration</span>
            <span className={classNames([styles.value])}>
              {fmtMSS(record?.duration)}
            </span>
          </div>
          <div className={styles.contentItem}>
            <span className={styles.label}>From</span>
            <span className={classNames([styles.value])}>{record?.from}</span>
          </div>
          <div className={styles.contentItem}>
            <span className={styles.label}>To</span>
            <span className={classNames([styles.value])}>{record?.to}</span>
          </div>
          <div className={styles.contentItem}>
            <span className={styles.label}>Via</span>
            <span className={classNames([styles.value])}>{record?.via}</span>
          </div>
          <div className={styles.addNotes}>
            <div className={styles.label}>Notes</div>
            <div>
              {record?.notes?.map?.((item: any) => (
                <p key={item?.id}>{item?.content}</p>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DetailCallModal;
