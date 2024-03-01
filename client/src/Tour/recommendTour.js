import { useState, useEffect } from "react";
import axios from "axios";
import Tour from "../Tour/getTour";

const RecommendTour = () => {
  const [recommendData, setRecommendData] = useState([]);

  const getRecommendData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:1337/api/tours?populate=*"
      );
      const recTour = res.data.data.filter(
        tour => tour.attributes.user_amount < tour.attributes.user_max
      );
      const imgUrl = recTour.map(tour => (
        `http://localhost:1337${tour.attributes.tour_image.data.attributes.formats.thumbnail.url}`
      ));
      setRecommendData(recTour);
    } catch (error) {
      console.error("error fetching recommended data", error);
    }
  };

  useEffect(() => {
    getRecommendData();
  }, []);

  return <Tour data={recommendData} filterData={[]} />;
};

export default RecommendTour;
