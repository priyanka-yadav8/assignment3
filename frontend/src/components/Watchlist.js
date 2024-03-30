import { Button } from "@mui/base";
import { Card } from "@mui/material";
import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Spinner from "react-bootstrap/esm/Spinner";
import Container from "react-bootstrap/esm/Container";
import { useStockData } from "../contexts/StockDataContext";
import WatchlistStock from "./WatchlistStock";

const Watchlist = () => {
  const [loadState, setLoadState] = useState(true);
  const [doesWatchlistExist, setDoesWatchlistExist] = useState(false);
  const [flag, setFlag] = useState(0);

  // const [watchlist, dispatch] = useStockData();

  const [wlist, setWlist] = useState([]);
  
  useEffect(() => {
    const getWatchlist = async () => {
    const watchlistRes = await fetch(
      "http://localhost:5000/api/watchlist/get-watchlist"
    );
    const watchlistData = await watchlistRes.json();
    console.log(watchlistData.watchlist, "dataaaaaaa");
    if (watchlistRes.status == 200) {
      if (watchlistData.watchlist.length == 0) {
        setDoesWatchlistExist(false);
      } else {
        setDoesWatchlistExist(true);
      }

      setWlist(watchlistData.watchlist);
    } else {
      setDoesWatchlistExist(false);
    }
    setLoadState(false);
  };
    getWatchlist();
    console.log(wlist, "wlist");
  }, [flag]);

  const deleteWlist = async (ticker) => {
    console.log(ticker, "delete");
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol: ticker }),
    };
    const deleteWlistRes = await fetch(
      "http://localhost:5000/api/watchlist/remove-from-watchlist",
      requestOptions
    );

    if (deleteWlistRes.status == 200) {
      setFlag(flag + 1);
      // setWlist([]);
    }
  };

  return (
    <Col xs={12} md={8} lg={8} className="mx-auto">
      <h3 className="my-2">My Watchlist</h3>
      {loadState ? (
        <Spinner />
      ) : doesWatchlistExist && wlist ? (
        <Container>
          {wlist &&
            wlist.map((item) => (
              <WatchlistStock
                data={item}
                deleteFunc={(e) => {
                  e.preventDefault();
                  deleteWlist(item.ticker);
                }}
              />
            ))}
        </Container>
      ) : (
        <Card className="bg-light text-center">
          Currently you don't have any stock in your watchlist.
        </Card>
      )}
    </Col>
  );
};

export default Watchlist;
