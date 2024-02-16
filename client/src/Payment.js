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
    Card,
    Collapse,
    Space,
} from "antd";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';
import useLocalState from './localStorage.js';
import SearchBar from "./Navbar/SearchBar";
import Step from "./Navbar/Step.js";

const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;

const Payment = () => {
    const navigate = useNavigate();
    const [jwt, setjwt] = useLocalState(null, 'jwt');
    const [username, setUsername] = useState('')
    const cardWidth = 1000;
    const cardHeight = 500;
    const { Panel } = Collapse;
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
        navigate('/admin');
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
                    <span style={blueTextStyle}>H</span>
                    AT
                    <span style={invtext}>.</span>
                    <span style={blueTextStyle}> Y</span>
                    AI
                    <span style={invtext}>.</span>
                    <span style={blueTextStyle}>J</span>ourney
                    <span style={invtext}>HAY YAI JOURNEY WEBSITE</span>
                    <Step />
                </Header>
            </Layout>
            <Card title="ช่องทางการชำระเงิน" bordered={false} style={{ width: cardWidth, height: cardHeight }}>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header="ชำระเงินทางธนาคาร" key="1">
                        <p>Content of Panel 1</p>
                    </Panel>
                    <Panel header="ชำระเงินทาง TrueMoney Wallet" key="2">
                        <p>Content of Panel 2</p>
                    </Panel>
                    <Panel header="บัตรเครดิต" key="3">
                        <p>Content of Panel 3</p>
                    </Panel>
                </Collapse>
                <Button type="primary" block onClick={handleButtonClick}>ยืนยัน</Button>
            </Card>



        </Flex>
    );
};


export default Payment;
