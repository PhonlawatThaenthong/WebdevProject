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
  Menu,
  Dropdown,
  Popover,
} from "antd";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import useLocalState from "./localStorage.js";
import { useMediaQuery } from "react-responsive";
import { UploadOutlined } from "@ant-design/icons";
import { MenuOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import WebFont from 'webfontloader';

import Tour from "./Tour/getTour.js";
import SearchBar from "./Navbar/SearchBar";
import PromotionalSlider from "./PromotionalSlider";
import picture from "./Image/Hat_Yai_Journey.png";
import picture2 from "./Image/test.jpg";
import Logo from "./Image/logo.png";

const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const AdminForm = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [jwt, setjwt] = useLocalState(null, "jwt");
  const [username, setUsername] = useState("");
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const [create_name, setcreate_name] = useState("");
  const [create_desc, setcreate_desc] = useState("");
  const [create_price, setcreate_price] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchPopoverVisible, setSearchPopoverVisible] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [filterData, setFilterData] = useState([]);
  const [allData, setAllData] = useState([]);

  const promotionImages = [
    picture,
    picture2,
    "https://www.travelandleisure.com/thmb/iKSVprPgcIoY8G-xSpXdMuAS3Ns=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-great-barrier-reef-islands-australia-WBFAQ1023-4754187baade440197c4b03c6cb3366f.jpg",
  ];

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

  const handleImageUpload = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleLogout = async () => {
    setjwt(null);
    messageApi
      .open({
        type: "loading",
        content: "กรุณารอสักครู่...",
        duration: 1,
      })
      .then(() => message.success("เสร็จสิ้น!", 0.5))
      .then(() => (window.location.href = "/"));
  };

  const handleAddTour = async (e) => {
    try {
      const imageFiles = Array.isArray(imageFile) ? imageFile : [imageFile];
      const uploadedImages = await Promise.all(imageFiles.map(uploadImage));
      const addNewTour = {
        tour_name: create_name,
        description: create_desc,
        price: create_price,
        status: true,
        tour_image: uploadedImages.map(image => ({ id: image.id })) 
      };
      
      const formData = new FormData();
      formData.append('data', JSON.stringify(addNewTour));

      const response = await axios.post('http://localhost:1337/api/tours', formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      });

      console.log('Upload response:', response.data);
      message.success('Tour added successfully');
      setIsAddMenuOpen(false);
      window.location.reload();
  } catch (error) {
      console.error('Error uploading data:', error);
      message.error('Failed to add tour');
  }
};

const uploadImage = async (image) => {
  try {
      const formData = new FormData();
      formData.append('files', image);
      const response = await axios.post('http://localhost:1337/api/upload', formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      });

      return response.data[0];
  } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
  }
};

  useEffect(() => {
    if (jwt == null) {
      navigate("/");
    } else roleChecker();
    getData();
  }, []);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Sriracha', 'Chilanka']
      }
    });
   }, []);

  const menu = (
    <Menu>
      {jwt ? (
        <>
          <Menu.Item
            onClick={() => {
              navigate("/history");
            }}
            key="username"
          >
            <span style={{ fontFamily:'Kanit',color: "#48D3FF" }}>
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

  const promotionalSliderStyle = {
    marginTop: isSmallScreen ? "150px" : "50px",
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
        style={{fontFamily:'Kanit'}}
        onCancel={() => {
          setIsAddMenuOpen(false);
        }}
        footer={[
          <Button
            key="back"
            style={{fontFamily:'Kanit'}}
            onClick={() => {
              setIsAddMenuOpen(false);
            }}
          >
            ยกเลิก
          </Button>,
          <Button style={{fontFamily:'Kanit'}}key="submit" type="primary" onClick={handleAddTour} >
            เพิ่ม
          </Button>,
        ]}
      >
        <p>ชื่อทัวร์: </p>
        <Input
          value={create_name}
          onChange={(e) => setcreate_name(e.target.value)}
        />
        <p>รายละเอียด: </p>
        <TextArea
          value={create_desc}
          onChange={(e) => setcreate_desc(e.target.value)}
          autoSize={{ minRows: 1, maxRows: 10 }}
        />
        <p>ราคา: </p>
        <Input
          type="number"
          value={create_price}
          onChange={(e) => setcreate_price(e.target.value)}
        />
        <p>วันที่: </p>
        <RangePicker />
        <p>รูปภาพ: </p>
        <Upload
          name="image"
          listType="picture-card"
          showUploadList={false}
          action="http://localhost:1337/api/upload"
          beforeUpload={(file) => {
            setImageFile(file);
            return false;
          }}
          onChange={handleImageUpload}
        >
          {imageFile ? (
            <img src={URL.createObjectURL(imageFile)} alt="Tour" style={{ width: "100%" }} />
          ) : (
            <div>
              <UploadOutlined />
              <div style={{ fontFamily:'Kanit',marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </Modal>

      <Layout style={layoutStyle}>
        <Header
          style={{
            ...headerStyle,
            justifyContent: isSmallScreen ? "center" : "flex-start",
          }}
          className="headerStyle"
        >
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
                    navigate("/history");
                  }}
                  style={{
                    marginRight: "50px",
                    color: "white",
                    fontSize: isSmallScreen ? "14px" : "18px",
                    width: "300px",
                    fontFamily:'Kanit'
                  }}
                >
                  สวัสดีคุณ {username}
                </Link>
                {isSmallScreen ? null : <SearchBar onSearch={handleSearch} />}
                <Link
                  onClick={() => {
                    handleLogout();
                  }}
                  style={{
                    marginLeft: "50px",
                    color: "white",
                    fontSize: "18px",
                    fontFamily:'Kanit'
                  }}
                >
                  ออกจากระบบ
                </Link>
              </>
            )}
          </Col>
        </Header>
        {isSmallScreen ? (
          <></>
        ) : (
          <PromotionalSlider images={promotionImages} style={promotionalSliderStyle} />
        )}
        <h2
          style={{ fontFamily:'Kanit',textAlign: "center", fontWeight: "bold", fontSize:isSmallScreen ? "25px":"45px"}}
        >
          โปรแกรมทัวร์แนะนำ
        </h2>
        <Tour data={allData} filterData={filterData} />
        <FloatButton
          tooltip={<div>เพิ่มทัวร์ใหม่</div>}
          shape="square"
          type="primary"
          style={{ fontFamily:'Kanit',right: 24 }}
          icon="+"
          onClick={() => setIsAddMenuOpen(true)}
        />
      </Layout>

      <Header style={headerbottom}>
        <img src={Logo} alt="Logo" style={{ width: "auto", height: "50px" }} />
      </Header>
    </Flex>
  );
};

export default AdminForm;
