import React, { createContext, useContext, useState } from "react";

const StockDataContext = createContext();

export const useStockData = () => useContext(StockDataContext);

export const StockDataProvider = ({ children }) => {
  const [stockDetails, setStockDetails] = useState(null);
  const [stockQuote, setStockQuote] = useState(null);
  const [companyNews, setCompanyNews] = useState(null);
  const [insights, setInsights] = useState(null);
  const [ticker, setTicker] = useState("");
  const [strongBuy, setStrongBuy] = useState(null);
  const [strongSell, setStrongSell] = useState(null);
  const [buy, setBuy] = useState(null);
  const [sell, setSell] = useState(null);
  const [hold, setHold] = useState(null);
  const [period, setPeriod] = useState(null);
  const [actual, setActual] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [period2, setPeriod2] = useState(null);
  const [surprise, setSurprise] = useState(null);
  const [hours, setHours] = useState(null);
  const [price, setPrice] = useState(null);

  // Method to update data
  const updateStockData = async (tickerSymbol) => {
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
    const stockDetailsData = await stockDetailsResponse.json();
    const hourly_charts_data = stockDetailsData.hourly_charts_data;
    setHours(hourly_charts_data.map((item) => item.t));
    setPrice(hourly_charts_data.map((item) => item.c));
    setStockDetails(stockDetailsData);

    const stockQuoteResponse = await fetch(
      "http://localhost:5000/api/stocks/get-stock-quote",
      requestOptions
    );
    const stockQuoteData = await stockQuoteResponse.json();
    setStockQuote(stockQuoteData);

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

    setInsights(insightsData);
  };

  const value = {
    ticker,
    setTicker,
    stockDetails,
    setStockDetails,
    companyNews,
    setCompanyNews,
    insights,
    setInsights,
    stockQuote,
    setStockQuote,
    updateStockData,
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
  };

  return (
    <StockDataContext.Provider value={value}>
      {children}
    </StockDataContext.Provider>
  );
};
