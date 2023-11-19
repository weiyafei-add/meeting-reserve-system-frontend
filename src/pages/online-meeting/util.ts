const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  return (
    (hours < 10 ? "0" + hours : hours) +
    ":" +
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    " " +
    (date.getHours() >= 12 ? "下午" : "上午")
  );
};

export { formatDate };
