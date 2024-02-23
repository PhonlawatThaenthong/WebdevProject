import React, { useState } from 'react';
import { Form, Input, Button, Modal, Row, Col, Card, Layout } from 'antd';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import useLocalState from './localStorage.js';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useMediaQuery } from "react-responsive";

const { Header } = Layout;

const RegisterForm = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [submitEnabled, setSubmitEnabled] = useState(true);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [jwt, setjwt] = useLocalState(null, 'jwt');
    const isSmallScreen = useMediaQuery({ maxWidth: 768 });

    const validateConfirmPassword = ({ getFieldValue }) => ({
        validator(_, value) {
            if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('The passwords do not match.'));
        },
    });

    const handleSubmit = async (values) => {
        setSubmitEnabled(false);

        try {
            const registerResult = await axios.post('http://localhost:1337/api/auth/local/register', {
                username: values.username,
                password: values.password,
                email: values.email,
                phone_number: values.phone_number,
            });

            const jwtToken = registerResult.data.jwt;
            setjwt(jwtToken);
            axios.defaults.headers.common = {
                Authorization: `Bearer ${jwt}`,
            };
            const userResult = await axios.get('http://localhost:1337/api/users/me?populate=role');

            if (userResult.data.role && userResult.data.role.name === 'Member') {
                navigate('/member');
            } else {
                navigate('/admin');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Have already username or email');
            setShowErrorModal(true);
        } finally {
            setSubmitEnabled(true);
        }
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    const headerStyle = {
        textAlign: 'center',
        color: '#fff',
        height: 95,
        paddingInline: "center",
        lineHeight: '120x',
        backgroundColor: '#1C3953',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '45px',

    };

    const headerbottom = {
        textAlign: 'center',
        color: '#fff',
        height: 30,
        paddingInline: "center",
        lineHeight: '120x',
        backgroundColor: '#1C3953',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '45px',

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

    const rowStyle = {
        minHeight: "82vh",
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: "1200px",
        margin: "0 auto",
    };

    return (
        <div style={{}}>
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
            </Header>
            <Row justify="center" align="middle" style={rowStyle}>
                <Helmet>
                    <title>HYJ - Register</title>
                </Helmet>
                <Col >
                    <Card title="ลงทะเบียน" bordered={true} style={{ width: "100%", textAlign: "center" }}>
                        <Form form={form} onFinish={handleSubmit}>
                            <Form.Item
                                label="ชื่อผู้ใช้งาน"
                                name="username"
                                rules={[{ required: true, message: 'Please enter your username!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="ตั้งค่ารหัสผ่าน"
                                name="password"
                                rules={[{ required: true, message: 'Please enter your password!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                label="ยืนยันรหัสผ่าน"
                                name="confirm_password"
                                rules={[
                                    { required: true, message: 'Please confirm password!' },
                                    validateConfirmPassword,
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                label="เบอร์โทรศัพท์"
                                name="phone_number"
                                rules={[
                                    { required: true, message: 'Please enter your phone number!' },
                                    { len: 10, message: 'Phone number must be 10 digits!' },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="อีเมล"
                                name="email"
                                rules={[{ required: true, message: 'Please enter your Email!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" disabled={!submitEnabled}>
                                    ยืนยัน
                                </Button>
                            </Form.Item>

                            <Form.Item>
                                <span style={{ marginRight: '8px' }}>มีบัญชีแล้ว?</span>
                                <Link to="/login">เข้าสู่ระบบ</Link>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                {/* Error Modal */}
                <Modal title="Warning" visible={showErrorModal} onCancel={handleCloseErrorModal} footer={null}>
                    <p>{errorMessage}</p>
                    <Button type="primary" onClick={handleCloseErrorModal}>
                        Close
                    </Button>
                </Modal>
            </Row>
            <Header style={headerbottom}></Header>
        </div>
    );
};

export default RegisterForm;
