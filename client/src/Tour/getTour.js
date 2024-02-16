import axios from "axios";
import { useState, useEffect } from "react";

import { Card } from "antd";


const Tour = () => {
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const res = await axios.get("http://localhost:1337/api/tours");
      setData(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.error("error fetching tour data", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div style={{ display: "flex" }}>
        {data.map(({ id, attributes }) => (
            <Card key={id} style={{ width: 300, margin: 20, marginTop: 50 }}>
                <b>{attributes.tour_name}</b>
                <br />
                ราคา: {attributes.price} บาท/ท่าน
                <br />
                สถานะ: {attributes.status}
            </Card>
        ))}
    </div>
  )
};

export default Tour;
