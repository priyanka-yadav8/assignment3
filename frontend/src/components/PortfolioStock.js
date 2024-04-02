import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { MdClear } from "react-icons/md";
import Container from "react-bootstrap/esm/Container";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SellPopup from "./SellPopup";
import BuyPopup from "./BuyPopup";
import serverUrl from "..";

const PortfolioStock = ({ data, wallet, buy, sell }) => {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [change, setChange] = useState(null);
  const [pChange, setPChange] = useState(null);
  const [changePos, setChangePos] = useState(null);

  const [openSellPopup, setOpenSellPopup] = useState(false);
  const [openBuyPopup, setOpenBuyPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // console.log(data, "data in list");
    const fetchStockQuote = async () => {
      console.log(data, "data in list");

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: data.ticker }),
      };
      const response = await fetch(
        serverUrl + "stocks/get-stock-quote/",
        requestOptions
      );
      const result = await response.json();

      if (response.ok) {
        if (result.change >= 0) {
          setChangePos(true);
        } else {
          setChangePos(false);
        }
        setCurrentPrice(Math.round(result.last_price * 100) / 100);
        setChange(Math.round(result.change * 100) / 100);
        setPChange(Math.round(result.change_percentage * 100) / 100);
      }
    };

    fetchStockQuote();

    const interval = setInterval(fetchStockQuote, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="my-2">
      <Card.Header
        onClick={(e) => {
          if (e.defaultPrevented) {
            return;
          }
          navigate(`/search/${data.ticker}`);
        }}
      >
        <b>{data.ticker}</b>
        <span>{" " + data.name}</span>
      </Card.Header>
      <Card.Body>
        <Col>
          <Row>
            <Col xs={6} md={3}>
              <div>
                <p>Quantity:</p>
                <p>Avg. Cost / Share:</p>
                <p>Total Cost:</p>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <p>{data.quantity}</p>
              <p>{Math.round(data.cost_price * 100) / 100}</p>
              <p>{Math.round(data.quantity * data.cost_price * 100) / 100}</p>
            </Col>
            <Col xs={6} md={3}>
              <div>
                <p>Change:</p>
                <p>Current Price:</p>
                <p>Market Value:</p>
              </div>
            </Col>
            <Col xs={6} md={3} style={{ color: changePos ? "green" : "red" }}>
              <p>
                {changePos ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                {" " + change}
              </p>
              <p>{currentPrice}</p>
              <p>{Math.round(currentPrice * data.quantity * 100) / 100}</p>
            </Col>
          </Row>
        </Col>

        {openSellPopup ? (
          <SellPopup
            close_the_Modal={() => setOpenSellPopup(false)}
            isOpen={openSellPopup}
            handleSubmit={(quantity, price) => {
              sell(quantity, price, data);
            }}
            currentPrice={currentPrice}
            stockData={data}
            wallet={wallet}
          />
        ) : null}

        {openBuyPopup ? (
          <BuyPopup
            close_the_Modal={() => setOpenBuyPopup(false)}
            isOpen={openBuyPopup}
            handleSubmit={(quantity, price) => {
              buy(quantity, price, data);
            }}
            currentPrice={currentPrice}
            stockData={data}
            wallet={wallet}
          />
        ) : null}
      </Card.Body>
      <Card.Footer>
        <Row className="bg-light">
          <Col xs={2} lg={1}>
            <Container>
              <Button
                variant="primary"
                className="text-left text-secondary text-white"
                onClick={() => setOpenBuyPopup(true)}
              >
                Buy
              </Button>
            </Container>
          </Col>
          <Col xs={2} lg={1}>
            <Container>
              <Button
                variant="danger"
                className="text-left text-secondary text-white"
                onClick={() => setOpenSellPopup(true)}
              >
                Sell
              </Button>
            </Container>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default PortfolioStock;
