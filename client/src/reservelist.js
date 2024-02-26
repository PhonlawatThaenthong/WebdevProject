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
    Card,
} from "antd";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';
import useLocalState from './localStorage.js';
import CardHistory from "./Tour/getHistory.js";
import { useMediaQuery } from "react-responsive";


import SearchBar from "./Navbar/SearchBar";

const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;

const ReserveForm = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [jwt, setjwt] = useLocalState(null, 'jwt');
    const [username, setUsername] = useState('')
    const isSmallScreen = useMediaQuery({ maxWidth: 768 });

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
                    navigate("/history");
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
                    <Link
                        onClick={() => {
                            navigate("/history");
                        }}
                        style={{ marginLeft: "50px", color: "white", fontSize: isSmallScreen ? "14px" : "18px", width: "300px" }}
                    >
                        สวัสดี คุณ {username}
                    </Link>

                    <Link
                        onClick={() => { handleLogout() }}
                        style={{ marginLeft: "50px", color: "white", fontSize: "18px" }}
                    >
                        Logout
                    </Link>


                </Header>
                <CardHistory />
            </Layout>

        </Flex>

    );
};


export default ReserveForm;
