import { Button } from "@mui/base";
import { Card } from "@mui/material";
import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/esm/Alert";
import Col from "react-bootstrap/esm/Col";
import Spinner from "react-bootstrap/esm/Spinner";
import Container from "react-bootstrap/esm/Container";
import { useStockData } from "../contexts/StockDataContext";
import PortfolioStock from "./PortfolioStock";
import serverUrl from "..";
import AlertMessages from "./AlertMessages";

const Portfolio = () => {
  const [loadState, setLoadState] = useState(true);
  const [doesPortfolioExist, setDoesPortfolioExist] = useState(false);
  const [flag, setFlag] = useState(0);
  const [buyModal, setBuyModal] = useState(false);
  const [sellModal, setSellModal] = useState(false);
  const [companyTraded, setCompanyTraded] = useState("");

  // const [watchlist, dispatch] = useStockData();

  const [portfolio, setPortfolio] = useState([]);
  const [wallet, setWallet] = useState([]);

  useEffect(() => {
    const getPortfolio = async () => {
      const portfolioRes = await fetch(serverUrl + "portfolio/get-portfolio");
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
      const walletRes = await fetch(serverUrl + "wallet/get-wallet");
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
      serverUrl + "wallet/update-wallet",
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
        serverUrl + `portfolio/update-portfolio/${stock.ticker}`,
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
      }
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
        serverUrl + `portfolio/remove-from-portfolio/${stock.ticker}`,
        requestOptions
      );
      if (deletePortfolioRes == 200) {
        setPortfolio(portfolio.filter((item) => item.ticker !== stock.ticker));

        setFlag(flag + 1);
      }
    }
    setCompanyTraded(stock.ticker);
    setBuyModal(false);
    setSellModal(true);
    const interval = setInterval(() => {
      setSellModal(false);
    }, 4000);
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
      serverUrl + "wallet/update-wallet",
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
        serverUrl + `portfolio/update-portfolio/${stock.ticker}`,
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
    setCompanyTraded(stock.ticker);
    setBuyModal(true);
    setSellModal(false);
    const interval = setInterval(() => {
      setBuyModal(false);
    }, 4000);
  };

  return (
    <Col xs={12} md={10} lg={8} className="mx-auto mt-5">
      <h3 className="my-2">My Portfolio</h3>
      {loadState ? (
        <Spinner />
      ) : (
        <Container>
          <p>Money in Wallet: ${Math.round(wallet * 100) / 100}</p>
          {buyModal ? (
            <AlertMessages
              isPositive={true}
              isDismissible={true}
              setShow={setBuyModal}
              message={`${companyTraded} bought successfully`}
            ></AlertMessages>
          ) : null}
          {sellModal ? (
            <AlertMessages
              isPositive={false}
              isDismissible={true}
              setShow={setSellModal}
              message={`${companyTraded} sold successfully`}
            ></AlertMessages>
          ) : null}
          {doesPortfolioExist && portfolio ? (
            <Container>
              {portfolio &&
                portfolio.map((stock) => (
                  <PortfolioStock
                    data={stock}
                    wallet={wallet}
                    buy={(quantity, price) => {
                      buyStock(quantity, price, stock);
                    }}
                    sell={(quantity, price) => {
                      sellStock(quantity, price, stock);
                    }}
                  />
                ))}
            </Container>
          ) : (
            <Alert style={{ backgroundColor: "#fffec8" }}>
              <div className="text-center">
                Currently you don't have any stock.
              </div>
            </Alert>
          )}
        </Container>
      )}
    </Col>
  );
};

export default Portfolio;
