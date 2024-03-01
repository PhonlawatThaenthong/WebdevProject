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
    List,
    Card, Menu, Dropdown, Popover
} from "antd";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';
import useLocalState from './localStorage.js';
import CardHistory from "./Tour/getHistory.js";
import { useMediaQuery } from "react-responsive";
import { MenuOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import WebFont from 'webfontloader';



import SearchBar from "./Navbar/SearchBar";

const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;

const ReserveForm = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [jwt, setjwt] = useLocalState(null, 'jwt');
    const [username, setUsername] = useState('')
    const isSmallScreen = useMediaQuery({ maxWidth: 768 });
    const [menuVisible, setMenuVisible] = useState(false);

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
            navigate("/history");
          } else {
            if (userResult.data.role && userResult.data.role.name === "Admin") {
              navigate("/confirm");
            } else {
              navigate("/");
            }
          }
        } catch (error) {
          console.error(error);
        }
      };

    const handleLogout = async () => {
        setjwt(null)
        messageApi.open({
            type: 'loading',
            content: 'Please wait...',
            duration: 1,
        })
            .then(() => message.success('Completed!', 0.5))
            .then(() => window.location.href = '/')
    };

    useEffect(() => {
        if (jwt == null) {
            navigate("/");
        } else roleChecker();
    }, []);

    useEffect(() => {
    WebFont.load({
      google: {
        families: ['Sriracha', 'Kanit']
      }
    });
   }, []);

    const menu = (
        <Menu >
            {jwt ? (
                <>
                    <Menu.Item onClick={() => { navigate("/history"); }} key="username">
                        <span style={{ fontFamily:'Kanit',color: '#48D3FF' }}>{username && `Hello, ${username}`}</span>
                    </Menu.Item>
                    <Menu.Item key="logout" onClick={() => handleLogout()}>
                        ออกจากระบบ
                    </Menu.Item>
                    <Menu.Item key="back" onClick={() => { navigate("/member"); }}>
                        กลับ
                    </Menu.Item>
                </>
            ) : (
                <>

                </>
            )}
        </Menu>
    );

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

    return (
        <Flex gap="middle" wrap="wrap" >
            <Helmet>
                <title>HYJ - History Page</title>
            </Helmet>
            {contextHolder}
            <Layout style={layoutStyle}>
                <Header style={headerStyle}>
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
                            <div style={{ textAlign: isSmallScreen ? 'right' : 'left' }}>
                                <Dropdown overlay={menu} trigger={['click']} visible={menuVisible} onVisibleChange={setMenuVisible}>
                                    <UserOutlined style={{ fontSize: '25px', marginRight: '8px' }} />
                                </Dropdown>

                            </div>
                        ) : (
                            <>
                                <Link
                                    onClick={() => {
                                        navigate("/");
                                    }}
                                    style={{ fontFamily:'Kanit',marginLeft: "500px", color: "white", fontSize: isSmallScreen ? "14px" : "18px", width: "300px" }}
                                >
                                    สวัสดีคุณ {username}
                                </Link>

                                <Link
                                    onClick={() => { handleLogout() }}
                                    style={{ fontFamily:'Kanit',marginLeft: "50px", color: "white", fontSize: "18px" }}
                                >
                                    ออกจากระบบ
                                </Link>
                            </>
                        )}
                    </Col>



                </Header>
                <span style={{fontFamily:'Kanit',textAlign:'center',fontSize:"50px"}}>Reserve</span>
                <CardHistory />
            </Layout>

        </Flex>

    );
};


export default ReserveForm;
