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

const CardHistory = ({ data, filterData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = location.pathname;
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [jwt, setjwt] = useLocalState(null, "jwt");
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });

  const [allData, setAllData] = useState([]);

  const getStatusColor = (status) => {
    switch (status) {
      case true:
        return `rgba(0, 255, 0)`;
      case false:
        return `rgba(255, 0, 0)`;
    }
  };

  const getStatus = (status) => {
    switch (status) {
      case true:
        return `ว่าง`;
      case false:
        return `เต็ม`;
    }
  };

  const getData = async () => {
    try {
      const res = await axios.get("http://localhost:1337/api/reserves?populate=*");
      console.log("History: ", res.data.data)
      setAllData(res.data.data);
    } catch (error) {
      console.error("error fetching tour data", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
        allData.map(({ id, attributes }) => (
          <Card key={id} style={{ width: 300, margin: 20, marginTop: 50 }}>
            <Image
              src={`https://semantic-ui.com/images/wireframe/white-image.png`}
              preview={false}
            />
            <b style={{ fontSize: "18px" }}>{attributes.tour_name}</b>
            <br />
            สถานะ:{" "}
            <span style={{ color: getStatusColor(attributes.status) }}>
              <b>{getStatus(attributes.status)}</b>
              <b>
                {" "}
                {"(" + attributes.user_amount + "/" + attributes.user_max + ")"}
              </b>
            </span>
            <br />
            ราคา: {attributes.price} บาท / ท่าน
            <br />
            ระยะเวลา:
            <br />
            <br></br>
          </Card>
        ))
      )}
    </div>
  );
};

export default CardHistory;
