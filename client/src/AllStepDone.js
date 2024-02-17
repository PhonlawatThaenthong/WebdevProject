import React, { useState, useEffect } from "react";
import {
    Form,
    Input,
    Button,
    Modal,
    Row,
    Image,
    Col,
    Layout,
    Flex,
    Card,
    Collapse,
    Space,
} from "antd";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';
import useLocalState from './localStorage.js';
import Step from "./Navbar/Step.js";

const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;

const AllStepDone = () => {
    const navigate = useNavigate();
    const [jwt, setjwt] = useLocalState(null, 'jwt');
    const [username, setUsername] = useState('')
    const cardWidth = 1000;
    const cardHeight = 700;
    const { Panel } = Collapse;
    let url = "https://s3-symbol-logo.tradingview.com/the-siam-commercial-bank-public-company--600.png"
    let url2 = "https://play-lh.googleusercontent.com/eOzvk-ekluYaeLuvDkLb5RJ0KqfFQpodZDnppxPfpEfqEqbNo5erEkmwLBgqP-k-e2kQ"
    const roleChecker = async () => {
        try {
            axios.defaults.headers.common = {
                Authorization: `Bearer ${jwt}`,
            };
            const userResult = await axios.get('http://localhost:1337/api/users/me?populate=role');
            setUsername(userResult.data.username)
        } catch (error) {
            console.error(error)
        }
    };
    const handleButtonClick = () => {
        navigate('/member');
    };


    useEffect(() => {
        if (jwt == null) { navigate("/") } else roleChecker();
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
        color: '#48D3FF',
        fontWeight: 'bold',
        fontSize: '45px',
    };

    const NormalTextStyle = {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: '45px',
    };

    const invtext = {
        color: '#1C3953',
        fontWeight: 'bold',
        fontSize: '45px',
    };

    return (
        <Flex gap="middle" wrap="wrap" >
            <Helmet>
                <title>HYJ - Home Page</title>
            </Helmet>

            <Layout style={layoutStyle}>
                <Header style={headerStyle}>
                    <Col>
                        <span style={blueTextStyle}>H</span>
                        <span style={NormalTextStyle}>AT</span>
                        <span style={invtext}>.</span>
                        <span style={blueTextStyle}> Y</span>
                        <span style={NormalTextStyle}>AT</span>
                        <span style={invtext}>.</span>
                        <span style={blueTextStyle}>J</span>
                        <span style={NormalTextStyle}>ourney</span>
                    </Col>
                    <Col span={12} style={{ marginLeft: "300px" }}>
                        <Step current={3}/>
                    </Col>
                </Header>
                <Button type="primary" block style={{ backgroundColor: '#fff', borderColor: '#91D5FF', color: '#1890FF' }} onClick={handleButtonClick}>ใช่ ฉันชำระเงินแล้ว</Button>
            </Layout>
        </Flex>
    );
};


export default AllStepDone;
