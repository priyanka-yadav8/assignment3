// HomePage.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [ticker, setTicker] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/search/${ticker}`);
  };

  return (
    <div className="container my-5">
      {/* Title */}
      <h2 className="text-center my-4">STOCK SEARCH</h2>

      {/* Search Bar */}
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <form className="input-group" onSubmit={handleSearch}>
            <input
              type="text"
              className="form-control"
              placeholder="Enter stock ticker symbol"
              aria-label="Enter stock ticker symbol"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
            />
            <button className="btn btn-outline-primary" type="submit">
              <i className="bi bi-search"></i>
            </button>
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setTicker("")}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
