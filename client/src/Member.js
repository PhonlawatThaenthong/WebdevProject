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
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';
import useLocalState from './localStorage.js';
import { useMediaQuery } from "react-responsive";
import { MenuOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';

import Tour from "./Tour/getTour.js";
import SearchBar from "./Navbar/SearchBar";

const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;

const MemberForm = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [jwt, setjwt] = useLocalState(null, 'jwt');
    const [username, setUsername] = useState('')
    const [filterData, setFilterData] = useState([]);
    const [allData, setAllData] = useState([]);
    const isSmallScreen = useMediaQuery({ maxWidth: 768 });
    const [menuVisible, setMenuVisible] = useState(false);
    const [searchPopoverVisible, setSearchPopoverVisible] = useState(false);

    const handleSearch = async (searchText) => {
        try {
            const res = await axios.get(`http://localhost:1337/api/tours?filters[tour_name][$containsi]=${searchText}`);
            setFilterData(res.data.data);
        }
        catch (error) {
            console.error('การค้นหาผิดพลาด', error);
        }
    }

    const getData = async () => {
        try {
            const res = await axios.get("http://localhost:1337/api/tours?populate=*");
            setAllData(res.data.data);
        } catch (error) {
            console.error("การแสดงข้อมูลทัวร์ผิดพลาด", error);
        }
    };

    const roleChecker = async () => {
        try {
            axios.defaults.headers.common = {
                Authorization: `Bearer ${jwt}`,
            };
            const userResult = await axios.get('http://localhost:1337/api/users/me?populate=role');

            setUsername(userResult.data.username)

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

    const menu = (
        <Menu >
            {jwt ? (
                <>
                    <Menu.Item onClick={() => { navigate("/history"); }} key="username">
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

    const handleLogout = async () => {
        setjwt(null)
        messageApi.open({
            type: 'loading',
            content: 'กรุณารอสักครู่...',
            duration: 1,
        })
            .then(() => message.success('เสร็จสิ้น!', 0.5))
            .then(() => window.location.href = '/')
    };

    useEffect(() => {
        if (jwt == null) { navigate("/") } else roleChecker();
        getData()
    }, []);

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

    return (
        <Flex gap="middle" wrap="wrap" >
            <Helmet>
                <title>HYJ - Home Page</title>
            </Helmet>
            {contextHolder}
            <Layout style={layoutStyle}>
                <Header style={{ ...headerStyle, justifyContent: isSmallScreen ? 'center' : 'flex-start' }}>
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
                                <Link onClick={() => {
                                    navigate("/history");
                                }}
                                    style={{ marginRight: "50px", color: "white", fontSize: isSmallScreen ? "14px" : "18px", width: "300px" }}
                                >
                                    สวัสดีคุณ {username}
                                </Link>
                                {isSmallScreen ? null : <SearchBar onSearch={handleSearch} />}
                                <Link
                                    onClick={() => { handleLogout() }}
                                    style={{ marginLeft: "50px", color: "white", fontSize: "18px" }}
                                >
                                    ออกจากระบบ
                                </Link>
                            </>
                        )}
                    </Col>

                </Header>
                <Tour data={allData} filterData={filterData} />
            </Layout>
        </Flex>
    );
};


export default MemberForm;
