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
  Menu, Dropdown, Popover
} from "antd";
import { MenuOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';
import useLocalState from './localStorage.js';
import { useMediaQuery } from "react-responsive";

import Tour from "./Tour/getTour.js";
import SearchBar from "./Navbar/SearchBar";
import PromotionalSlider from './PromotionalSlider';
import picture from './Image/Hat_Yai_Journey.png';
import picture2 from './Image/test.jpg';



const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;

const HomeForm = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [jwt, setjwt] = useLocalState(null, 'jwt');
  const [filterData, setFilterData] = useState([]);
  const [allData, setAllData] = useState([]);
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchPopoverVisible, setSearchPopoverVisible] = useState(false);

  const promotionImages = [
    picture,
    picture2,
    'https://www.travelandleisure.com/thmb/iKSVprPgcIoY8G-xSpXdMuAS3Ns=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-great-barrier-reef-islands-australia-WBFAQ1023-4754187baade440197c4b03c6cb3366f.jpg',
  ];

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

  const menu = (
    <Menu>
      {jwt ? (
        <>
          <Menu.Item key="username" disabled>
            <span style={{ color: '#48D3FF' }}>{username && `สวัสดีคุณ, ${username}`}</span>
          </Menu.Item>
          <Menu.Item key="logout" onClick={() => handleLogout()}>
            ออกจากระบบ
          </Menu.Item>
        </>
      ) : (
        <>

        </>
      )}
    </Menu>
  );

  const searchPopoverContent = (
    <div>
      <SearchBar onSearch={handleSearch} />
    </div>
  );
  const handleHeaderClick = () => {
    navigate('/login');
  };


  const headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 120,
    paddingInline: "center",
    lineHeight: '120x',
    backgroundColor: '#1C3953',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '45px',
    width: isSmallScreen ? '100%' : 'auto',
  };

  const layoutStyle = {
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: '#EEEEEE',
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

  const promotionalSliderStyle = {
    marginTop: isSmallScreen ? '150px' : '50px',
  };

  return (
    <Flex gap="middle" wrap="wrap">
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>HYJ - Home Page</title>
      </Helmet>
      {contextHolder}
      <Layout style={layoutStyle}>
        <Header style={{ ...headerStyle, justifyContent: isSmallScreen ? 'center' : 'flex-start' }} className="headerStyle" >
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

          <Col span={isSmallScreen ? 12 : 22}>
            {isSmallScreen ? (
              <div style={{ textAlign: isSmallScreen ? 'right' : 'left' }}>
                <Dropdown overlay={menu} trigger={['click']} visible={menuVisible} onVisibleChange={setMenuVisible}>
                  <UserOutlined onClick={isSmallScreen ? handleHeaderClick : undefined} style={{ fontSize: '25px', marginRight: '8px' }} />
                </Dropdown>
                <Popover
                  content={searchPopoverContent}
                  trigger="click"
                  visible={searchPopoverVisible}
                  onVisibleChange={setSearchPopoverVisible}
                >
                  <SearchOutlined style={{ fontSize: '25px', marginLeft: '8px' }} />
                </Popover>
              </div>
            ) : (
              <>
                <SearchBar onSearch={handleSearch} />
                <Link to="/login" style={{ marginLeft: "40px", color: "white", fontSize: isSmallScreen ? "15px" : "18px" }}>
                  เข้าสู่ระบบ
                </Link>
                <Link to="/register" style={{ marginLeft: "40px", color: "white", fontSize: isSmallScreen ? "15px" : "18px" }}>
                  ลงทะเบียน
                </Link>
              </>
            )}
          </Col>
        </Header>
        <PromotionalSlider images={promotionImages}/>
        <h2 style={{textAlign: 'center',fontWeight: 'bold',fontSize: '45px',}}>
          Tour
          </h2>
        <Tour data={allData} filterData={filterData} />
      </Layout>
    </Flex>

  );
};

export default HomeForm;
