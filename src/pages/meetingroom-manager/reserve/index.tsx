import React, { useEffect, useState } from "react";
import { Badge, Calendar } from "antd";
import styles from "./index.module.less";
import { getBookingHistory } from "../api";
import dayjs from "dayjs";
import { TeamOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import type { BadgeProps, CalendarProps } from "antd";

const App: React.FC = () => {
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    getBookingHistory().then((res) => {
      setHistoryList(res.data.history || []);
    });
  }, []);

  const dateCellRender = (value: Dayjs) => {
    const listData = historyList.filter((item: any) => {
      return dayjs(item.createTime).date() === value.date();
    });

    return (
      <div className="events">
        {listData.map((item: any, index) => (
          <div key={index}>
            <span>
              <TeamOutlined />
            </span>
            <span>{item.room.name}</span>
            <span>{dayjs(item.room.createTime).format("YYYY-MM-DD")}</span>
          </div>
        ))}
      </div>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  return (
    <div className={styles.myMeeting}>
      <div>
        <Calendar cellRender={cellRender} />
      </div>
    </div>
  );
};

export default App;
