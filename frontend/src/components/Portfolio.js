import { Button } from "@mui/base";
import { Card } from "@mui/material";
import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Spinner from "react-bootstrap/esm/Spinner";
import Container from "react-bootstrap/esm/Container";
import { useStockData } from "../contexts/StockDataContext";
import PortfolioStock from "./PortfolioStock";

const Portfolio = () => {
  const [loadState, setLoadState] = useState(true);
  const [doesPortfolioExist, setDoesPortfolioExist] = useState(false);
  const [flag, setFlag] = useState(0);

  // const [watchlist, dispatch] = useStockData();

  const [portfolio, setPortfolio] = useState([]);
  const [wallet, setWallet] = useState([]);

  useEffect(() => {
    const getPortfolio = async () => {
      const portfolioRes = await fetch(
        "http://localhost:5000/api/portfolio/get-portfolio"
      );
      const portfolioData = await portfolioRes.json();
      console.log(portfolioData.portfolio, "dataaaaaaa");
      if (portfolioRes.status == 200) {
        if (portfolioData.portfolio.length == 0) {
          setDoesPortfolioExist(false);
        } else {
          setDoesPortfolioExist(true);
        }

        setPortfolio(portfolioData.portfolio);
      } else {
        setDoesPortfolioExist(false);
      }
      setLoadState(false);
    };

    const getWallet = async () => {
      const walletRes = await fetch(
        "http://localhost:5000/api/wallet/get-wallet"
      );
      const walletData = await walletRes.json();
      if (walletRes.status == 200) {
        setWallet(walletData.wallet);
      }
    };
    getPortfolio();
    getWallet();
    // console.log(wlist, "wlist");
  }, [flag]);

  const sellStock = async (quantity, price, stock) => {
    const new_Wallet = wallet + quantity * price;
    const new_Quantity = stock.quantity - quantity;

    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cash_balance: new_Wallet }),
    };

    const updateWalletRes = await fetch(
      "http://localhost:5000/api/wallet/update-wallet",
      requestOptions
    );
    if (updateWalletRes.status == 200) {
      console.log("wallet update success");
      setWallet(new_Wallet);
    }

    if (new_Quantity != 0) {
      const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: new_Quantity,
          cost_price: stock.cost_price,
        }),
      };
      const portfolioPatchRes = await fetch(
        `http://localhost:5000/api/portfolio/update-portfolio/${stock.ticker}`,
        requestOptions
      );
      const portfolioPatchData = await portfolioPatchRes.data;
      if (portfolioPatchRes.status == 200) {
        let stock_updated = stock;
        stock_updated.quantity = new_Quantity;
        setPortfolio([
          stock_updated,
          ...portfolio.filter((item) => item.ticker !== stock.ticker),
        ]);
        setFlag(flag + 1);
      } else {
        const requestOptions = {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quantity: new_Quantity,
            cost_price: stock.cost_price,
          }),
        };
        const deletePortfolioRes = await fetch(
          `http://localhost:5000/api/portfolio/remove-from-portfolio/${stock.ticker}`,
          requestOptions
        );
        if (deletePortfolioRes == 200) {
          setPortfolio(
            portfolio.filter((item) => item.ticker !== stock.ticker)
          );

          setFlag(flag + 1);
        }
      }
    }
  };

  const buyStock = async (quantity, price, stock) => {
    const new_Wallet = wallet - quantity * price;
    const new_Quantity = Number(stock.quantity) + Number(quantity);
    const new_Cost_Price = (Number(stock.cost_price) + Number(price)) / 2;

    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cash_balance: new_Wallet,
      }),
    };

    const response = await fetch(
      "http://localhost:5000/api/wallet/update-wallet",
      requestOptions
    );
    if (response.status == 200) {
      setWallet(new_Wallet);
    }

    if (new_Quantity != 0) {
      const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: new_Quantity,
          cost_price: new_Cost_Price,
        }),
      };
      const response = await fetch(
        `http://localhost:5000/api/portfolio/update-portfolio/${stock.ticker}`,
        requestOptions
      );
      if (response.status == 200) {
        let updatedStock = stock;
        updatedStock.quantity = new_Quantity;
        updatedStock.cost_price = new_Cost_Price;
        setPortfolio([
          updatedStock,
          ...portfolio.filter((item) => item.ticker !== stock.ticker),
        ]);
      }
    }
  };

  // const deleteWlist = async (ticker) => {
  //   console.log(ticker, "delete");
  //   const requestOptions = {
  //     method: "DELETE",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ symbol: ticker }),
  //   };
  //   const deleteWlistRes = await fetch(
  //     "http://localhost:5000/api/watchlist/remove-from-watchlist",
  //     requestOptions
  //   );

  //   if (deleteWlistRes.status == 200) {
  //     setFlag(flag + 1);
  //     // setWlist([]);
  //   }
  // };

  return (
    <Col xs={12} md={10} lg={8} className="mx-auto">
      <h3 className="my-2">My Portfolio</h3>
      {loadState ? (
        <Spinner />
      ) : (
        <Container>
          <p>Money in Wallet: ${Math.round(wallet * 100) / 100}</p>
          {doesPortfolioExist && portfolio ? (
            <Container>
              {portfolio &&
                portfolio.map((stock) => (
                  <PortfolioStock
                    data={stock}
                    wallet={wallet}
                    buy={(quantity, price) => {
                      buyStock(quantity, price, stock)
                    }}
                    sell={(quantity, price) => {
                      sellStock(quantity, price, stock)
                    }}
                  />
                ))}
            </Container>
          ) : (
            <Card className="bg-light text-center">
              Currently you don't have any stock in your watchlist.
            </Card>
          )}
        </Container>
      )}
    </Col>
  );
};

export default Portfolio;
