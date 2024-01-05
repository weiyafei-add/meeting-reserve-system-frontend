import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Tag, message, Modal, Form, DatePicker, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import { getRoomList, createRoom, updateRoom, deleteRoom, bookingRoom, freeMeeting } from "../api";
import dayjs from "dayjs";
import { getUserlist } from "@/pages/User/api";

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

const { RangePicker } = DatePicker;

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [bookRoomId, setBookRoomId] = useState<any>(0);
  const actionRef = useRef<ActionType>();
  const [tempKey, setTempKey] = useState(Math.random().toString().slice(3, 8));
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    getUserlist({
      pageNo: 1,
      pageSize: 100,
    }).then((res) => {
      setUserList(res.data.users);
    });
  }, []);

  const [form] = Form.useForm();

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
      render: (text, record) => {
        if (typeof text !== "boolean") {
          text = false;
        }
        return <Tag color={`${text ? "red" : "green"}`}>{text ? "已被预定" : "可预定"}</Tag>;
      },
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
        return <div>{dayjs(text).format("YYYY-MM-DD")}</div>;
      },
      editable: false,
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      hideInSearch: true,
      render: (text: any) => {
        return <div>{dayjs(text).format("YYYY-MM-DD")}</div>;
      },
      editable: false,
    },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      render: (text, record, _, action) => {
        if (record.isBooked) {
          return [
            <a
              key="editable"
              onClick={() => {
                action?.startEditable?.(record.id);
              }}
            >
              编辑
            </a>,
            <a
              key="free"
              onClick={async () => {
                console.log(record.id);
                await freeMeeting({ id: record.id });
                message.success("释放成功");
                action?.reload();
              }}
            >
              释放
            </a>,
          ];
        }
        return [
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setBookRoomId(record.id);
            }}
            key="book"
          >
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
        ];
      },
    },
  ];

  return (
    <div>
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
                  id: tempKey,
                  createTime: dayjs(),
                  updateTime: dayjs(),
                },
                {
                  recordKey: tempKey,
                  newRecordType: "dataSource",
                  position: "top",
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
            if (rowKey === tempKey) {
              await createRoom(data);
              message.success("新增会议室成功");
              setTempKey(Math.random().toString().slice(3, 8));
              actionRef.current?.reload();
              return;
            }
            await updateRoom(data);
            message.success("更新会议室成功");
            actionRef.current?.reload();
          },

          onCancel: async (key) => {
            actionRef.current?.reload();
          },

          onDelete: async (key, row) => {
            await deleteRoom({ id: key });
            message.success("删除成功");
            actionRef.current?.reload();
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
      <Modal
        title="预定会议室"
        open={bookRoomId}
        onOk={async () => {
          await form.validateFields();
          const {
            bookingTime: [startTime, endTime],
            attendMeetingList,
          } = form.getFieldsValue();
          const res = await bookingRoom({
            id: bookRoomId,
            startTime: dayjs(startTime).valueOf(),
            endTime: dayjs(endTime).valueOf(),
            clientId: sessionStorage.getItem("clientId") as string,
            attendMeetingList,
          });
          message.success("预定成功");
          setBookRoomId(0);
          form.resetFields();
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setBookRoomId(0);
          form.resetFields();
        }}
      >
        <Form form={form} labelCol={{ span: 4 }}>
          <Form.Item label="预定时长" name="bookingTime" rules={[{ required: true, message: "请选择预定时长" }]}>
            <RangePicker showTime />
          </Form.Item>
          <Form.Item
            label="参会人员"
            name={"attendMeetingList"}
            rules={[{ required: true, message: "请选择参会人员" }]}
            initialValue={[1]}
          >
            <Select
              mode="multiple"
              options={userList.map((item: any) => ({
                label: item.username,
                value: item.id,
              }))}
              allowClear
              placeholder="请选择参会人员"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
