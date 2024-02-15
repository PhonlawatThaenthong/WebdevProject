import React, { useState } from 'react';
import { Form, Input, Button, Modal, Row, Col, Layout, Flex } from 'antd';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const { Header, Footer, Sider, Content } = Layout;

const HomeForm = () => {
    const navigate = useNavigate();

    const headerStyle = {
        textAlign: 'center',
        color: '#fff',
        height: 120,
        paddingInline: "center",
        lineHeight: '120x',
        backgroundColor: '#1C3953',
        display: 'flex',
        justifyContent: 'left',
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
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#EEEEEE',
    };

    const blueTextStyle = {
        color: '#48D3FF',
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
                    <span style={blueTextStyle}> Y</span>
                    AI <span style={blueTextStyle}>J</span>ourney
                </Header>
                <Content style={contentStyle}> ...</Content>
            </Layout>

        </Flex>
    );
};


export default HomeForm;
