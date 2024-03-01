import { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  Image,
  message,
  Modal,
  Row,
  Col,
  Layout,
  Flex,
  Space,
  Menu,
  Dropdown,
  Popover,
} from "antd";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import useLocalState from "../localStorage.js";
import SearchBar from "../Navbar/SearchBar";
import { MenuOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import Logo from "../Image/logo.png";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

import Tour from "../Tour/getTour";

const AllTour = () => {
  const [allData, setAllData] = useState([]);
  const { Header, Footer, Sider, Content } = Layout;
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const [jwt, setjwt] = useLocalState(null, "jwt");
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchPopoverVisible, setSearchPopoverVisible] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const getAllData = async () => {
    try {
      const res = await axios.get("http://localhost:1337/api/tours?populate=*");
      setAllData(res.data.data);
    } catch (error) {
      console.error("error fetching all data", error);
    }
  };
  useEffect(() => {
    getAllData();
  }, []);

  const handleHeaderClick = () => {
    navigate("/login");
  };

  const handleSearch = async (searchText) => {
    try {
      const res = await axios.get(
        `http://localhost:1337/api/tours?filters[tour_name][$containsi]=${searchText}`
      );
      setFilterData(res.data.data);
    } catch (error) {
      console.error("error filter data", error);
    }
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

  const searchPopoverContent = (
    <div>
      <SearchBar onSearch={handleSearch} />
    </div>
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

  const headerbottom = {
    textAlign: "center",
    color: "#fff",
    height: 60,
    paddingInline: "center",
    lineHeight: "120x",
    backgroundColor: "#1C3953",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "45px",
    width: "100%",
  };

  const layoutStyle = {
    borderRadius: 0,
    overflow: "hidden",
    backgroundColor: "#EEEEEE",
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

  return (
    <Flex gap="middle" wrap="wrap">
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>HYJ - Home Page</title>
      </Helmet>
      {contextHolder}
      <Layout style={layoutStyle}>
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
                <SearchBar onSearch={handleSearch} />
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
        <h2 style={{ textAlign: "center", fontWeight: "bold", fontSize: isSmallScreen ? "25px" : "45px" }}>All Tour</h2>

        <Tour data={allData} filterData={[]} />
      </Layout>
      <Button
        type="primary"
        onClick={() => navigate("/")}
        style={{
          backgroundColor: "#1C3953",
          borderColor: "#1C3953",
          margin: "0 auto"
        }}
      >
        Back
      </Button>
      <Header style={headerbottom}>
        <img src={Logo} alt="Logo" style={{ width: "auto", height: "50px" }} />
      </Header>
    </Flex>

  );
};

export default AllTour;
