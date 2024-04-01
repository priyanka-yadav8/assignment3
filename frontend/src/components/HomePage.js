import React, { useEffect, useState } from "react";
import { useStockData } from "../contexts/StockDataContext";
import { useNavigate, useParams } from "react-router-dom";
import AlertMessages from "./AlertMessages";
import serverUrl from "..";
// import "../App.css";

const HomePage = () => {
  const [tickerSymbol, setTickerSymbol] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [autocompleteSpinner, setAutocompleteSpinner] = useState(false);
  const [loading, setLoading] = useState(false);
  const { ticker, setTicker, isEmpty, setIsEmpty } = useStockData();
  const navigate = useNavigate();
  const { tickerSymbolParam } = useParams();
  const [isTickerEmpty, setIsTickerEmpty] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();
    // setTickerSymbol(tickerSymbol);
    if(!tickerSymbol || tickerSymbol.length == 0){
      setIsTickerEmpty(true);
    } else  {
      navigate(`/search/${tickerSymbol}`);

    }

    // await setTicker(tickerSymbol);
    // await updateStockData(tickerSymbol);
  };

  const handleSearchSelect = async (symbol) => {
    setTickerSymbol(symbol);
    // await setTicker(symbol);

    // await updateStockData(symbol);
    navigate(`/search/${symbol}`);
  };

  useEffect(() => {
    // setTickerSymbol(symbol);
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
          setLoading(true);
          const response = await fetch(
            serverUrl+`stocks/autocomplete/${tickerSymbol}`
          );
          const responseData = await response.json();
          console.log(responseData.results, "response auto");
          setSuggestions(responseData.results || []);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching autocomplete suggestions:", error);
        }
      };
      const timerId = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(timerId);
    } else {
      setSuggestions([]);
    }

    if(tickerSymbol && tickerSymbol.length > 0){
      setIsEmpty(false);
    } 
    // else {
    //   setTickerSymbol("");
    // }
    // setTickerSymbol(tickerSymbolParam);
  }, [tickerSymbol]);

  const navigateBack = () => {
    setTickerSymbol("");
    setTicker("");
    navigate(`/search/home`);
  };

  return (
    <div className="container mt-5">
      {/* Title */}
      <h2 className="text-center mt-5">STOCK SEARCH</h2>

      {/* Search Bar */}
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <form
            className="input-group border rounded-pill border-primary"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              className="form-control autocomplete-input rounded-pill"
              placeholder="Enter stock ticker symbol"
              aria-label="Enter stock ticker symbol"
              value={tickerSymbol}
              onChange={(e) => {
                setIsTickerEmpty(false)
                setTickerSymbol(e.target.value)}}
            />
            {/* <div className="autocomplete-results"> 
              {suggestions.length > 0 && (
                <ul className="list-group autocomplete-results add-scroll ">
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
            </div> */}
            <div className="autocomplete-results">
              <ul className="list-group list-group-flush">
                {loading ? (
                  <li className="list-group-item">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </li>
                ) : (
                  suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="list-group-item"
                      onClick={() => handleSearchSelect(suggestion.symbol)}
                    >
                      {suggestion.symbol} | {suggestion.description}
                    </li>
                  ))
                )}
              </ul>
            </div>

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
      {isTickerEmpty ? 
        <AlertMessages
          isPositive={false}
          isDismissible={true}
          setShow={setIsTickerEmpty}
          message={"Please enter a valid ticker"}
        ></AlertMessages>
       : null
      }
    </div>
  );
};

export default HomePage;
