import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStockData } from "../contexts/StockDataContext";
import { WatchlistContext } from "../contexts/WatchlistContext";
import { Box, Tab, Tabs } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import "../App.css";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Highcharts2 from "highcharts/highstock";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import DisplayNews from "./DisplayNews";
import HomePage from "./HomePage";
import Spinner from "react-bootstrap/Spinner";

import HC_more from "highcharts/highcharts-more";
import HC_indicatorsAll from "highcharts/indicators/indicators-all";
import HC_vbp from "highcharts/indicators/volume-by-price";

HC_more(Highcharts2);
HC_indicatorsAll(Highcharts2);
HC_vbp(Highcharts2);

<head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js"></script>
  <script src="https://code.highcharts.com/modules/stock.js"></script>
  <script src="https://code.highcharts.com/highstock.js"></script>
</head>;

const SearchDetails = () => {
  const { tickerSymbolParam } = useParams();
  const navigate = useNavigate();
  const [starFill, setStarFill] = useState(false);
  const [time, setTime] = useState("");
  const [val, setVal] = useState("one");
  const [dataFetchedBoolean, setDataFetchedBoolean] = useState(false);
  const [loadingState, setLoadingState] = useState(true);
  const [combinedCategories, setCombinedCategories] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [graphColor, setGraphColor] = useState("red");

  const handleTab = (e, newVal) => {
    setVal(newVal);
  };

  const toggleFill = async() => {
    if(starFill === true){
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: tickerSymbolParam }),
      };
      const deleteFromWatchlistRes = await fetch(`http://localhost:5000/api/watchlist/remove-from-watchlist`, requestOptions);
      if(deleteFromWatchlistRes.status ==200){
        setStarFill(!starFill); // Toggle the state between true and false

      }

    } else {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: tickerSymbolParam,
        name: stockDetails.stock_details.name }),
      };
      const addToWatchlistRes = await fetch(`http://localhost:5000/api/watchlist/add-to-watchlist`, requestOptions);
      if(addToWatchlistRes.status == 200){
        setStarFill(!starFill);
      }

    }
    
  };

  const iconStyle = {
    color: starFill ? "yellow" : "currentColor",
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
    // updateStockData,
    ticker,
    setTicker,
    stockQuote,
    setStockQuote,
    strongBuy,
    setStrongBuy,
    strongSell,
    setStrongSell,
    buy,
    setBuy,
    sell,
    setSell,
    hold,
    setHold,
    period,
    setPeriod,
    actual,
    setActual,
    estimate,
    setEstimate,
    period2,
    setPeriod2,
    surprise,
    setSurprise,
    hours,
    setHours,
    price,
    setPrice,
    historicData,
    setHistoricData,
    ohlc,
    setOhlc,
    volume,
    setVolume,
  } = useStockData();

  const updateStockData = async (tickerSymbol) => {
    setLoadingState(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol: tickerSymbol }),
    };

    // Fetch and update stock details
    const stockDetailsResponse = await fetch(
      "http://localhost:5000/api/stocks/get-stock-details",
      requestOptions
    );
    const stockDetailsStatus = stockDetailsResponse.status;
    if (stockDetailsStatus === 500) {
    }
    const stockDetailsData = await stockDetailsResponse.json();
    const hourly_charts_data = stockDetailsData.hourly_charts_data;
    setHours(hourly_charts_data.map(item => new Date(item.t).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Los_Angeles'
      })));
    setPrice(hourly_charts_data.map((item) => item.c));
    setStockDetails(stockDetailsData);

    const stockQuoteResponse = await fetch(
      "http://localhost:5000/api/stocks/get-stock-quote",
      requestOptions
    );
    const stockQuoteData = await stockQuoteResponse.json();
    setStockQuote(stockQuoteData);
    if(stockQuoteData.change>=0){
      setGraphColor("green");

    } else{
      setGraphColor("red");
    }

    // Fetch and update company news
    const companyNewsResponse = await fetch(
      "http://localhost:5000/api/stocks/get-company-news",
      requestOptions
    );
    const companyNewsData = await companyNewsResponse.json();
    setCompanyNews(companyNewsData);
    // console.log(companyNewsData,"companyNewsData");

    // Fetch and update insights
    const insightsResponse = await fetch(
      "http://localhost:5000/api/stocks/get-insights",
      requestOptions
    );
    const insightsData = await insightsResponse.json();
    setInsights(insightsData);

    const recommendation_trends = insightsData.recommendation_trends;
    const company_earnings_data = insightsData.company_earnings_data;
    setStrongBuy(recommendation_trends.map((item) => item.strongBuy));
    setStrongSell(recommendation_trends.map((item) => item.strongSell));
    setSell(recommendation_trends.map((item) => item.sell));
    setBuy(recommendation_trends.map((item) => item.buy));
    setHold(recommendation_trends.map((item) => item.hold));
    setPeriod(recommendation_trends.map((item) => item.period));
    setActual(company_earnings_data.map((item) => item.actual));
    setEstimate(company_earnings_data.map((item) => item.estimate));
    setPeriod2(company_earnings_data.map((item) => item.period));
    setSurprise(company_earnings_data.map((item) => item.surprise));

    const period2_dummy = company_earnings_data.map((item) => item.period);
    const surprise_dummy = company_earnings_data.map((item) => item.surprise);
    var combinedCat = company_earnings_data.map(function (item, index) {
      return item.period + "<br> Surprise: " + item.surprise;
    });
    setCombinedCategories(combinedCat);

    const historicalChartResponse = await axios.get(
      `http://localhost:5000/api/stocks/get-historical-chart/${tickerSymbol}`
    );
    console.log(historicalChartResponse, "resulttt");
    setHistoricData(historicalChartResponse.data.results);
    setOhlc(
      historicalChartResponse.data.results.map((item) => [
        item.t,
        item.o,
        item.h,
        item.l,
        item.c,
      ])
    );
    setVolume(
      historicalChartResponse.data.results.map((item) => [item.t, item.v])
    );


    //checking if stock is in watchlist
    const getStockFromWatchlist = await fetch(`http://localhost:5000/api/watchlist/get-stock-from-watchlist/${tickerSymbol}`);
    if(getStockFromWatchlist.status == 404){
      setStarFill(false);
    } else if(getStockFromWatchlist.status == 200){
      setStarFill(true);
    } else {
      setStarFill(false);
    }

    setLoadingState(false);
  };

  useEffect(() => {
    console.log(ticker, "ticker");
    console.log(tickerSymbolParam, "tickerSymbol");
    if (ticker !== tickerSymbolParam) {
      setTicker(tickerSymbolParam);
      updateStockData(tickerSymbolParam);
    }
    console.log(ticker, "ticker after");

    const updateTime = () => {
      const now = new Date();
      const formattedTime = now
        .toISOString()
        .replace("T", " ")
        .substring(0, 19);
      setTime(formattedTime);
    };
    updateTime();
    const intervalId = setInterval(updateTime, 15000);

    return () => clearInterval(intervalId);
  }, [tickerSymbolParam, ticker, setTicker, updateStockData]);

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

  const insightChart = {
    chart: {
      type: "column",
    },
    title: {
      text: "Recommendation Trends",
      align: "center",
    },
    xAxis: {
      categories: period,
    },
    yAxis: {
      min: 0,
      title: {
        text: "#Analysis",
      },
      stackLabels: {
        enabled: true,
      },
    },
    legend: {
      align: "center",
      x: 70,
      verticalAlign: "bottom",
      y: 70,
      floating: true,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || "white",
      borderColor: "#CCC",
      borderWidth: 1,
      shadow: false,
    },
    tooltip: {
      headerFormat: "<b>{point.x}</b><br/>",
      pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
    },
    plotOptions: {
      column: {
        stacking: "normal",
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: [
      {
        name: "Strong Buy",
        data: strongBuy,
      },
      {
        name: "Buy",
        data: buy,
      },
      {
        name: "Hold",
        data: hold,
      },
      {
        name: "Sell",
        data: sell,
      },
      {
        name: "Strong Sell",
        data: strongSell,
      },
    ],
  };

  // var combinedCategories = period2.map(function (period, index) {
  //   return period + "<br> Surprise: " + surprise[index];
  // });
  const earningsChart = {
    chart: {
      type: "spline",
      events: {
        render: function () {
          var chart = this;
          if (!chart.customLine) {
            chart.customLine = chart.renderer
              .path([
                "M",
                chart.plotLeft,
                chart.plotTop + chart.plotHeight + 60,
                "L",
                chart.plotLeft + chart.plotWidth,
                chart.plotTop + chart.plotHeight + 60,
              ])
              .attr({
                "stroke-width": 2,
                stroke: "black",
              })
              .add();
          }
        },
      },
    },
    title: {
      text: "Historical EPS Surprises",
      align: "center",
    },
    xAxis: {
      categories: combinedCategories,
      title: {
        text: "",
      },
      lineWidth: 2,
    },
    yAxis: {
      title: {
        text: "Quarterly EPS",
      },
    },
    legend: {
      align: "center",
      verticalAlign: "bottom",
      layout: "horizontal",
    },
    series: [
      {
        name: "Actual",
        data: actual,
      },
      {
        name: "Estimate",
        data: estimate,
      },
    ],
  };



  const summaryCharts = {
    chart: {
      type: 'line',
      width: 500, // Set the width of the chart
  },
  title: {
      text: `${tickerSymbolParam} Hourly Price Variation`,
      align: 'center'
  },
  xAxis: {
    type: 'datetime',
    categories: hours,
    tickInterval: 5,
    tickWidth: 1, // Set the tick line width
    tickLength: 10, // Set the length of the tick marks
    tickColor: '#666',
},
plotOptions: {
  series: {
      label: {
          connectorAllowed: false
      },
      pointStart: 2
  }
},
  yAxis: {
    title: {
        text: '' 
    },
    opposite: true 
  },
  legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      enabled: false 
  },
  series: [{
      data: price,
      color: graphColor,
      marker: {
        enabled: false 
    }
  }],
  responsive: {
      rules: [{
          condition: {
              maxWidth: 500
          },
          chartOptions: {
              legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
              }
          }
      }]
  }
  };

  const historicalChart = {
    chart: {
      height: 700, // or whatever height you prefer
    },

    rangeSelector: {
      selected: 2,
      buttons: [
        { type: "month", count: 1, text: "1m" },
        { type: "month", count: 1, text: "3m" },
        { type: "month", count: 1, text: "6m" },
        { type: "ytd", text: "YTD", title: "View year to date" },
        { type: "year", count: 1, text: "1y" },
        { type: "all", text: "All" },
      ],
      inputEnabled: true,
    },

    title: {
      text: `${ticker} Historical`,
    },
    subtitle: {
      text: "With SMA and Volume by Price technical indicators",
    },
    xAxis: {
      type: "datetime",
      labels: {
        format: "{value: %e %b}",
      },
    },
    yAxis: [
      {
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "OHLC",
        },
        height: "60%",
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
      {
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "Volume",
        },
        top: "65%",
        height: "35%",
        offset: 0,
        lineWidth: 2,
      },
    ],
    series: [
      {
        type: "candlestick",
        name: ticker,
        id: `${ticker}-ohlc`, // unique id for ohlc series
        zIndex: 2,
        data: ohlc,
      },
      {
        type: "column",
        name: "Volume",
        id: "volume",
        data: volume,
        yAxis: 1,
      },
      {
        type: "vbp",
        linkedTo: `${ticker}-ohlc`, // linking to ohlc series
        params: { volumeSeriesID: "volume" },
        dataLabels: { enabled: false },
        zoneLines: { enabled: false },
      },
      {
        type: "sma",
        linkedTo: `${ticker}-ohlc`, // linking to ohlc series
        zIndex: 1,
        marker: { enabled: false },
      },
    ],
  };

  return loadingState ? (
    <>
      <HomePage />
      <Spinner />
    </>
  ) : (
    <div>
      <HomePage />
      <div className="container my-5 text-center">
        <div className="row align-items-center">
          <div className="col-4">
            <h2>
              {stockDetails.stock_details.ticker}{" "}
              <i
                className={starFill ? "bi bi-star-fill" : "bi bi-star"}
                style={iconStyle}
                onClick={toggleFill}
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
              {stockQuote.change > 0 ? (
                <IoMdArrowDropup />
              ) : (
                <IoMdArrowDropdown />
              )}
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
                <div className="container">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                      <div className="row text-center">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-sm-12 col-xs-12">
                          <div>
                            <b>High Price : </b>
                            {stockDetails.summary.high_price}
                          </div>
                          <div>
                            <b>Low Price : </b>
                            {stockDetails.summary.low_price}
                          </div>
                          <div>
                            <b>Open Price : </b>
                            {stockDetails.summary.open_price}
                          </div>
                          <div>
                            <b>Prev. Price : </b>
                            {stockDetails.summary.prev_close}
                          </div>
                        </div>
                      </div>
                      <div className="row text-center my-5">
                        <div className="col-12">
                          <h5>
                            <u>About the Company</u>
                          </h5>
                          <div className="my-4">
                            <div>
                              <b>IPO Start Date : </b>
                              {stockDetails.company_details.ipo_start_date}
                            </div>
                            <div className="my-2">
                              <b>Industry : </b>
                              {stockDetails.company_details.industry}
                            </div>
                            <div className="my-2">
                              <b>Webpage : </b>
                              <a
                                href={stockDetails.company_details.webpage}
                                target="_blank"
                              >
                                {stockDetails.company_details.webpage}
                              </a>
                            </div>
                            <div className="my-2">
                              <b>Company Peers : </b>
                            </div>
                            <div className="my-2">
                              {stockDetails.company_details.company_peers.map(
                                (ticker, index) => (
                                  <span key={ticker}>
                                    <Link to={`/search/${ticker}`}>
                                      {ticker}
                                    </Link>
                                    {index <
                                    stockDetails.company_details.company_peers
                                      .length -
                                      1
                                      ? ", "
                                      : ""}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={summaryCharts}
                      />
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="two" index={1}>
                <div className="container my-5">
                  <DisplayNews companyNews={companyNews} />
                </div>
              </TabPanel>
              <TabPanel value="three" index={2}>
                <div className="container">
                  <HighchartsReact
                    highcharts={Highcharts2}
                    constructorType={"stockChart"}
                    options={historicalChart}
                  />
                </div>
              </TabPanel>
              <TabPanel value="four" index={3}>
                <div className="container">
                  <div className="row my-5 text-center mx-5">
                    <div className="col-12 justify-content-center">
                      <h3>Insider Sentiments</h3>
                      <table class="table">
                        <thead>
                          <tr>
                            <th scope="col">
                              {stockDetails.stock_details.name}
                            </th>
                            <th scope="col">MSPR</th>
                            <th scope="col">Change</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope="row">Total</th>
                            <td>{insights.insider_sentiments.total_mspr}</td>
                            <td>{insights.insider_sentiments.total_change}</td>
                          </tr>
                          <tr>
                            <th scope="row">Positive</th>
                            <td>{insights.insider_sentiments.positive_mspr}</td>
                            <td>
                              {insights.insider_sentiments.positive_change}
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">Negative</th>
                            <td>{insights.insider_sentiments.negative_mspr}</td>
                            <td>
                              {insights.insider_sentiments.negative_change}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="row my-5">
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={insightChart}
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={earningsChart}
                      />
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabContext>
          </div>
        </center>
      </div>
    </div>
  );
};

export default SearchDetails;
