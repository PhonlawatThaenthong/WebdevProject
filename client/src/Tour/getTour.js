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

const Tour = ({ data, filterData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = location.pathname;
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [jwt, setjwt] = useLocalState(null, "jwt");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [userId, setUserId] = useState("")

  const handleOpenModal = (id) => {
    setSelectedTourId(id);
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case true:
        return `rgba(0, 255, 0)`;
      case false:
        return `rgba(255, 0, 0)`;
    }
  };

  const getPrice = (price) => {
    const newPrice = price.toLocaleString("th-TH", {
      currency: "THB",
      minimumFractionDigits: 2,
    });
    return newPrice;
  };

  const getStatus = (status) => {
    switch (status) {
      case true:
        return `ว่าง`;
      case false:
        return `เต็ม`;
    }
  };

  const handleSelect = async () => {
    if (jwt) {
      try {
        const handleBook = async () => {
          const res_tour = await axios.get(
            `http://localhost:1337/api/tours/${selectedTourId}?populate=*`
          );
          var tmp_amount = res_tour.data.data.attributes.user_amount;
          var tmp_max = res_tour.data.data.attributes.user_max;

          if (tmp_amount >= tmp_max) {

            Modal.error({
              title: "Error",
              content: "ขออภัยทัวร์นี้เต็มแล้ว",
            });

          } else {

            const res = await axios.post(
              `http://localhost:1337/api/tours/${selectedTourId}/complete`,
              {
                numberOfPeople: numberOfPeople,
              },
              {
                headers: {
                  Authorization: `Bearer ${jwt}`,
                },
              }
            );

            //

            let temp_userID = ""
            let temp_selectedTour = []
            let temp_date = new Date()

            try {
              axios.defaults.headers.common = {
                Authorization: `Bearer ${jwt}`,
              };
              const userResult = await axios.get(
                "http://localhost:1337/api/users/me?populate=role"
              );

              temp_userID = userResult.data.id;

              const tourResult = await axios.get(
                `http://localhost:1337/api/tours/${selectedTourId}?populate=*`
              );

              temp_selectedTour = tourResult.data.data;
              console.log(temp_selectedTour)

            } catch (error) {
              console.error(error);
            }

            const addNewTour = {
              tour_id: selectedTourId,
              user_id: temp_userID,
              reserve_amount: numberOfPeople,
              total_price: (temp_selectedTour.attributes.price * numberOfPeople),
              reserve_date: temp_date,
            };

            const formData = new FormData();
            formData.append('data', JSON.stringify(addNewTour));

            const response = await axios.post('http://localhost:1337/api/reserves', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });

            //

            navigate('/payments')

          }
        };
        Modal.confirm({
          title: "ยืนยันการจองทัวร์",
          content: (
            <div>
              <p style={{ fontFamily: 'Kanit' }}>กรุณายืนยันการจองทัวร์และดำเนินการชำระเงิน</p>
            </div>
          ),
          okText: "ยืนยัน",
          cancelText: "ยกเลิก",
          onOk: () => {
            handleBook();
          },
          onCancel: () => { },
        });
      } catch (error) {
        console.error("error selecting tour", error);
      }
    } else {
      Modal.confirm({
        title: "ท่านยังไม่ได้ล็อกอิน",
        content: (
          <div>
            <p style={{ fontFamily: 'Kanit' }}>กรุณาทำการล็อกอินก่อนจองทัวร์</p>
          </div>
        ),
        okText: "ล็อกอิน",
        cancelText: "ยกเลิก",
        onOk: () => {
          navigate("/login");
        },
        onCancel: () => { },
      });
    }
  };

  const handleTourDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:1337/api/tours/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting tour:", error);
    }
  };

  const toursToDisplay = filterData.length > 0 ? filterData : data;

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Sriracha', 'Kanit']
      }
    });
  }, []);

  return (
    <div
      style={{
        display: isSmallScreen ? "grid" : "flex",
        backgroundColor: "#F5F5F5",
      }}
    >
      {toursToDisplay.length === 0 ? (
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
        <Row gutter={[16, 16]}>
          {toursToDisplay.map(({ id, attributes }) => (
            <Col key={id} xs={24} sm={12} md={8} lg={8} style={{ display: 'flex', width: isSmallScreen ? '100%' : 'auto' }}>
              <Card hoverable key={id} style={{ fontFamily: 'Kanit', width: 450, margin: 20, marginTop: 50 }}>
                {currentPage === "/admin" ? (
                  <Modal
                    title={attributes.tour_name}
                    open={isModalOpen && selectedTourId === id}
                    onCancel={() => {
                      setIsModalOpen(false);
                    }}
                    footer={[
                      <Button
                        key="back"
                        onClick={() => {
                          setIsModalOpen(false);
                        }}
                      >
                        ปิด
                      </Button>,
                      <Popconfirm
                        title="Delete the tour"
                        description="Are you sure to delete this tour?"
                        onConfirm={() => {
                          setIsModalOpen(false);
                          handleTourDelete(id);
                        }}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button danger>ลบ</Button>
                      </Popconfirm>,
                      <Button
                        key="submit"
                        type="primary"
                        onClick={() => {
                          setIsModalOpen(false);
                        }}
                      >
                        บันทึก
                      </Button>,
                    ]}
                  >
                    {/* Admin Modal*/}
                    <div style={{ textAlign: "center" }}>
                      <Image
                        src={
                          attributes.tour_image && attributes.tour_image.data
                            ? `http://localhost:1337${attributes.tour_image.data.attributes.formats.thumbnail.url}`
                            : ""
                        }
                        preview={false}
                      />
                    </div>
                    {/* Admin Modal*/}
                    <br />
                    สถานะ:{" "}
                    <span style={{ color: getStatusColor(attributes.status) }}>
                      <b>{getStatus(attributes.status)}</b>
                      <b>
                        {" "}
                        {"(" +
                          attributes.user_amount +
                          "/" +
                          attributes.user_max +
                          ")"}
                      </b>
                    </span >
                    <br />
                    ราคา: {getPrice(attributes.price)} บาท / ท่าน
                    <br />
                    ระยะเวลา:
                    <br />
                    <br></br>
                  </Modal>
                ) : (
                  // VVVVVVVV THIS IS NON ADMIN MODAL PLEASE EDIT THIS ONLY /////////////////////////////////////////////////////
                  <Modal
                    style={{ fontFamily: 'Kanit' }}
                    title={attributes.tour_name}
                    open={isModalOpen && selectedTourId === id}
                    onCancel={() => {
                      setIsModalOpen(false);
                    }}
                    footer={[
                      <Button
                        key="back"
                        onClick={() => {
                          setIsModalOpen(false);
                        }}
                      >
                        ปิด
                      </Button>,
                      <Button key="submit" type="primary" onClick={handleSelect}>
                        จองทัวร์
                      </Button>,
                    ]}
                  >
                    {/* User Modal*/}
                    <div style={{ textAlign: "center" }}>
                      <Image
                        src={
                          attributes.tour_image && attributes.tour_image.data
                            ? `http://localhost:1337${attributes.tour_image.data.attributes.formats.thumbnail.url}`
                            : ""
                        }
                        preview={false}
                      />
                    </div>
                    {/* User Modal*/}
                    <br />
                    สถานะ:{" "}
                    <span style={{ color: getStatusColor(attributes.status) }}>
                      <b>{getStatus(attributes.status)}</b>
                      <b>
                        {" "}
                        {"(" +
                          attributes.user_amount +
                          "/" +
                          attributes.user_max +
                          ")"}
                      </b>
                    </span>
                    <br />
                    ราคา: {getPrice(attributes.price)} บาท
                    <br />
                    ระยะเวลา:
                    <br />
                    รายละเอียด:
                    <br />
                    {attributes.description}
                    <br></br>
                    <br />
                    จำนวนคน:{" "}
                    <Input
                      type="number"
                      min={1}
                      value={numberOfPeople}
                      onChange={(e) => setNumberOfPeople(parseInt(e.target.value, 10))}
                    />

                  </Modal>
                )}
                <div style={{ textAlign: "center" }}>
                  <Image
                    src={
                      attributes.tour_image && attributes.tour_image.data
                        ? `http://localhost:1337${attributes.tour_image.data.attributes.formats.thumbnail.url}`
                        : ""
                    }
                    preview={false}
                  />
                </div>
                <br />
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
                ราคา: {getPrice(attributes.price)} บาท / ท่าน
                <br />
                ระยะเวลา:
                <br />
                <br></br>
                {currentPage === "/admin" ? (
                  <Button
                    type="primary"
                    onClick={() => handleOpenModal(id)}
                    style={{
                      fontFamily: 'Kanit',
                      display: "block",
                      margin: "0 auto",
                      backgroundColor: "#DE3163",
                    }}
                  >
                    Edit
                  </Button>
                ) : (
                  // VVVVVVVV THIS IS NON ADMIN MODAL PLEASE EDIT THIS ONLY /////////////////////////////////////////////////////
                  <Button
                    type="primary"
                    onClick={() => handleOpenModal(id)}
                    style={{ fontFamily: 'Kanit', display: "block", margin: "0 auto" }}
                  >
                    ดูเพิ่มเติม
                  </Button>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );

};

export default Tour;
