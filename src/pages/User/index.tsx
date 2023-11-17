import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useRef, useState } from "react";
import { getUserlist } from "./api";
import moment from "moment";

type Item = {
  id: number;
  username: string;
  nickName: string;
  email: string;
  headPic: string;
  phoneNumber: string;
  updateTime: string;
  createTime: string;
};

const columns: ProColumns<Item>[] = [
  {
    title: "用户名",
    dataIndex: "username",
    ellipsis: true,
  },
  {
    title: "昵称",
    dataIndex: "nickName",
  },
  {
    title: "邮箱",
    dataIndex: "email",
    hideInSearch: true,
  },
  {
    title: "头像",
    dataIndex: "headPic",
    hideInSearch: true,
    valueType: "image",
    width: 100,
  },
  {
    title: "手机号",
    dataIndex: "phoneNumber",
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
      return text === "-" ? text : <div>{moment(text).format("YYYY-MM-DD")}</div>;
    },
    editable: false,
  },
];

export default () => {
  const actionRef = useRef<ActionType>();

  return (
    <ProTable<Item>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
        const { current, pageSize, ...rest } = params;
        const {
          data: { users, totalCount },
        } = await getUserlist({
          ...rest,
          pageNo: current,
          pageSize: pageSize,
        });
        return {
          data: users,
          success: true,
          total: totalCount,
        };
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
