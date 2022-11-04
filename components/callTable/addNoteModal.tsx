import { Modal, message } from "antd";
import React, { useState } from "react";
import styles from "./styles.module.less";
import classNames from "classnames";
import { fmtMSS } from "../../helper";
import TextArea from "antd/lib/input/TextArea";
import { gql, useMutation } from "@apollo/client";

interface AddNoteModalInterface {
  visible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  record: any;
  updateRecord: (item: any) => void;
}
const addNoteMutation = gql`
  mutation addNote($id: ID!, $content: String!) {
    addNote(input: { activityId: $id, content: $content }) {
      id
      direction
      from
      to
      duration
      is_archived
      via
      call_type
      created_at
      is_archived
      notes {
        id
        content
      }
    }
  }
`;
const AddNoteModal = ({
  visible,
  handleOk,
  handleCancel,
  record,
  updateRecord,
}: AddNoteModalInterface) => {
  const [note, setNote] = useState("");
  const [addNote] = useMutation(addNoteMutation);
  return (
    <>
      <Modal
        title={
          <div className={styles.modalHeader}>
            <div>Add Notes</div>
            <div className={classNames([styles.primaryText, styles.callId])}>
              Call ID {record?.id}
            </div>
          </div>
        }
        visible={visible}
        onOk={() => {
          addNote({
            variables: {
              id: record?.id,
              content: note,
            },
          })
            .then((data) => {
              message.success("Added the note successfully");
              handleCancel();
              setNote("");
              updateRecord(data?.data?.addNote);
            })
            .catch(() => {
              message.error("Failed to add");
              handleCancel();
              setNote("");
            });
        }}
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
            <TextArea
              rows={6}
              placeholder="Add Notes"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddNoteModal;
