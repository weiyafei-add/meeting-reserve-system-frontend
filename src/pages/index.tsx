import "./index.css";

export default function HomePage() {
  const renderGreet = () => {
    return (
      <div className="hero">
        <h1 className="text-reveal">
          <span>企业会议综合管理系统</span>
          <span>企业会议综合管理系统</span>
        </h1>
      </div>
    );
  };

  return (
    <div>
      {renderGreet()}
      <div className="index-image"></div>
    </div>
  );
}
