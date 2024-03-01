import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useLocalState from "../localStorage.js";
import { useMediaQuery } from "react-responsive";

import {
  Card,
  Form,
  Input,
  Image,
  Button,
  Modal,
  Row,
  Col,
  Layout,
  Flex,
  Space,
  Popconfirm,
  message,
} from "antd";
import LoadingIcon from "../Navbar/LoadingIcon.js";
import WebFont from 'webfontloader';

const CardHistory = ({ data, filterData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = location.pathname;
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [jwt, setjwt] = useLocalState(null, "jwt");
  const [username, setUsername] = useState('')
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });

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
    } catch (error) {
      console.error(error);
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

  const userReserves = allData.filter(reserve => reserve.attributes.user_id.data.attributes.username === username);

  return (
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
        userReserves.map(({ id, attributes }) => (
          <Card key={id} style={{ width: 300, margin: 20, marginTop: 50 }}>
            <Image
              src={`https://semantic-ui.com/images/wireframe/white-image.png`}
              preview={false}
            />
            <b style={{ fontSize: "18px" ,fontFamily:'Kanit'}}>{attributes.tour_id.data.attributes.tour_name}</b>
            <br />
            ราคา: {getPrice(attributes.total_price)} บาท
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
            วันที่จอง: {getDate(attributes.reserve_date)}
            <br />
            <br></br>
          </Card>
        ))
      )}
    </div>
  );
};

export default CardHistory;
