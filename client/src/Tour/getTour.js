import axios from "axios";
import { useState, useEffect } from "react";

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
    <div>
        {data.map(({ id, attributes }) => (
            <div key={id}>
                {attributes.tour_name} 
                <br />
                {attributes.description}
            </div>
        ))}
    </div>
  )
};

export default Tour;
