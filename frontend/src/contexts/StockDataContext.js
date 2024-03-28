import React, { createContext, useContext, useState } from "react";

const StockDataContext = createContext();

export const useStockData = () => useContext(StockDataContext);

export const StockDataProvider = ({ children }) => {
  const [stockDetails, setStockDetails] = useState(null);
  const [stockQuote, setStockQuote] = useState(null);
  const [companyNews, setCompanyNews] = useState(null);
  const [insights, setInsights] = useState(null);
  const [ticker, setTicker] = useState("");

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

    // Fetch and update insights
    const insightsResponse = await fetch(
      "http://localhost:5000/api/stocks/get-insights",
      requestOptions
    );
    const insightsData = await insightsResponse.json();
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
  };

  return (
    <StockDataContext.Provider value={value}>
      {children}
    </StockDataContext.Provider>
  );
};
