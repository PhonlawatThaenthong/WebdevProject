import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Table } from "antd";
import useLocalState from "../localStorage.js";
import { MenuOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import WebFont from "webfontloader";
import {
  Button,
  Col,
  Layout,
  Menu,
  Dropdown,
  Popover,
  Avatar,
} from "antd";

const TourSchedule = () => {
  const { Header, Footer, Sider, Content } = Layout;
  const { tourId } = useParams();
  const [tourSchedule, setTourSchedule] = useState(null);
  const [jwt, setjwt] = useLocalState(null, "jwt");
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const [username, setUsername] = useState("");
  const [userimage, setUserImage] = useState({});
  const navigate = useNavigate();

  const getImage = async () => {
    try {
      const res = await axios.get(
        "http://localhost:1337/api/users/me?populate=*"
      );
      setUserImage(res.data);
    } catch (error) {
      console.error("การแสดงข้อมูล user ผิดพลาด", error);
    }
  };

  const roleChecker = async () => {
    try {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${jwt}`,
      };
      const userResult = await axios.get(
        "http://localhost:1337/api/users/me?populate=role"
      );

      setUsername(userResult.data.username);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Kanit"],
      },
    });
    getImage();
    roleChecker();
    const getTourSchedule = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1337/api/tours/${tourId}?populate=*`
        );
        setTourSchedule(response.data.data);
      } catch (error) {
        console.error("Error fetching tour data:", error);
      }
    };

    if (tourId) {
      getTourSchedule();
    }
  }, [tourId]);

  if (!tourSchedule) {
    return <div>Loading...</div>;
  }

  const columns = [
    {
      title: "สถานที่",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "เวลา",
      dataIndex: "time",
      key: "time",
    },
  ];

  const dataSource = tourSchedule.attributes.destination.map(
    (destination, index) => ({
      key: index,
      name: destination.name,
      time: destination.time,
    })
  );

  const headerStyle = {
    textAlign: "center",
    color: "#fff",
    height: 120,
    paddingInline: "center",
    lineHeight: "120x",
    backgroundColor: "#1C3953",
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "45px",
    width: isSmallScreen ? "100%" : "auto",
  };

  const blueTextStyle = {
    color: "#48D3FF",
    fontWeight: "bold",
    fontSize: isSmallScreen ? "24px" : "45px",
  };

  const NormalTextStyle = {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: isSmallScreen ? "24px" : "45px",
  };

  const invtext = {
    color: "#1C3953",
    fontWeight: "bold",
    fontSize: isSmallScreen ? "24px" : "45px",
  };

  const menu = (
    <Menu>
      {jwt ? (
        <>
          <Menu.Item key="username" disabled>
            <span style={{ color: "#48D3FF" }}>
              {username && `สวัสดีคุณ, ${username}`}
            </span>
          </Menu.Item>
          <Menu.Item key="logout" onClick={() => handleLogout()}>
            ออกจากระบบ
          </Menu.Item>
        </>
      ) : (
        <></>
      )}
    </Menu>
  );
  const menu2 = (
    <Menu>
      {jwt ? (
        <>
          <Menu.Item
            onClick={() => {
              navigate("/profile");
            }}
            key="username"
          ></Menu.Item>
          <Menu.Item key="profile" onClick={() => navigate("/profile")}>
            {username && `โปรไฟล์ของ, ${username}`}
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              navigate("/history");
            }}
            key="History"
          >
            ทัวร์ของคุณ
          </Menu.Item>
          <Menu.Item key="logout" onClick={() => handleLogout()}>
            ออกจากระบบ
          </Menu.Item>
        </>
      ) : (
        <></>
      )}
    </Menu>
  );

  return (
    <div gap="middle" wrap="wrap" style={{ backgroundColor: "#F5F5F5" }}>
      {jwt === null ? (
        <Header
          style={{
            ...headerStyle,
            justifyContent: isSmallScreen ? "center" : "flex-start",
          }}
          className="headerStyle"
        >
          <Col>
            <span style={blueTextStyle} className="blueTextStyle">
              H
            </span>
            <span style={NormalTextStyle} className="NormalTextStyle">
              AT
            </span>
            <span style={invtext}>.</span>
            <span style={blueTextStyle} className="blueTextStyle">
              Y
            </span>
            <span style={NormalTextStyle} className="NormalTextStyle">
              AI
            </span>
            <span style={invtext}>.</span>
            <span style={blueTextStyle} className="blueTextStyle">
              J
            </span>
            <span style={NormalTextStyle} className="NormalTextStyle">
              ourney
            </span>
          </Col>

          <Col span={isSmallScreen ? 12 : 22}>
            {isSmallScreen ? (
              <div style={{ textAlign: isSmallScreen ? "right" : "left" }}>
                <Dropdown
                  overlay={menu}
                  trigger={["click"]}
                  visible={menuVisible}
                  onVisibleChange={setMenuVisible}
                >
                  <UserOutlined
                    onClick={isSmallScreen ? handleHeaderClick : undefined}
                    style={{ fontSize: "25px", marginRight: "8px" }}
                  />
                </Dropdown>
                <Popover
                  content={searchPopoverContent}
                  trigger="click"
                  visible={searchPopoverVisible}
                  onVisibleChange={setSearchPopoverVisible}
                >
                  <SearchOutlined
                    style={{ fontSize: "25px", marginLeft: "8px" }}
                  />
                </Popover>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    marginLeft: "40px",
                    color: "white",
                    fontSize: isSmallScreen ? "15px" : "18px",
                  }}
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  to="/register"
                  style={{
                    marginLeft: "40px",
                    color: "white",
                    fontSize: isSmallScreen ? "15px" : "18px",
                  }}
                >
                  ลงทะเบียน
                </Link>
              </>
            )}
          </Col>
        </Header>
      ) : (
        <Header
          style={{
            ...headerStyle,
            justifyContent: isSmallScreen ? "center" : "flex-start",
          }}
        >
          <Col>
            <span style={blueTextStyle}>H</span>
            <span style={NormalTextStyle}>AT</span>
            <span style={invtext}>.</span>
            <span style={blueTextStyle}>Y</span>
            <span style={NormalTextStyle}>AI</span>
            <span style={invtext}>.</span>
            <span style={blueTextStyle}>J</span>
            <span style={NormalTextStyle}>ourney</span>
          </Col>
          <Col span={isSmallScreen ? 12 : 22}>
            {isSmallScreen ? (
              <div style={{ textAlign: isSmallScreen ? "right" : "left" }}>
                <Dropdown
                  overlay={menu}
                  trigger={["click"]}
                  visible={menuVisible}
                  onVisibleChange={setMenuVisible}
                >
                  <UserOutlined
                    style={{ fontSize: "25px", marginRight: "8px" }}
                  />
                </Dropdown>
                <Popover
                  content={searchPopoverContent}
                  trigger="click"
                  visible={searchPopoverVisible}
                  onVisibleChange={setSearchPopoverVisible}
                >
                  <SearchOutlined
                    style={{ fontSize: "25px", marginLeft: "8px" }}
                  />
                </Popover>
              </div>
            ) : (
              <>
                <Link
                  onClick={() => {
                    navigate("/profile");
                  }}
                  style={{
                    marginRight: "50px",
                    color: "white",
                    fontSize: isSmallScreen ? "14px" : "18px",
                    width: "300px",
                    fontFamily: "Kanit",
                  }}
                >
                  สวัสดีคุณ {username}
                </Link>
                <Dropdown
                  placement="bottomLeft"
                  overlay={menu2}
                  trigger={["click"]}
                >
                  <Avatar
                    style={{
                      marginLeft: "50px",
                      color: "white",
                      fontSize: "50px",
                      fontFamily: "Kanit",
                      marginBottom: "10px",
                      marginRight: "-70px",
                    }}
                    size={52}
                    src={`http://localhost:1337${userimage.profile_image?.url}`}
                  />
                </Dropdown>
              </>
            )}
          </Col>
        </Header>
      )}
      <h3>ตารางท่องเที่ยว: {tourSchedule.attributes.tour_name}</h3>
      <Table columns={columns} dataSource={dataSource} />
      <Button
        type="primary"
        onClick={() => navigate("/")}
        style={{
          backgroundColor: "#1C3953",
          borderColor: "#1C3953",
          margin: "0 auto",
        }}
      >
        Back
      </Button>
    </div>
  );
};

export default TourSchedule;
