import { useEffect, useState } from "react";
import { getMyBookingList, cancelBookingRoom } from "../api";
import { Avatar, Card, Col, Row, MenuProps, Modal, message } from "antd";
import dayjs from "dayjs";

const { Meta } = Card;

const Index = () => {
  const [myBookingList, setMyBookingList] = useState([]);

  useEffect(() => {
    getMyBookingList().then((res) => {
      const { userBooking } = res.data;
      setMyBookingList(userBooking);
    });
  }, []);

  const renderBookingList = () => {
    return myBookingList.map((item: any) => {
      const duration = dayjs(item.endTime).diff(dayjs(item.startTime));
      const hours = Math.floor(duration / 3600000);
      const minutes = Math.floor((duration % 3600000) / 60000);
      const seconds = Math.floor((duration % 60000) / 1000);
      return (
        <Col span={8} key={item.id}>
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
              </span>,
            ]}
            hoverable
          >
            <Meta
              avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
              title={
                <div style={{ display: "flex", gap: "20px" }}>
                  <div>{item.room.name}</div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span>开始时间：{dayjs(item.startTime).format("YYYY-MM-DD HH:mm:ss")}</span>
                    <span>结束时间：{dayjs(item.endTime).format("YYYY-MM-DD HH:mm:ss")}</span>
                  </div>
                </div>
              }
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

  return (
    <div>
      <Row gutter={16}>{renderBookingList()}</Row>
    </div>
  );
};

export default Index;
