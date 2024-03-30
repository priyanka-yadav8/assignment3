import React, { useEffect, useState } from "react";
import { useStockData } from "../contexts/StockDataContext";
import { useNavigate, useParams } from "react-router-dom";

const HomePage = () => {
  const [tickerSymbol, setTickerSymbol] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { updateStockData, ticker, setTicker } = useStockData();
  const navigate = useNavigate();
  const { tickerSymbolParam } = useParams();

  const handleSearch = async (event) => {
    event.preventDefault();
    // setTickerSymbol(tickerSymbol);

    // await setTicker(tickerSymbol);
    // await updateStockData(tickerSymbol);
    navigate(`/search/${tickerSymbol}`);
  };

  const handleSearchSelect = async (symbol) => {
    setTickerSymbol(symbol);
    // await setTicker(symbol);

    // await updateStockData(symbol);
    navigate(`/search/${symbol}`);
  };

  useEffect(() => {
    setTickerSymbol(tickerSymbolParam);
  }, [tickerSymbolParam]);

  useEffect(() => {
    if (
      tickerSymbol &&
      tickerSymbol.length > 0 &&
      tickerSymbol != tickerSymbolParam
    ) {
      console.log("Ticker Symbol" + tickerSymbol);
      console.log("Ticker Symbol Param" + tickerSymbolParam);
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/stocks/autocomplete/${tickerSymbol}`
          );
          const responseData = await response.json();
          console.log(responseData.results, "response auto");
          setSuggestions(responseData.results || []);
        } catch (error) {
          console.error("Error fetching autocomplete suggestions:", error);
        }
      };
      const timerId = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(timerId);
    } else {
      setSuggestions([]);
    }
    // setTickerSymbol(tickerSymbolParam);
  }, [tickerSymbol]);

  const navigateBack = () =>{
    setTickerSymbol("");
    setTicker("");
    navigate(`/search/home`);
  }

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
              className="form-control rounded autocomplete-input"
              placeholder="Enter stock ticker symbol"
              aria-label="Enter stock ticker symbol"
              value={tickerSymbol}
              onChange={(e) => setTickerSymbol(e.target.value)}
            />
            {suggestions.length > 0 && (
              <ul className="list-group autocomplete-results">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="list-group-item"
                    onClick={() => handleSearchSelect(suggestion.symbol)}
                  >
                    {suggestion.symbol} | {suggestion.description}
                  </li>
                ))}
              </ul>
            )}
            <button className="btn" type="submit">
              <i className="bi bi-search"></i>
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => navigateBack()}
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
