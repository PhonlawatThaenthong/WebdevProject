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
    Menu,
    Dropdown,
    Popover, Avatar, Descriptions
} from "antd";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import useLocalState from "./localStorage.js";
import { useMediaQuery } from "react-responsive";
import { MenuOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import WebFont from 'webfontloader';

import Boy from "./Image/boy.png"
import Girl from "./Image/girl.png"
import Logo from "./Image/logo.png";
import useFormItemStatus from "antd/es/form/hooks/useFormItemStatus.js";


const { Header, Footer, Sider, Content } = Layout;

const ProfileForm = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [jwt, setjwt] = useLocalState(null, "jwt");
    const [username, setUsername] = useState("");
    const [rolename, setRolename] = useState("")
    const [filterData, setFilterData] = useState([]);
    const [userData, setUserData] = useState({});
    const isSmallScreen = useMediaQuery({ maxWidth: 768 });
    const [menuVisible, setMenuVisible] = useState(false);
    const [editingName, setEditingName] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);
    const [editingPhoneNumber, setEditingPhoneNumber] = useState(false);
    const [userimage, setUserImage] = useState({});

    const getData = async () => {
        try {
            const res = await axios.get("http://localhost:1337/api/users/me");
            setUserData(res.data);
        } catch (error) {
            console.error("การแสดงข้อมูล user ผิดพลาด", error);
        }
    };
    const getImage = async () => {
        try {
            const res = await axios.get("http://localhost:1337/api/users/me?populate=*");
            setUserImage(res.data);
        } catch (error) {
            console.error("การแสดงข้อมูล user ผิดพลาด", error);
        }
    };

    const handleEditName = () => {
        setEditingName(true);
    };

    const handleEditEmail = () => {
        setEditingEmail(true);
    };

    const handleEditPhoneNumber = () => {
        setEditingPhoneNumber(true);
    };

    const handleHeaderClick = () => {
        navigate('/Member');
    };

    const handleSaveChanges = async () => {
        const hide = message.loading("Saving changes...", 0);

        console.log(userData)

        try {
            await axios.put(`http://localhost:1337/api/users/${userData.id}`, userData, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            setEditingName(false);
            setEditingEmail(false);
            setEditingPhoneNumber(false);

            hide();
            message.success("Changes saved successfully!", 1);
        } catch (error) {
            console.error("Error updating user data:", error);

            hide();
            message.error("Failed to save changes. Please try again.", 1);
        }
    };



    const menu = (
        <Menu>
            {jwt ? (
                <>
                    <Menu.Item
                        onClick={() => {
                            navigate("/profile");
                        }}
                        key="username"
                    >
                        <span style={{ fontFamily: 'Kanit', color: "#48D3FF" }}>
                            {username && `สวัสดีคุณ, ${username}`}
                        </span>
                    </Menu.Item>
                    <Menu.Item key="logout" onClick={() => handleLogout()}>
                        ออกจากระบบ
                    </Menu.Item>
                    <Menu.Item
                        onClick={() => {
                            navigate("/history");
                        }}
                        key="History"
                    >ประวัติ</Menu.Item>
                    <Menu.Item
                        onClick={() => {
                            navigate("/");
                        }}
                        key="back"
                    >กลับ</Menu.Item>
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
                    >
                    </Menu.Item>
                    <Menu.Item key="profile" onClick={() => navigate("/profile")}>
                        {username && `โปรไฟล์ของ, ${username}`}
                    </Menu.Item>
                    <Menu.Item
                        onClick={() => {
                            navigate("/history");
                        }}
                        key="History"
                    >ทัวร์ของคุณ</Menu.Item>
                    <Menu.Item key="logout" onClick={() => handleLogout()}>
                        ออกจากระบบ
                    </Menu.Item>
                </>
            ) : (
                <></>
            )}
        </Menu>
    );
    const menu3 = (
        <Menu>
            {jwt ? (
                <>
                    <Menu.Item
                        onClick={() => {
                            navigate("/profile");
                        }}
                        key="username"
                    >

                    </Menu.Item>
                    <Menu.Item key="profile" onClick={() => navigate("/profile")}>
                        {username && `โปรไฟล์ของ, ${username}`}
                    </Menu.Item>
                    <Menu.Item
                        onClick={() => {
                            navigate("/confirm");
                        }}
                        key="History"
                    >สถานะการจองของลูกค้า</Menu.Item>
                    <Menu.Item key="logout" onClick={() => handleLogout()}>
                        ออกจากระบบ
                    </Menu.Item>
                </>
            ) : (
                <></>
            )}
        </Menu>
    );

    const roleChecker = async () => {
        try {
            axios.defaults.headers.common = {
                Authorization: `Bearer ${jwt}`,
            };
            const userResult = await axios.get(
                "http://localhost:1337/api/users/me?populate=role"
            );

            setUsername(userResult.data.username);
            setRolename(userResult.data.role.name)
            if (userResult.data.role && userResult.data.role.name === "Member") {
                navigate("/profile");
            } else {
                if (userResult.data.role && userResult.data.role.name === "Admin") {
                    navigate("/profile");
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
                content: "กรุณารอสักครู่...",
                duration: 1,
            })
            .then(() => message.success("เสร็จสิ้น!", 0.5))
            .then(() => (window.location.href = "/"));
    };


    useEffect(() => {
        if (jwt == null) {
            navigate("/");
        } else roleChecker();
        getData();
        getImage();
    }, []);

    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Kanit', 'Chilanka']
            }
        });
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
        <Flex gap="middle" wrap="wrap" style={{ backgroundColor: "#F5F5F5" }}>
            <Helmet>
                <title>HYJ - Home Page</title>
            </Helmet>
            {contextHolder}
            <Layout style={layoutStyle}>
                <Header
                    style={{
                        ...headerStyle,
                        justifyContent: isSmallScreen ? "center" : "flex-start",
                    }}
                >
                    <Col span={isSmallScreen ? 12 : 22} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ ...headerStyle, justifyContent: isSmallScreen ? 'center' : 'flex-start' }}>
                            <span style={blueTextStyle}>H</span>
                            <span style={NormalTextStyle}>AT</span>
                            <span style={invtext}>.</span>
                            <span style={blueTextStyle}>Y</span>
                            <span style={NormalTextStyle}>AI</span>
                            <span style={invtext}>.</span>
                            <span style={blueTextStyle}>J</span>
                            <span style={NormalTextStyle}>ourney</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
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
                                </div>
                            ) : (
                                <>
                                    <Link
                                        onClick={() => {
                                            navigate("/member");
                                        }}
                                        style={{
                                            marginRight: "50px",
                                            color: "white",
                                            fontSize: isSmallScreen ? "14px" : "18px",
                                            width: "300px",
                                            fontFamily: 'Kanit'
                                        }}
                                    >
                                        สวัสดีคุณ {username}
                                    </Link>
                                    <Dropdown
                                        placement="bottomLeft"
                                        trigger={["click"]}
                                        overlay={rolename === "Member" ? menu2 : menu3}
                                    >
                                        <Avatar
                                            style={{
                                                color: "white",
                                                fontSize: "50px",
                                                fontFamily: 'Kanit',
                                                marginBottom: "10px",
                                                marginRight: "-70px"
                                            }}
                                            size={52}
                                            src={`http://localhost:1337${userimage.profile_image?.url}`}
                                        />
                                    </Dropdown>
                                </>
                            )}
                        </div>
                    </Col>

                </Header>
                <Layout>
                    <Content style={{ fontFamily: 'Kanit', padding: "24px", minHeight: 500 }}>
                        <div style={{ fontFamily: 'Kanit', textAlign: "center" }}>
                            <Avatar size={100} src={`http://localhost:1337${userimage.profile_image?.url}`} />
                            <h2>{userData.username}</h2>
                        </div>
                        <Descriptions title="User Information" bordered column={1}>
                            <Descriptions.Item label="Name">
                                {editingName ? (
                                    <Input
                                        value={userData.username}
                                        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                    />
                                ) : (
                                    userData.username
                                )}
                                <Button danger
                                    type="link"
                                    onClick={handleEditName}
                                    style={{ marginLeft: '8px', fontFamily: 'Kanit' }}
                                >
                                    {editingName ? '' : "Edit"}
                                </Button>
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {editingEmail ? (
                                    <Input
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                    />
                                ) : (
                                    userData.email
                                )}
                                <Button danger
                                    type="link"
                                    onClick={handleEditEmail}
                                    style={{ marginLeft: '8px', fontFamily: 'Kanit' }}
                                >
                                    {editingEmail ? '' : "Edit"}
                                </Button>
                            </Descriptions.Item>
                            <Descriptions.Item label="Phone Number">
                                {editingPhoneNumber ? (
                                    <Input
                                        value={userData.phone_number}
                                        onChange={(e) => setUserData({ ...userData, phone_number: e.target.value })}
                                    />
                                ) : (
                                    userData.phone_number
                                )}
                                <Button danger
                                    type="link"
                                    onClick={handleEditPhoneNumber}
                                    style={{ marginLeft: '8px', fontFamily: 'Kanit' }}
                                >
                                    {editingPhoneNumber ? '' : "Edit"}
                                </Button>
                            </Descriptions.Item>
                            <Descriptions.Item label="Role">{rolename}</Descriptions.Item>
                            <Descriptions.Item label="Password">********</Descriptions.Item>
                        </Descriptions>
                        <Button type="primary" onClick={handleSaveChanges} style={{
                            marginTop: '16px', fontFamily: 'Kanit', backgroundColor: 'green',
                            borderColor: 'green',
                        }}>
                            Save Changes
                        </Button>
                        <Link onClick={() => {
                            navigate("/history");
                        }}
                        ><Button type="primary" style={{
                            marginTop: '16px', fontFamily: 'Kanit', marginLeft: '16px'

                        }}>
                                History
                            </Button></Link>

                    </Content>
                </Layout>
            </Layout>
            <Header style={headerbottom}>
                <img src={Logo} alt="Logo" style={{ width: "auto", height: "50px" }} />
            </Header>
        </Flex>
    );
};

export default ProfileForm;
