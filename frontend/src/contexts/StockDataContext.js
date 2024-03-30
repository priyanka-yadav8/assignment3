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
    // updateStockData,
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
