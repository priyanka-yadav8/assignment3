import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/button";
import React, { useState } from "react";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

const SellPopup = ({
  close_the_Modal,
  isOpen,
  handleSubmit,
  currentPrice,
  stockData,
  wallet,
}) => {
  const [currentQuantity, setCurrentQuantity] = useState(null);
  const handleChange = (e) => {
    setCurrentQuantity(e.target.value);
  };

  return (
    <Modal show={isOpen} onHide={close_the_Modal}>
      <Modal.Header closeButton>
        <Modal.Title>{stockData.ticker}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <p>Current Price: {currentPrice}</p>
          <p>Money in Wallet: ${Math.round(100 * wallet) / 100}</p>
          <Form.Label>Quantity: </Form.Label>
          <Form.Control
            type="number"
            onChange={(e) => {
              handleChange(e)
            }}
            value={currentQuantity}
            placeholder="0"
          />
        </Form.Group>
        {currentQuantity > stockData.quantity ? (
          <p className="text-danger">
            You cannot sell stocks that you dont have
          </p>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        <Row>
          <Col>
            <p>
              Total:{" "}
              {currentQuantity
                ? Math.round(currentPrice * currentQuantity * 100) / 100
                : 0}
            </p>
          </Col>
          <Col>
            {currentQuantity > stockData.quantity && currentQuantity != 0 ? (
              <Button variant="success" type="submit" disabled>
                Sell
              </Button>
            ) : (
              <Button
                variant="success"
                type="submit"
                onClick={() => {
                  handleSubmit(currentQuantity, currentPrice);
                  close_the_Modal();
                }}
              >
                Sell
              </Button>
            )}
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
};

export default SellPopup;
