import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useRef, useState } from "react";
import { getRoomList, createRoom, updateRoom, deleteRoom } from "../api";
import moment from "moment";

type Item = {
  id: number;
  name: string;
  isBooked: boolean;
  capacity: number;
  location: string;
  equipment: string;
  createTime: string;
  updateTime: string;
  description?: string;
};

const columns: ProColumns<Item>[] = [
  {
    title: "会议室名称",
    dataIndex: "name",
    copyable: true,
    ellipsis: true,
  },
  {
    title: "会议室状态",
    dataIndex: "isBooked",
    hideInSearch: true,
    editable: false,
  },
  {
    title: "可容纳人数",
    dataIndex: "capacity",
  },
  {
    title: "位置",
    dataIndex: "location",
  },
  {
    title: "设备",
    dataIndex: "equipment",
  },
  {
    title: "描述",
    dataIndex: "description",
    hideInSearch: true,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    hideInSearch: true,
    render: (text: any) => {
      return <div>{moment(text).format("YYYY-MM-DD")}</div>;
    },
    editable: false,
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    hideInSearch: true,
    render: (text: any) => {
      return <div>{moment(text).format("YYYY-MM-DD")}</div>;
    },
    editable: false,
  },
  {
    title: "操作",
    valueType: "option",
    key: "option",
    render: (text, record, _, action) => [
      <a target="_blank" rel="noopener noreferrer" key="book">
        预定
      </a>,
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
    ],
  },
];

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const actionRef = useRef<ActionType>();

  return (
    <ProTable<Item>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
        const { current, pageSize, ...rest } = params;
        const {
          data: { meetingRooms, totalCount },
        } = await getRoomList({
          pageNo: current,
          pageSize: pageSize,
          ...rest,
        });
        return {
          data: meetingRooms,
          success: true,
          total: totalCount,
        };
      }}
      toolBarRender={() => [
        <Button
          type="primary"
          onClick={() => {
            actionRef.current?.addEditRecord(
              {
                id: 0.1,
                createTime: moment(),
                updateTime: moment(),
              },
              {
                recordKey: 0.1,
                newRecordType: "dataSource",
              }
            );
          }}
        >
          新增一行
        </Button>,
      ]}
      editable={{
        editableKeys,
        type: "single",
        onChange: (editableKeys: any, editableRows: any) => {
          setEditableRowKeys(editableKeys);
        },
        onSave: async (rowKey, data, row) => {
          if (rowKey === 0.1) {
            await createRoom(data);
            message.success("新增会议室成功");
            return;
          }
          await updateRoom(data);
          message.success("更新会议室成功");
        },

        onCancel: async (key) => {
          actionRef.current?.reload();
        },

        onDelete: async (key, row) => {
          await deleteRoom({ id: key });
          message.success("删除成功");
        },
      }}
      rowKey="id"
      search={{
        labelWidth: "auto",
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      onChange={(a, b, c, d) => {
        console.log(a, b, c, d);
      }}
      pagination={{
        pageSize: 10,
      }}
      dateFormatter="string"
      headerTitle="会议室列表"
    />
  );
};
