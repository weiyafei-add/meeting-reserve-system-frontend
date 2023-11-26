import { useEffect, useState } from "react";
import { getMyBookingList, cancelBookingRoom } from "../../meetingroom-manager/api";
import { Avatar, Card, Col, Row, Modal, message, Empty } from "antd";
import dayjs from "dayjs";
import Room from "../index";

const { Meta } = Card;

const Index = () => {
  const [myBookingList, setMyBookingList] = useState([]);

  useEffect(() => {
    getMyBookingList().then((res) => {
      const { userBooking } = res.data;
      setMyBookingList(userBooking);
    });
  }, []);

  const handleIntoRoom = () => {};

  const renderCardTitle = (item: any) => {
    const { startTime } = item;
    if (dayjs(startTime).diff(dayjs(), "minutes") < 0) {
      return (
        <div style={{ display: "flex", gap: "20px", height: 60 }} onClick={handleIntoRoom}>
          <div>{item.room.name}</div>
          <div style={{ color: "red" }}>会议进行中，点击进入会议室</div>
        </div>
      );
    }
    return (
      <div style={{ display: "flex", gap: "20px", height: 60 }}>
        <div>{item.room.name}</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span>开始时间：{dayjs(item.startTime).format("YYYY-MM-DD HH:mm:ss")}</span>
          <span>结束时间：{dayjs(item.endTime).format("YYYY-MM-DD HH:mm:ss")}</span>
        </div>
      </div>
    );
  };

  const renderCancelBtn = (item: any) => {
    const { startTime } = item;
    if (dayjs(startTime).diff(dayjs(), "minutes") < 0) {
      return <div>会议已开始</div>;
    }
    return (
      <span
        style={{ color: "red" }}
        onClick={() => {
          Modal.confirm({
            title: "确定取消预定当前会议室吗？",
            onOk: async () => {
              await cancelBookingRoom({
                id: item.id,
              });
              message.success("取消预定成功");
              getMyBookingList().then((res) => {
                const { userBooking } = res.data;
                setMyBookingList(userBooking);
              });
            },
            onCancel: () => {},
            okButtonProps: {
              danger: true,
            },
          });
        }}
      >
        取消预定
      </span>
    );
  };

  const renderBookingList = () => {
    return myBookingList.map((item: any) => {
      const duration = dayjs(item.endTime).diff(dayjs(item.startTime));
      const hours = Math.floor(duration / 3600000);
      const minutes = Math.floor((duration % 3600000) / 60000);
      const seconds = Math.floor((duration % 60000) / 1000);
      return (
        <Col span={7} key={item.id}>
          <Card
            style={{ width: 400 }}
            cover={<img alt="example" src="/images/meeting-room.jpg" />}
            actions={[
              <span style={{ color: "#212121" }}>{item.status}</span>,
              <div style={{ color: "#212121" }}>
                <span>{hours}小时</span>
                <span>{minutes}分钟</span>
                <span>{seconds}秒</span>
              </div>,
              renderCancelBtn(item),
            ]}
            hoverable
          >
            <Meta
              avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
              title={renderCardTitle(item)}
              description={
                <div>
                  <span>{item.room.location}</span>/<span>{item.room.equipment}</span>
                </div>
              }
            />
          </Card>
        </Col>
      );
    });
  };
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo") as any);
  return (
    <div>
      {myBookingList.length === 0 && <Empty description="还没有预定的会议室哦" style={{ marginTop: "20%" }}></Empty>}
      <Row gutter={16}>{renderBookingList()}</Row>
      {/* <Room name={userInfo.nickName} /> */}
    </div>
  );
};

export default Index;
