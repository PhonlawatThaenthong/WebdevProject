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
  FloatButton,
  InputNumber,
  DatePicker,
  Upload,
} from "antd";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import useLocalState from "./localStorage.js";

import { UploadOutlined } from "@ant-design/icons";

import Tour from "./Tour/getTour.js";
import SearchBar from "./Navbar/SearchBar";

const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const MemberForm = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [jwt, setjwt] = useLocalState(null, "jwt");
  const [username, setUsername] = useState("");

  const [create_name, setcreate_name] = useState("");
  const [create_desc, setcreate_desc] = useState("");
  const [create_price, setcreate_price] = useState(0);

  const [filterData, setFilterData] = useState([]);
  const [allData, setAllData] = useState([]);

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
      const userResult = await axios.get(
        "http://localhost:1337/api/users/me?populate=role"
      );

      setUsername(userResult.data.username);

      if (userResult.data.role && userResult.data.role.name === "Member") {
        navigate("/member");
      } else {
        if (userResult.data.role && userResult.data.role.name === "Admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    setjwt(null);
    messageApi
      .open({
        type: "loading",
        content: "Please wait...",
        duration: 1,
      })
      .then(() => message.success("Completed!", 0.5))
      .then(() => (window.location.href = "/"));
  };

  const handleAddTour = async () => {
    try {
      const addNewTour = {
        data: {
          tour_name: create_name,
          description: create_desc,
          price: create_price,
        },
      };

      const res = await axios.post(
        "http://localhost:1337/api/tours",
        addNewTour,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      setIsAddMenuOpen(false);
      getData();
    } catch (error) {
      console.error("error adding tour", error.response.data.error);
    }
  };

  useEffect(() => {
    if (jwt == null) {
      navigate("/");
    } else roleChecker();
    getData();
  }, []);

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
  };

  const layoutStyle = {
    borderRadius: 0,
    overflow: "hidden",
    backgroundColor: "#EEEEEE",
  };

  const blueTextStyle = {
    color: "#48D3FF",
    fontWeight: "bold",
    fontSize: "45px",
  };

  const NormalTextStyle = {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: "45px",
  };

  const invtext = {
    color: "#1C3953",
    fontWeight: "bold",
    fontSize: "45px",
  };

  return (
    <Flex gap="middle" wrap="wrap">
      <Helmet>
        <title>HYJ - Home Page</title>
      </Helmet>
      {contextHolder}

      <Modal
        title="Add New Tour"
        open={isAddMenuOpen}
        onCancel={() => {
          setIsAddMenuOpen(false);
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setIsAddMenuOpen(false);
            }}
          >
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddTour}>
            Add
          </Button>,
        ]}
      >
        <p>Tour Name: </p>
        <Input
          value={create_name}
          onChange={(e) => setcreate_name(e.target.value)}
        />
        <p>Description: </p>
        <TextArea
          value={create_desc}
          onChange={(e) => setcreate_desc(e.target.value)}
          autoSize={{ minRows: 1, maxRows: 10 }}
        />
        <p>Price: </p>
        <Input
          type="number"
          value={create_price}
          onChange={(e) => setcreate_price(e.target.value)}
        />
        <p>Date: </p>
        <RangePicker />
        <p>Image: </p>
        <Button type="primary">Upload</Button>
      </Modal>

      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
          <Col>
            <span style={blueTextStyle}>H</span>
            <span style={NormalTextStyle}>AT</span>
            <span style={invtext}>.</span>
            <span style={blueTextStyle}>Y</span>
            <span style={NormalTextStyle}>AT</span>
            <span style={invtext}>.</span>
            <span style={blueTextStyle}>J</span>
            <span style={NormalTextStyle}>ourney</span>
          </Col>
          <Link
            style={{
              marginLeft: "150px",
              color: "white",
              fontSize: "18px",
              width: "300px",
            }}
          >
            Hello, {username}
          </Link>
          <SearchBar onSearch={handleSearch} />
          <Link
            onClick={() => {
              handleLogout();
            }}
            style={{ marginLeft: "50px", color: "white", fontSize: "18px" }}
          >
            Logout
          </Link>
        </Header>
        <Tour data={allData} filterData={filterData} />
        <FloatButton
          tooltip={<div>Add New Tour</div>}
          shape="square"
          type="primary"
          style={{ right: 24 }}
          icon="+"
          onClick={() => setIsAddMenuOpen(true)}
        />
      </Layout>
    </Flex>
  );
};

export default MemberForm;
