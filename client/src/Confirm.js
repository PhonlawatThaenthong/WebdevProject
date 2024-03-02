import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useLocalState from "./localStorage.js";
import { useMediaQuery } from "react-responsive";

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
    Card, Menu, Dropdown, Popover
} from "antd";
import LoadingIcon from "./Navbar/LoadingIcon.js";
import WebFont from 'webfontloader';
import { Helmet } from "react-helmet";
import { MenuOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

const { Header, Footer, Sider, Content } = Layout;


const Confirm = ({ data, filterData }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPage = location.pathname;
    const [selectedTourId, setSelectedTourId] = useState(null);
    const [jwt, setjwt] = useLocalState(null, "jwt");
    const [username, setUsername] = useState('')
    const isSmallScreen = useMediaQuery({ maxWidth: 767 });
    const [messageApi, contextHolder] = message.useMessage();
    const [menuVisible, setMenuVisible] = useState(false);

    const [allData, setAllData] = useState([]);

    const roleChecker = async () => {
        try {
            axios.defaults.headers.common = {
                Authorization: `Bearer ${jwt}`,
            };
            const userResult = await axios.get(
                "http://localhost:1337/api/users/me?populate=role"
            );

            setUsername(userResult.data.username);

            if (userResult.data.role && userResult.data.role.name === "Member") {
                navigate("/history");
            } else {
                if (userResult.data.role && userResult.data.role.name === "Admin") {
                    navigate("/confirm");
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const updateStatus = async (reserveId) => {
        try {
            const res = await axios.post(
                `http://localhost:1337/api/reserve/${reserveId}/method_confirm`);
            message.success("Confirmed Reservation!");
            getData();
        } catch (error) {
            console.error("error updating status", error);
            message.error("Action Failed!");
        }
    };

    const CancelStatus = async (reserveId) => {
        try {
            const res = await axios.post(
                `http://localhost:1337/api/reserve/${reserveId}/method_cancel`);
            message.success("Cancelled Reservation!");
            getData();
        } catch (error) {
            console.error("error updating status", error);
            message.error("Action Failed!");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case true:
                return `rgba(0, 255, 0)`;
            case false:
                return `rgba(255, 0, 0)`;
        }
    };

    const handleLogout = async () => {
        setjwt(null);
        messageApi
            .open({
                type: "loading",
                content: "กรุณารอสักครู่...",
                duration: 1,
            })
            .then(() => message.success("เสร็จสิ้น!", 0.5))
            .then(() => (window.location.href = "/"));
    };

    const getDate = (time) => {
        const dateObj = new Date(time);
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const year = dateObj.getFullYear();
        const month = months[dateObj.getMonth()];
        const date = dateObj.getDate();
        const hours = String(dateObj.getHours()).padStart(2, "0");
        const minutes = String(dateObj.getMinutes()).padStart(2, "0");
        const seconds = String(dateObj.getSeconds()).padStart(2, "0");

        if ((`${date} ${month} ${year} ${hours}:${minutes}:${seconds}`) == "1 January 1970 07:00:00") {
            return '-'
        }
        return `${date} ${month} ${year} ${hours}:${minutes}:${seconds}`;
    };

    const getPrice = (price) => {
        const newPrice = price.toLocaleString('th-TH', { currency: 'THB', minimumFractionDigits: 2 });
        return newPrice
    };

    const getStatus = (status) => {
        switch (status) {
            case true:
                return `ชำระเงินแล้ว`;
            case false:
                return `รอการยืนยัน`;
        }
    };

    const getData = async () => {
        try {
            const res = await axios.get("http://localhost:1337/api/reserves?populate=*");
            setAllData(res.data.data);
        } catch (error) {
            console.error("error fetching tour data", error);
        }
    };

    useEffect(() => {
        if (jwt == null) {
            navigate("/");
        } else roleChecker();
        getData()
    }, []);

    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Sriracha', 'Kanit']
            }
        });
    }, []);

    const menu = (
        <Menu >
            {jwt ? (
                <>
                    <Menu.Item onClick={() => { navigate("/history"); }} key="username">
                        <span style={{ fontFamily: 'Kanit', color: '#48D3FF' }}>{username && `Hello, ${username}`}</span>
                    </Menu.Item>
                    <Menu.Item key="logout" onClick={() => handleLogout()}>
                        ออกจากระบบ
                    </Menu.Item>
                    <Menu.Item key="back" onClick={() => { navigate("/member"); }}>
                        กลับ
                    </Menu.Item>
                </>
            ) : (
                <>

                </>
            )}
        </Menu>
    );

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
                <title>HYJ - History Page</title>
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
                    <Col span={isSmallScreen ? 12 : 22}>
                        {isSmallScreen ? (
                            <div style={{ textAlign: isSmallScreen ? 'right' : 'left' }}>
                                <Dropdown overlay={menu} trigger={['click']} visible={menuVisible} onVisibleChange={setMenuVisible}>
                                    <UserOutlined style={{ fontSize: '25px', marginRight: '8px' }} />
                                </Dropdown>

                            </div>
                        ) : (
                            <>
                                <Link
                                    onClick={() => {
                                        navigate("/");
                                    }}
                                    style={{ fontFamily: 'Kanit', marginLeft: "500px", color: "white", fontSize: isSmallScreen ? "14px" : "18px", width: "300px" }}
                                >
                                    สวัสดีคุณ {username}
                                </Link>

                                <Link
                                    onClick={() => { handleLogout() }}
                                    style={{ fontFamily: 'Kanit', marginLeft: "50px", color: "white", fontSize: "18px" }}
                                >
                                    ออกจากระบบ
                                </Link>
                            </>
                        )}
                    </Col>



                </Header>
                <span style={{ fontFamily: 'Kanit', textAlign: 'center', fontSize: "50px" }}>Reserve</span>

                <div
                    style={{
                        display: isSmallScreen ? "grid" : "flex",
                        backgroundColor: "#F5F5F5",
                    }}
                >
                    {allData.length === 0 ? (
                        <b
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            <LoadingIcon />
                        </b>
                    ) : (
                        allData.map(({ id, attributes }) => (
                            <Card key={id} style={{ fontFamily: 'Kanit', width: 300, margin: 20, marginTop: 50 }}>
                                {attributes.payment_status === false && (
                                    <Image
                                        src={`https://cdn-icons-png.freepik.com/512/6475/6475938.png`}
                                        preview={false}
                                    />)}
                                {attributes.payment_status === true && (
                                    <Image
                                        src={`https://thumb.ac-illust.com/98/98f98abb339a27ca448a784926b8329d_t.jpeg`}
                                        preview={false}
                                    />)}
                                <b style={{ fontSize: "18px", fontFamily: 'Kanit' }}>{attributes.tour_id.data.attributes.tour_name}</b>
                                <br />
                                สถานะ:{" "}
                                <span style={{ color: getStatusColor(attributes.payment_status) }}>
                                    <b>{getStatus(attributes.payment_status)}</b>
                                </span>
                                <br />
                                ประเภทการชำระเงิน: {attributes.payment_method}
                                <br />
                                จำนวน: {attributes.reserve_amount} ท่าน
                                <br />
                                ราคา: {getPrice((attributes.total_price / attributes.reserve_amount))} บาท / ท่าน
                                <br />
                                ราคารวม: {getPrice(attributes.total_price)} บาท
                                <br />
                                วันที่จอง: {getDate(attributes.reserve_date)}
                                <br />
                                วันที่ยืนยัน: {getDate(attributes.confirm_date)}
                                <br />
                                {attributes.payment_status === false && (
                                    <Button

                                        type="primary"
                                        onClick={() => updateStatus(id)}
                                        style={{
                                            fontFamily: 'Kanit',
                                            textAlign: 'center',
                                            marginTop: 10,
                                            backgroundColor: 'green',
                                            borderColor: 'green',
                                        }}
                                    >
                                        Confirm Reservation
                                    </Button>
                                )}
                                {attributes.payment_status === true && (
                                    <Button danger
                                        type="primary"
                                        onClick={() => CancelStatus(id)}
                                        style={{ fontFamily: 'Kanit', textAlign: 'center', marginTop: 10 }}
                                    >
                                        Cancel Reservation
                                    </Button>
                                )}
                                <br></br>
                            </Card>
                        ))
                    )}
                </div>

            </Layout>

        </Flex>
    );
};

export default Confirm;
