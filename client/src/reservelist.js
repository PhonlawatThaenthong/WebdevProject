import React, { useState, useEffect } from "react";
import {
    Form,
    Input,
    Button,
    Image,
    message,
    Modal,
    Row,
    Col,
    Layout,
    Flex,
    Space,
    List,
    Card,
} from "antd";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';
import useLocalState from './localStorage.js';
import { useMediaQuery } from "react-responsive";


import SearchBar from "./Navbar/SearchBar";

const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;

const ReserveForm = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [jwt, setjwt] = useLocalState(null, 'jwt');
    const [username, setUsername] = useState('')
    const [filterData, setFilterData] = useState([]);
    const [allData, setAllData] = useState([]);
    const isSmallScreen = useMediaQuery({ maxWidth: 768 });
    const [data, setData] = useState([]);
    


    const ListData = async () => {
        const response = await axios.get('http://localhost:1337/api/reserves?populate=*', {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
        return response.data.data.map((d) => ({
            tour_id: d.attributes.tour_id.data.attributes.tour_name,
            status: d.attributes.payment_status,
        }));
    };

    const handleLogout = async () => {
        setjwt(null)
        messageApi.open({
            type: 'loading',
            content: 'Please wait...',
            duration: 1,
        })
            .then(() => message.success('Completed!', 0.5))
            .then(() => window.location.href = '/')
    };

    useEffect(() => {
        const fetchItems = async () => {
            const newData = await ListData();
            setData(newData);
        };
        fetchItems();
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
        <Flex gap="middle" wrap="wrap" >
            <Helmet>
                <title>HYJ - reserve Page</title>
            </Helmet>
            {contextHolder}
            <Layout style={layoutStyle}>
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
                    <Link
                        style={{ marginLeft: "50px", color: "white", fontSize: isSmallScreen ? "14px" : "18px", width: "300px" }}
                    >
                        สวัสดี คุณ {username}
                    </Link>

                    <Link
                        onClick={() => { handleLogout() }}
                        style={{ marginLeft: "50px", color: "white", fontSize: "18px" }}
                    >
                        Logout
                    </Link>


                </Header>
                <div>
                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 4,
                        lg: 4,
                        xl: 6,
                        xxl: 3,
                    }}
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item>

                            <Card title={item.tour_id} >
                                
                                <p>Status : {item.status}</p>
                                


                            </Card>

                        </List.Item>
                    )}
                />

            </div>
            </Layout>
            
        </Flex>

    );
};


export default ReserveForm;
