import React, { useState } from 'react';
import { Form, Input, Button, Modal, Row, Col } from 'antd';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';



const HomeForm = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [submitEnabled, setSubmitEnabled] = useState(true);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Helmet>
                <title>HYJ - Home Page</title>
            </Helmet>
            
        </Row>
    );
};


export default HomeForm;
