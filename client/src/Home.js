import React, { useState, useEffect } from "react";
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
} from "antd";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';
import useLocalState from './localStorage.js';
import { useMediaQuery } from "react-responsive";

import Tour from "./Tour/getTour.js";
import SearchBar from "./Navbar/SearchBar";



const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;

const HomeForm = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [jwt, setjwt] = useLocalState(null, 'jwt');
  const [filterData, setFilterData] = useState([]);
  const [allData, setAllData] = useState([]);
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });

  const handleSearch = async (searchText) => {
    try {
      const res = await axios.get(`http://localhost:1337/api/tours?filters[tour_name][$containsi]=${searchText}`);
      setFilterData(res.data.data);
    }
    catch (error) {
      console.error('error filter data', error);
    }
  }

  const getData = async () => {
    try {
      const res = await axios.get("http://localhost:1337/api/tours?populate=*");
      setAllData(res.data.data);
    } catch (error) {
      console.error("error fetching tour data", error);
    }
  };

  const roleChecker = async () => {
    try {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${jwt}`,
      };
      const userResult = await axios.get('http://localhost:1337/api/users/me?populate=role');

      if (userResult.data.role && userResult.data.role.name === 'Member') {
        navigate('/member');
      } else {
        if (userResult.data.role && userResult.data.role.name === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    if (jwt == null) { } else roleChecker();
    getData()
  }, []);

  const headerStyle = {
    textAlign: "center",
    color: "#fff",
    height: 120,
    paddingInline: "center",
    lineHeight: "120x",
    backgroundColor: "#1C3953",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "45px",

  };

  const layoutStyle = {
    borderRadius: 0,
    overflow: "hidden",
    backgroundColor: "#EEEEEE",
    width: "100%",
    minHeight: "100vh",
  };

  const blueTextStyle = {
    color: "#48D3FF",
    fontWeight: "bold",
    fontSize: isSmallScreen ? "24px" : "45px",
  };

  const NormalTextStyle = {
    color: '#FFFFFF',
    fontWeight: 'bold',
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
        <Header style={headerStyle} className="headerStyle">
          <Col>
            <span style={blueTextStyle} className="blueTextStyle">H</span>
            <span style={NormalTextStyle} className="NormalTextStyle">AT</span>
            <span style={invtext}>.</span>
            <span style={blueTextStyle} className="blueTextStyle">Y</span>
            <span style={NormalTextStyle} className="NormalTextStyle">AI</span>
            <span style={invtext}>.</span>
            <span style={blueTextStyle} className="blueTextStyle">J</span>
            <span style={NormalTextStyle} className="NormalTextStyle">ourney</span>
          </Col>
          <Col span={22}>
            {isSmallScreen ? null : <SearchBar onSearch={handleSearch} />}
            <Link
              to="/login"
              style={{ marginLeft: isSmallScreen ? "-100px" : "40px", color: "white", fontSize: isSmallScreen ? "15px" : "18px" }}
            >
              เข้าสู่ระบบ
            </Link>
            {isSmallScreen ? null : <Link
              to="/register"
              style={{ marginLeft: "40px", color: "white", fontSize: isSmallScreen ? "15px" : "18px" }}
            >
              ลงทะเบียน
            </Link>}
          </Col>
        </Header>
        <Tour data={allData} filterData={filterData} />
      </Layout>
    </Flex>
  );
};

export default HomeForm;
