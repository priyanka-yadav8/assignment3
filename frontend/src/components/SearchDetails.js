import React from "react";
import { useParams } from "react-router-dom";

const SearchDetails = () => {
  let { ticker } = useParams();

  return <div>Details for: {ticker}</div>;
};

export default SearchDetails;
