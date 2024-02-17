import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { Card, Form, Input, Image, Button, Modal, Row, Col, Layout, Flex, Space } from "antd";


const Tour = () => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const currentPage = location.pathname;
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (id) => {
    setSelectedTourId(id);
    setIsModalOpen(true);
  };

  const getData = async () => {
    try {
      const res = await axios.get("http://localhost:1337/api/tours?populate=*");
      setData(res.data.data);
    } catch (error) {
      console.error("error fetching tour data", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case true:
        return `rgba(0, 255, 0)`
      case false:
        return `rgba(255, 0, 0)`
    }
  };

  const getStatus = (status) => {
    switch (status) {
      case true:
        return `ว่าง`
      case false:
        return `เต็ม`
    }
  };

  const showTourInfo = (id) => {
    setFocusInfo(id)
    setIsInfoMenuOpen(true)
  };

  class InfoModal {
    constructor(attributes) {
      this.menuOpen = false;
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div style={{
      display: "flex",
      backgroundColor: "#F5F5F5"
    }}>
      {data.map(({ id, attributes }) => (
        <Card key={id} style={{ width: 300, margin: 20, marginTop: 50 }}>
          {currentPage === "/admin" ? (
            <Modal title={attributes.tour_name}
              open={isModalOpen && selectedTourId === id}
              onOk={() => { setIsModalOpen(false) }}
              onCancel={() => { setIsModalOpen(false) }}
              footer={[
                <Button key="back" onClick={() => { setIsModalOpen(false) }}>
                  Close
                </Button>,
                <Button key="submit" type="primary" onClick={() => { setIsModalOpen(false) }}>
                  Select
                </Button>,
              ]}>
              <Image src={"http://localhost:1337" + attributes.tour_image?.data[0]?.attributes.url}
                preview={false}
              />
              <br />
              สถานะ: <span style={{ color: getStatusColor(attributes.status) }}>
                <b>{getStatus(attributes.status)}</b>
                <b> {"(" + attributes.user_amount + "/" + attributes.user_max + ")"}</b>
              </span>
              <br />
              ราคา: {attributes.price} บาท / ท่าน
              <br />
              ระยะเวลา:
              <br />
              <br></br>
            </Modal>
          ) : (  // VVVVVVVV THIS IS NON ADMIN MODAL PLEASE EDIT THIS ONLY /////////////////////////////////////////////////////
            <Modal title={attributes.tour_name}
              open={isModalOpen && selectedTourId === id}
              onOk={() => { setIsModalOpen(false) }}
              onCancel={() => { setIsModalOpen(false) }}
              footer={[
                <Button key="back" onClick={() => { setIsModalOpen(false) }}>
                  Close
                </Button>,
                <Button key="submit" type="primary" onClick={() => { setIsModalOpen(false) }}>
                  Select
                </Button>,
              ]}>
              <Image src={"http://localhost:1337" + attributes.tour_image?.data[0]?.attributes.url}
                preview={false}
              />
              <br />
              สถานะ: <span style={{ color: getStatusColor(attributes.status) }}>
                <b>{getStatus(attributes.status)}</b>
                <b> {"(" + attributes.user_amount + "/" + attributes.user_max + ")"}</b>
              </span>
              <br />
              ราคา: {attributes.price} บาท / ท่าน
              <br />
              ระยะเวลา:
              <br />
              <br></br>
            </Modal>
          )}
          <Image src={"http://localhost:1337" + attributes.tour_image?.data[0]?.attributes.url}
            preview={false}
          />
          <b style={{ fontSize: "18px" }}>{attributes.tour_name}</b>
          <br />
          สถานะ: <span style={{ color: getStatusColor(attributes.status) }}>
            <b>{getStatus(attributes.status)}</b>
            <b> {"(" + attributes.user_amount + "/" + attributes.user_max + ")"}</b>
          </span>
          <br />
          ราคา: {attributes.price} บาท / ท่าน
          <br />
          ระยะเวลา:
          <br />
          <br></br>
          {currentPage === "/admin" ? (
            <Button type="primary" onClick={() => handleOpenModal(id)} style={{ display: "block", margin: "0 auto", backgroundColor: "#DE3163" }}>Edit</Button>
          ) : (  // VVVVVVVV THIS IS NON ADMIN MODAL PLEASE EDIT THIS ONLY /////////////////////////////////////////////////////
            <Button type="primary" onClick={() => handleOpenModal(id)} style={{ display: "block", margin: "0 auto" }}>ดูเพิ่มเติม</Button>
          )}
        </Card>
      ))}
    </div>
  );
};

export default Tour;
