import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Table } from "antd";

const TourSchedule = () => {
  const { tourId } = useParams();
  const [tourSchedule, setTourSchedule] = useState(null);

  useEffect(() => {
    const getTourSchedule = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1337/api/tours/${tourId}?populate=*`
        );
        setTourSchedule(response.data.data);
      } catch (error) {
        console.error("Error fetching tour data:", error);
      }
    };

    if (tourId) {
      getTourSchedule();
    }
  }, [tourId]);

  if (!tourSchedule) {
    return <div>Loading...</div>;
  }

  const columns = [
    {
      title: "สถานที่",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "เวลา",
      dataIndex: "time",
      key: "time",
    },
  ];

  const dataSource = tourSchedule.attributes.destination.map(
    (destination, index) => ({
      key: index,
      name: destination.name,
      time: destination.time,
    })
  );

  return (
    <div>
      <h3>ตารางท่องเที่ยว: {tourSchedule.attributes.tour_name}</h3>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
};

export default TourSchedule;
