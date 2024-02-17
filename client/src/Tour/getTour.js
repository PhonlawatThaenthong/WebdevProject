import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useLocalState from '../localStorage.js';

import {
  Card, Form, Input, Image, Button, Modal, Row, Col, Layout, Flex, Space, Popconfirm, message
} from "antd";


const Tour = ({ data, filterData }) => {
  const location = useLocation();
  const currentPage = location.pathname;
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [jwt, setjwt] = useLocalState(null, 'jwt');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (id) => {
    setSelectedTourId(id);
    setIsModalOpen(true);
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

  const handleTourDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:1337/api/tours/${id}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      window.location.href = '/'
    } catch (error) {
      console.error('Error deleting tour:', error);
    }
  }

  const toursToDisplay = filterData.length > 0 ? filterData : data;

  return (
    <div style={{
      display: "flex",
      backgroundColor: "#F5F5F5"
    }}>
      {toursToDisplay.map(({ id, attributes }) => (
        <Card key={id} style={{ width: 300, margin: 20, marginTop: 50 }}>
          {currentPage === "/admin" ? (
            <Modal title={attributes.tour_name}
              open={isModalOpen && selectedTourId === id}
              onCancel={() => { setIsModalOpen(false) }}
              footer={[
                <Button key="back" onClick={() => { setIsModalOpen(false) }}>
                  Close
                </Button>,
                <Popconfirm
                  title="Delete the tour"
                  description="Are you sure to delete this tour?"
                  onConfirm={() => { setIsModalOpen(false); handleTourDelete(id) }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger>Delete</Button>
                </Popconfirm>,
                <Button key="submit" type="primary" onClick={() => { setIsModalOpen(false) }}>
                  Save
                </Button>,
              ]}>
              <Image src={"http://localhost:1337" + attributes.tour_image?.data?.attributes.url}
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
              <Image src={"http://localhost:1337" + attributes.tour_image?.data?.attributes.url}
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
          <Image src={"http://localhost:1337" + attributes.tour_image?.data?.attributes.url}
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
