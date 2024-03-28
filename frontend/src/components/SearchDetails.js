import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStockData } from "../contexts/StockDataContext";
import { WatchlistContext } from "../contexts/WatchlistContext";
import { Box, Tab, Tabs } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
// import IconButton from "@mui/material/IconButton";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import "../App.css";

const SearchDetails = () => {
  const { tickerSymbol } = useParams();
  const navigate = useNavigate();
  const [starFill, setStarFill] = useState(false);
  const [time, setTime] = useState("");
  const [val, setVal] = useState("one");

  const handleTab = (e, newVal) => {
    setVal(newVal);
  };

  const toggleFill = () => {
    setStarFill(!starFill); // Toggle the state between true and false
  };

  const iconStyle = {
    color: starFill ? "yellow" : "currentColor", // If starFill is true, color is yellow, else use the current color
    cursor: "pointer", // Change cursor to pointer to indicate the icon is clickable
  };

  // States to store API data
  const {
    stockDetails,
    setStockDetails,
    companyNews,
    setCompanyNews,
    insights,
    setInsights,
    updateStockData,
    ticker,
    setTicker,
    stockQuote,
    setStockQuote,
  } = useStockData();

  // setTicker(tickerSymbol);
  // setStockDetails(stockDetails);

  // const fetchStockData = async (tickerSymbol) => {
  //   const requestOptions = {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ symbol: tickerSymbol }),
  //   };

  //   try {
  //     const stockDetailsResponse = await fetch('http://localhost:5000/api/stocks/get-stock-details', requestOptions);
  //     const stockDetailsData = await stockDetailsResponse.json();
  //     setStockDetails(stockDetailsData);

  //     const companyNewsResponse = await fetch('http://localhost:5000/api/stocks/get-company-news', requestOptions);
  //     const companyNewsData = await companyNewsResponse.json();
  //     setCompanyNews(companyNewsData);

  //     const insightsResponse = await fetch('http://localhost:5000/api/stocks/get-insights', requestOptions);
  //     const insightsData = await insightsResponse.json();
  //     setInsights(insightsData);

  //     console.log(stockDetailsData,"stockDetailsData");
  //     console.log(companyNewsData,"companyNewsData");
  //     console.log(insightsData,"insightsData");
  //   } catch (error) {
  //     console.error('Failed to fetch stock data:', error);
  //   }
  // };

  // useEffect to make the API calls when the component mounts or the ticker changes
  useEffect(() => {
    if (ticker && ticker !== tickerSymbol) {
      if (tickerSymbol && tickerSymbol !== ticker) {
        setTicker(tickerSymbol);
        updateStockData(tickerSymbol);
      }
    }

    const updateTime = () => {
      const now = new Date();
      const formattedTime = now
        .toISOString()
        .replace("T", " ")
        .substring(0, 19);
      setTime(formattedTime);
    };

    updateTime(); // Update time immediately on component mount
    const intervalId = setInterval(updateTime, 15000); // Then update it every second

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [tickerSymbol, ticker, setTicker, updateStockData]);

  // Function to handle search submission
  const handleSearch = (searchTicker) => {
    navigate(`/search/${searchTicker}`);
  };

  const changeColorDisplay = (changeValue) => {
    return changeValue > 0 ? "text-success" : "text-danger";
  };

  const marketStatus = () => {
    return stockDetails.stock_details.market_status === "closed"
      ? "text-danger"
      : "text-success";
  };

  const MarketStatusMessage = () => {
    const message =
      stockDetails.stock_details.market_status === "open"
        ? "Market is Open"
        : `Market closed on ${stockDetails.stock_details.current_timestamp}`;
    return <p>{message}</p>;
  };

  return (
    <div>
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
      <div className="container my-5 text-center">
        <div className="row align-items-center">
          <div className="col-4">
            <h2>
              {stockDetails.stock_details.ticker}{" "}
              <i
                className={starFill ? "bi bi-star-fill" : "bi bi-star"}
                style={iconStyle}
                onClick={toggleFill} // Attach the toggle function to the onClick event
              ></i>
            </h2>

            <h5>{stockDetails.stock_details.name}</h5>
            <h6>{stockDetails.stock_details.exchange}</h6>
            <div>
              <button className="btn btn-success mx-2" type="button">
                Buy
              </button>
              <button className="btn btn-danger mx-2" type="button">
                Sell
              </button>
            </div>
          </div>
          <div className="col-4">
            <div className="img-fluid mx-auto d-block">
              <img
                src={stockDetails.stock_details.logo}
                style={{ width: "100px", height: "auto" }}
                alt="Logo"
              ></img>
            </div>
          </div>
          <div className="col-4">
            <h2 className={changeColorDisplay(stockQuote.change)}>
              {stockQuote.last_price}
            </h2>
            <h4 className={changeColorDisplay(stockQuote.change)}>
              {stockQuote.change} ({stockQuote.change_percentage} %)
            </h4>
            <p>{time}</p>
          </div>
        </div>
        <div className="row align-items-center my-3">
          <h6 className={marketStatus()}>{MarketStatusMessage()}</h6>
        </div>
      </div>
      <div className="container">
        <center>
          <div>
            <TabContext value={val}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  maxWidth: 1300,
                  marginTop: 5,
                }}
              >
                <Tabs
                  value={val}
                  onChange={handleTab}
                  textColor="primary"
                  indicatorColor="primary"
                  variant="scrollable"
                  scrollButtons={true}
                  allowScrollButtonsMobile
                  // centered
                >
                  <Tab
                    value="one"
                    label="Summary"
                    sx={{
                      minWidth: 100,
                      width: 300,
                      textTransform: "capitalize",
                    }}
                  />
                  <Tab
                    value="two"
                    label="Top News"
                    sx={{
                      minWidth: 100,
                      width: 300,
                      textTransform: "capitalize",
                    }}
                  />
                  <Tab
                    value="three"
                    label="Charts"
                    sx={{
                      minWidth: 100,
                      width: 300,
                      textTransform: "capitalize",
                    }}
                  />
                  <Tab
                    value="four"
                    label="Insights"
                    sx={{
                      minWidth: 100,
                      width: 300,
                      textTransform: "capitalize",
                    }}
                  />
                </Tabs>
              </Box>
              <TabPanel value="one" index={0}>
                <div>Stock Summary Data Goes Here</div>
              </TabPanel>
              <TabPanel value="two" index={1}>
                <div>Top News Data Goes Here</div>
              </TabPanel>
              <TabPanel value="three" index={2}>
                <div>Charts Data Goes Here</div>
              </TabPanel>
              <TabPanel value="four" index={3}>
                <div>Company Insight Data Goes Here</div>
              </TabPanel>
            </TabContext>
          </div>
        </center>
      </div>
    </div>
  );
};

export default SearchDetails;
