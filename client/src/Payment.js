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
    Drawer,
    FloatButton
} from "antd";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';
import useLocalState from './localStorage.js';
import Step from "./Navbar/Step.js";
import { useMediaQuery } from "react-responsive";
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;


const Payment = () => {
    const navigate = useNavigate();
    const [jwt, setjwt] = useLocalState(null, 'jwt');
    const [username, setUsername] = useState('')
    const isSmallScreen = useMediaQuery({ maxWidth: 768 });
    const cardWidth = isSmallScreen ? '100%' : 1000;
    const cardHeight = isSmallScreen ? 'auto' : 700;
    const { Panel } = Collapse;
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };
    let url = "https://s3-symbol-logo.tradingview.com/the-siam-commercial-bank-public-company--600.png"
    let url2 = "https://play-lh.googleusercontent.com/eOzvk-ekluYaeLuvDkLb5RJ0KqfFQpodZDnppxPfpEfqEqbNo5erEkmwLBgqP-k-e2kQ"
    let url3 = "https://cdn.discordapp.com/attachments/1070568112459632682/1213149402600972349/IMG_0249.png?ex=65f46c6c&is=65e1f76c&hm=e3ec34b2ed73a84befba06e8012e280ef8ae5355abb49277ac2c7189d0d234f9&"
    let url4 = "https://cdn.discordapp.com/attachments/1070568112459632682/1213150614264217640/IMG_0251.png?ex=65f46d8d&is=65e1f88d&hm=d691fc54956b560297ecbb710fd907e9853c1113bc973b29c9b1571b78b65189&"
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
        navigate('/UploadReceipt');
    };

    const handleHeaderClick = () => {
        navigate('/Member');
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
                <Header onClick={isSmallScreen ? handleHeaderClick : undefined} style={{ ...headerStyle, justifyContent: isSmallScreen ? 'center' : 'flex-start' }}>
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
                            <Step />
                        </Col>
                    )}
                </Header>
            </Layout>
            <Space direction={isSmallScreen ? "vertical" : "horizontal"} size="middle" style={{ display: 'flex', width: isSmallScreen ? '100%' : 'auto' }}>
                <Card title="ช่องทางการชำระเงิน" bordered={false} style={{ width: cardWidth, height: cardHeight }}>
                    <Collapse defaultActiveKey={['1']}>
                        <Panel header="ชำระเงินทางธนาคาร" key="1">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p><strong>
                                    กรุณาโอนเงินไปยัง:{' '}

                                    ธนาคารไทยพาณิชย์ (SCB){' '}
                                    <br />
                                    หมายเลขบัญชี: 983XXXXXXX{' '}
                                    <br />
                                    ชื่อบัญชี: บจ. หาดใหญ่ จอว์ลนี่ เซอร์วิสเซส สำนักงานใหญ่ 1 (ประชายินดี 5)
                                    <br />
                                    **ก่อนทำการโอนเงิน กรุณาเติมข้อความในหมายเหตุว่า "เที่ยวกับ Hatyai Journey" ทุกครั้ง หากลืมบันทึกทางเราขอทำการโอนคืน**
                                </strong>
                                </p>
                                {!isSmallScreen && (
                                    <img src={url} className="Logo1" alt="" style={{ width: 50, marginLeft: 'auto' }} />
                                )}
                            </div>
                        </Panel>
                        <Panel header="ชำระเงินทาง TrueMoney Wallet" key="2">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p><strong>
                                    กรุณาโอนเงินไปยัง:{' '}
                                    TrueMoney Wallet{' '}
                                    <br />
                                    หมายเลขบัญชี 062-0XX-XXXX{' '}
                                    <br />
                                    ชื่อบัญชี: นาย หาดใหญ่ สวยดี / บจ. หาดใหญ่ จอว์ลนี่ เซอร์วิสเซส สำนักงานใหญ่ 1 (ประชายินดี 5)
                                    <br />
                                    **ก่อนทำการโอนเงิน กรุณาเติมข้อความในหมายเหตุว่า "เที่ยวกับ Hatyai Journey" ทุกครั้ง หากลืมบันทึกทางเราขอทำการโอนคืน**
                                </strong>
                                </p>
                                {!isSmallScreen && (
                                    <img src={url2} className="Logo2" alt="" style={{ width: 50, marginLeft: 'auto' }} />
                                )}
                            </div>
                        </Panel>
                    </Collapse>
                    <Card title="ชำระเงินเสร็จเรียบร้อยแล้วใช่หรือไม่?" bordered={false} style={{ width: isSmallScreen ? '100%' : 950 }}>
                        <p>เมื่อทำการชำระเงินเรียบร้อยแล้วต้องทำการแจ้งสลิปหลักฐานการโอนเงินพร้อมระบุหมายเหตุทุกครั้ง เมื่อการชำระเงินของคุณได้รับการยืนยันแล้ว </p>
                        <p>สถานะการชำระในช่องประวัติการซื้อจะเปลี่ยนแปลง</p>
                        <Button type="primary" block style={{ backgroundColor: '#fff', borderColor: '#91D5FF', color: '#1890FF' }} onClick={handleButtonClick}>ใช่ ฉันชำระเงินแล้ว</Button>
                    </Card>
                </Card>

            </Space>
            <FloatButton
                icon={<QuestionCircleOutlined />}
                onClick={showDrawer}
                type="default"
                style={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20, 
                    zIndex: 9999,   
                }}
            />
            <Drawer title="ตัวอย่างสลิปการโอนเงิน" onClose={onClose} open={open} style={{ display: 'flex', width: isSmallScreen ? '100%' : 'auto' }}>
                <p><strong>ตัวอย่างสลิปการโอนเงินธนาคาร</strong></p>
                <br />
                <img src={url3} className="Logo3" alt="" style={{ width: isSmallScreen ? '100%' : '100%', marginLeft: 'auto' }} />
                <p><strong>ตัวอย่างสลิปการโอนเงินผ่าน TrueMoney Wallet</strong></p>
                <br />
                <img src={url4} className="Logo4" alt="" style={{ width: isSmallScreen ? '100%' : '100%', marginLeft: 'auto' }} />
            </Drawer>
        </Flex>

    );

};


export default Payment;
