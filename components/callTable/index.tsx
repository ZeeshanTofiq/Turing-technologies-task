import { useQuery, gql, useMutation, useSubscription } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Dropdown,
  Space,
  Menu,
  Modal,
  Popconfirm,
  message,
  Pagination,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { CapitalizeFirstLetter, fmtMSS } from "../../helper";
import type { ColumnsType } from "antd/es/table";
import styles from "./styles.module.less";
import dayjs from "dayjs";
import classNames from "classnames";
import AddNoteModal from "./addNoteModal";
import DetailCallModal from "./detailCallModal";

const queryPaginatedCall = gql`
  query ($offset: Float!, $limit: Float!) {
    paginatedCalls(offset: $offset, limit: $limit) {
      nodes {
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
      totalCount
      hasNextPage
    }
  }
`;

interface DType {
  id: any;
  key: React.Key;
  callType: string;
  direction: string;
  duration: string;
  from: string;
  to: string;
  via: string;
  createdAt: string;
  is_archived: string;
}

const makeArchiveMutation = gql`
  mutation archiveCall($id: ID!) {
    archiveCall(id: $id) {
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
export const CallTable = () => {
  const defaultPaginateData = {
    offset: 0,
    limit: 10,
  };
  const [selectedFilter, setSelectedFilter] = useState("");
  const [paginatedData, setPaginatedData] = useState(defaultPaginateData);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDetailModal, setIsOpenDetailModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [openMakeArchiveModal, setOpenMakeArchiveModal] = useState(false);
  const [allData, setAllData] = useState([]);
  const [makeArchiveCall] = useMutation(makeArchiveMutation);
  const getQueryVariables = useMemo(() => {
    return {
      offset: paginatedData.offset,
      limit: paginatedData.limit,
    };
  }, [paginatedData.limit, paginatedData.offset]);

  const { data } = useQuery(queryPaginatedCall, {
    variables: {
      ...getQueryVariables,
    },
  });

  const columns: ColumnsType<DType> = [
    {
      title: "CALL TYPE",
      dataIndex: "callType",
      key: "callType",
      render: (val, record) => {
        return (
          <div
            className={classNames([
              {
                [styles.primaryText]: val === "Voice Mail",
                [styles.redText]: val === "Missed",
                [styles.cyanText]: val === "Answered",
              },
            ])}
            onClick={() => {
              setSelectedRecord(record);
              setIsOpenDetailModal(true);
            }}
          >
            {val === "voicemail" ? "Voice Mail" : CapitalizeFirstLetter(val)}
          </div>
        );
      },
    },
    {
      title: "DIRECTION",
      dataIndex: "direction",
      key: "direction",
      render: (val) => <div className={styles.primaryText}>{val}</div>,
    },
    {
      title: "DURATION",
      dataIndex: "duration",
      key: "duration",
      render: (val) => (
        <div>
          <div>{fmtMSS(val)}</div>
          <div className={styles.primaryText}>{`(${val} seconds)`}</div>
        </div>
      ),
    },
    {
      title: "FROM",
      dataIndex: "from",
      key: "from",
    },
    {
      title: "TO",
      dataIndex: "to",
      key: "to",
    },
    {
      title: "VIA",
      dataIndex: "via",
      key: "via",
    },
    {
      title: "CREATED AT",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val) => dayjs(val).format("DD-MM-YYYY"),
    },
    {
      title: "STATUS",
      dataIndex: "is_archived",
      key: "is_archived",
      render: (val) => {
        if (val) {
          return <Tag color="cyan">Archived</Tag>;
        }
        return <Tag color="default">Unarchive</Tag>;
      },
    },
    {
      title: "ACTIONS",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <div className={styles.actionBlock}>
            <Button
              type="primary"
              onClick={() => {
                setSelectedRecord(record);
                setIsOpenModal(true);
              }}
            >
              Add Note
            </Button>
            {!record?.is_archived && (
              // <Button
              //   type="default"
              //   onClick={() => {
              //     setOpenMakeArchiveModal(true);
              //     setSelectedRecord(record);
              //   }}
              // >
              //   Make Archive
              // </Button>
              <Popconfirm
                title="Are you sure to make it archive?"
                onConfirm={(e: React.MouseEvent<HTMLElement>) => {
                  makeArchiveCall({
                    variables: {
                      id: record?.id,
                    },
                  })
                    .then(() => {
                      message.success("Okay");
                    })
                    .catch((err) => {
                      console.log(err);
                      message.error("Error", record?.id);
                    });
                  return console.log(e);
                }}
                okText="Yes"
                cancelText="No"
              >
                <a href="#">Make Archive</a>
              </Popconfirm>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (data?.paginatedCalls) {
      onChangeFilter();
    }
  }, [data]);

  useEffect(() => {
    if (selectedFilter) {
      onChangeFilter();
    }
  }, [selectedFilter]);

  const menu = (
    <Menu onSelect={(e) => console.log(e)}>
      <Menu.Item onClick={() => setSelectedFilter("All")}>
        <a target="_blank" rel="noopener noreferrer">
          All
        </a>
      </Menu.Item>
      <Menu.Item onClick={() => setSelectedFilter("Archived")}>
        <a target="_blank" rel="noopener noreferrer">
          Archived
        </a>
      </Menu.Item>
      <Menu.Item onClick={() => setSelectedFilter("Un Archived")}>
        <a target="_blank" rel="noopener noreferrer">
          Un Archived
        </a>
      </Menu.Item>
    </Menu>
  );
  const onChangeFilter = () => {
    if (selectedFilter === "All") {
      setAllData(data?.paginatedCalls?.nodes);
    } else if (selectedFilter === "Archived") {
      setAllData(
        data?.paginatedCalls?.nodes?.filter?.(
          (item: any) => item?.is_archived === true
        )
      );
    } else if (selectedFilter === "Un Archived") {
      setAllData(
        data?.paginatedCalls?.nodes?.filter?.(
          (item: any) => item?.is_archived === false
        )
      );
    } else {
      setAllData(data?.paginatedCalls?.nodes);
    }
  };
  const updateRecord = (record: any) => {
    let latest: any = [...allData];
    let foundIndex = latest.findIndex((x: any) => x?.id == record?.id);
    latest[foundIndex] = { ...record };
    setAllData(latest);
  };

  return (
    <>
      <div className={styles.callTable}>
        <div className={styles.heading}>Turing Technologies Frontend Test</div>
        <div className={styles.filter}>
          <div className={styles.filterText}>Filter:</div>
          <Dropdown overlay={menu} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                {selectedFilter ? selectedFilter : "Status"}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
        <div className={styles.tableBlock}>
          <Table
            dataSource={allData?.map?.((d: any) => {
              return {
                ...d,
                key: d?.id,
                callType:
                  d?.call_type === "voicemail"
                    ? "Voice Mail"
                    : CapitalizeFirstLetter(d?.call_type),
                direction: CapitalizeFirstLetter(d?.direction),
                duration: d?.duration,
                from: d?.from,
                to: d?.to,
                via: d?.via,
                createdAt: d?.created_at,
                is_archived: d?.is_archived,
              };
            })}
            pagination={
              false
              // {
              // total: data?.paginatedCalls.totalCount,
              // onChange: (e) => {
              //   setPaginatedData((prev) => ({
              //     ...prev,
              //     offset: prev.limit * e - prev.limit,
              //   }));
              // },
              // }
            }
            columns={columns}
          />
          <Pagination
            size="default"
            total={data?.paginatedCalls.totalCount}
            showSizeChanger={false}
            onChange={(e) => {
              setPaginatedData((prev) => ({
                ...prev,
                offset: prev.limit * e - prev.limit,
              }));
            }}
          />
        </div>
      </div>
      <AddNoteModal
        visible={isOpenModal}
        handleCancel={() => setIsOpenModal(false)}
        handleOk={() => setIsOpenModal(false)}
        record={selectedRecord}
        updateRecord={updateRecord}
      />
      <DetailCallModal
        visible={isOpenDetailModal}
        handleCancel={() => setIsOpenDetailModal(false)}
        record={selectedRecord}
        handleOk={() => setIsOpenDetailModal(false)}
      />
      <Modal
        title="Make Archive"
        visible={openMakeArchiveModal}
        onCancel={() => setOpenMakeArchiveModal(false)}
      ></Modal>
    </>
  );
};

export default CallTable;
