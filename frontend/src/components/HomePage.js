// HomePage.js

import React, { useState } from "react";
import { useStockData } from '../contexts/StockDataContext';
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [tickerSymbol, setTickerSymbol] = useState("");
  const { updateStockData } = useStockData();
  const navigate = useNavigate();

  const handleSearch = async (event) => {
    event.preventDefault();
    await updateStockData(tickerSymbol);
    navigate(`/search/${tickerSymbol}`);
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
              value={tickerSymbol}
              onChange={(e) => setTickerSymbol(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              <i className="bi bi-search"></i>
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setTickerSymbol("")}
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
