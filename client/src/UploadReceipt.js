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
import { useMediaQuery } from "react-responsive";

const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;

const UploadReceipt = () => {
    const navigate = useNavigate();
    const [jwt, setjwt] = useLocalState(null, 'jwt');
    const [username, setUsername] = useState('')
    const isSmallScreen = useMediaQuery({ maxWidth: 768 });
    const cardWidth = isSmallScreen ? '100%' : 1000;
    const cardHeight = isSmallScreen ? 'auto' : 700;
    const { Panel } = Collapse;
    let url = "https://qr-official.line.me/gs/M_305iwzmm_GW.png?oat_content=qr"
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
     const handleHeaderClick = () => {
        navigate('/Member');
    };

    const handleButtonClick = () => {
        navigate('/AllStepDone');
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
        <Flex gap="middle" wrap="wrap">
            <Helmet>
                <title>HYJ - Home Page</title>
            </Helmet>

            <Layout style={layoutStyle}>
                <Header  onClick={isSmallScreen ? handleHeaderClick : undefined} style={{ ...headerStyle, justifyContent: isSmallScreen ? 'center' : 'flex-start' }}>
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
                    {!isSmallScreen && (
                        <Col span={12} style={{ marginLeft: "150px" }}>
                            <Step current={1} />
                        </Col>
                    )}
                </Header>
            </Layout>
            <Space direction="vertical" size="middle" style={{ display: 'flex', width: isSmallScreen ? '100%' : 'auto' }}>
                <Card title="อัพโหลดหลักฐานการชำระเงิน" bordered={false} style={{ width: isSmallScreen ? '100%' : 950 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                            <img src={url} className="Logo1" alt="" style={{ width: isSmallScreen ? '100%' : "100%", }} />
                        </div>
                        <Card style={{ width: isSmallScreen ? '100%' : "75%", backgroundColor: '#F9F9F9' }}> <p><strong>
                            ชื่อบัญชี: HAT YAI Journey
                            <br />
                            Lind ID : @305iwzmm
                            <br />
                            กรุณาแจ้งข้อมูลดังนี้
                            <br />
                            1.ชื่อบัญชีผู้ทำการจอง
                            <br />
                            2.จำนวนเงินที่ทำการจอง
                            <br />
                            3.สลิปโอนเงิน พร้อมหมายเหตุ
                        </strong>
                            <br />
                        </p>
                            ทางแอดมินจะทำการอัพเดตสถานะตามคิว รบกวนไม่ทักแชทซ้ำ หากมีการทักซ้ำเท่ากับต่อคิวใหม่
                            <br />
                            **ก่อนทำการโอนเงิน กรุณาเติมข้อความในหมายเหตุว่า "เที่ยวกับ Hatyai Journey" ทุกครั้ง หากลืมบันทึกทางเราขอทำการโอนคืน**
                        </Card>
                        <br />
                        <Button type="primary" block onClick={handleButtonClick}>ขั้นตอนถัดไป</Button>
                    </div>
                </Card>
            </Space>
        </Flex >
    );
};


export default UploadReceipt;

