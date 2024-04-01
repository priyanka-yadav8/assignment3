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
  const [strongBuy, setStrongBuy] = useState([]);
  const [strongSell, setStrongSell] = useState([]);
  const [buy, setBuy] = useState([]);
  const [sell, setSell] = useState([]);
  const [hold, setHold] = useState([]);
  const [period, setPeriod] = useState([]);
  const [actual, setActual] = useState([]);
  const [estimate, setEstimate] = useState([]);
  const [period2, setPeriod2] = useState([]);
  const [surprise, setSurprise] = useState([]);
  const [hours, setHours] = useState([]);
  const [price, setPrice] = useState([]);
  const [historicData, setHistoricData] = useState(null);
  const [ohlc, setOhlc] = useState([]);
  const [volume, setVolume] = useState([]);
  const [inPortfolio, setInPortfolio] = useState(false);
  const [stockPortfolioData, setStockPortfolioData] = useState(null);
  const [walletAmount, setWalletAmount] = useState(0);

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
    inPortfolio,
    setInPortfolio,
    stockPortfolioData,
    setStockPortfolioData,
    walletAmount,
    setWalletAmount,
    // ...wnpState,
    // dispatch
  };

  return (
    <StockDataContext.Provider value={value}>
      {children}
    </StockDataContext.Provider>
  );
};
