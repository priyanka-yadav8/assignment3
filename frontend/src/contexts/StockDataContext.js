import React, { createContext, useContext, useReducer, useState } from "react";

const StockDataContext = createContext();

export const useStockData = () => useContext(StockDataContext);

// export const stockReducer = (state, action) => {
//   if(action.type == "GET_WATCHLIST"){
//     return{
//       portfolio: wnpState.portfolio,
//       watchlist: action.payload,
//       wallet: wnpState.wallet
//     }
//   } else if(action.type == "ADD_WATCHLIST"){
//     return{
//       portfolio: wnpState.portfolio,
//       watchlist: [action.payload, ...wnpState.watchlist],
//       wallet: wnpState.wallet
//     }
//   }
// }

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
  const [historicData, setHistoricData] = useState(null);
  const [ohlc, setOhlc] = useState(null);
  const [volume, setVolume] = useState(null);

  // const [wnpState, dispatch] = useReducer(
  //   appReducer,
  //   {
  //     watchlist : null,
  //     portfolio:null,
  //     wallet:null
  //   }
  // )

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
    historicData,
    setHistoricData,
    ohlc,
    setOhlc,
    volume,
    setVolume,
    // ...wnpState,
    // dispatch
  };

  return (
    <StockDataContext.Provider value={value}>
      {children}
    </StockDataContext.Provider>
  );
};
