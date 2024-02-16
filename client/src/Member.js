import React, { useState, useEffect } from "react";
import {
    Form,
    Input,
    Button,
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

import Tour from "./Tour/getTour.js";
import SearchBar from "./Navbar/SearchBar";

const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;

const MemberForm = () => {
    const navigate = useNavigate();
    const [jwt, setjwt] = useLocalState('', 'jwt');

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
        roleChecker();
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

    const contentStyle = {
        textAlign: 'center',
        lineHeight: 'calc(5000%)',
        color: '#fff',
        backgroundColor: '#EEEEEE',
    };

    const layoutStyle = {
        borderRadius: 0,
        overflow: 'hidden',
        backgroundColor: '#EEEEEE',
    };

    const blueTextStyle = {
        color: '#48D3FF',
        fontWeight: 'bold',
        fontSize: '45px',
    };

    const invtext = {
        color: '#1C3953',
        fontWeight: 'bold',
        fontSize: '45px',
    };

    const searchInput = {
        placeholder: "ค้นหาสถานที่ท่องเที่ยว หรือโปรแกรมทัวร์",
        color: "black",
        width: "20%",
        height: "40px",
        fontWeight: 'bold',
        justifyContent: 'center',
    };

    return (
        <Flex gap="middle" wrap="wrap" >
            <Helmet>
                <title>HYJ - Home Page</title>
            </Helmet>

            <Layout style={layoutStyle}>
                <Header style={headerStyle}>
                    <span style={blueTextStyle}>H</span>
                    AT
                    <span style={invtext}>.</span>
                    <span style={blueTextStyle}> Y</span>
                    AI
                    <span style={invtext}>.</span>
                    <span style={blueTextStyle}>J</span>ourney
                    <span style={invtext}>HAY YAI JOURNEY WEBSITE EDIT</span>
                    <Input style={searchInput} />
                    <Link
                        to="/"
                        style={{ marginLeft: "50px", color: "white", fontSize: "18px" }}
                    >
                        Logout
                    </Link>

                </Header>

                <Content style={contentStyle}>
                    ...
                </Content>
            </Layout>

        </Flex>
    );
};


export default MemberForm;
