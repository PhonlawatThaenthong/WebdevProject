import React, { useState } from 'react';
import { Form, Input, Button, Modal, Row, Col, Card } from 'antd';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import useLocalState from './localStorage.js';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [submitEnabled, setSubmitEnabled] = useState(true);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [jwt, setjwt] = useLocalState(null, 'jwt');

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

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Helmet>
                <title>HYJ - Register</title>
            </Helmet>
            <Col span={8}>
                <Card title="ลงทะเบียน" bordered={true} style={{ width: '100%', textAlign: 'center' }}>
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
    );
};

export default RegisterForm;
