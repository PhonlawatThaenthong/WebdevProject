import { useState, useEffect } from "react";
import axios from "axios";

import Tour from "../Tour/getTour";

const AllTour = () => {
  const [allData, setAllData] = useState([]);

  const getAllData = async () => {
    try {
      const res = await axios.get("http://localhost:1337/api/tours?populate=*");
      setAllData(res.data.data);
    } catch (error) {
      console.error("error fetching all data", error);
    }
  };
  useEffect(() => {
    getAllData();
  }, []);
  return (
    <div>
      <h2>All Tour</h2>
      <Tour data={allData} filterData={[]} />
    </div>
  );
};
export default AllTour;
