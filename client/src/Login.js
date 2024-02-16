import React, { useState } from 'react';
import { Form, Input, Button, Modal, Row, Col, Card } from 'antd';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import useLocalState from './localStorage.js';



const LoginForm = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [submitEnabled, setSubmitEnabled] = useState(true);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [jwt, setjwt] = useLocalState('', 'jwt');

    const handleSubmit = async (values) => {
        setSubmitEnabled(false);


        try {
            const loginResult = await axios.post('http://localhost:1337/api/auth/local', {
                identifier: values.username,
                password: values.password
            });

            const jwtToken = loginResult.data.jwt;
            setjwt(jwtToken)
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
            setErrorMessage('Wrong username or password');
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
                <title>HYJ - Login</title>
            </Helmet>
            <Col span={8}>
                <Card title="Login Form" bordered={true} style={{ width: '100%', textAlign: 'center' }}>
                    <Form form={form} onFinish={handleSubmit}>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Please enter your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please enter your password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" disabled={!submitEnabled}>
                                Submit
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <span style={{ marginRight: '8px' }}>Don't have an account?</span>
                            <Link to="/register">Register now</Link>
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


export default LoginForm;
