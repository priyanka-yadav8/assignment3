import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
// import React from "react";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import React, { useEffect, useState } from "react";


const BuyPopup = ({
  close_the_Modal,
  handleSubmit,
  isOpen,
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
            onChange={handleChange}
            value={currentQuantity}
            placeholder="0"
          />
        </Form.Group>
        {currentQuantity * currentPrice >
        wallet ? (
          <p className="text-danger">Not enough money in wallet!</p>
        ) : null}
        {/* {this.state.validationString && <p className='text-danger'>{this.state.validationString}</p>} */}
      </Modal.Body>
      <Modal.Footer>
        <Row>
          <Col>
            <p>
              Total:{" "}
              {currentQuantity
                ? Math.round(
                    currentPrice * currentQuantity * 100
                  ) / 100
                : 0}
            </p>
          </Col>
          <Col>
            {currentQuantity * currentPrice >
              wallet && currentQuantity != 0 ? (
              <Button variant="success" type="submit" disabled>
                Buy
              </Button>
            ) : (
              <Button
                variant="success"
                type="submit"
                onClick={() => {
                  handleSubmit(
                    currentQuantity,
                    currentPrice
                  );
                  close_the_Modal();
                }}
              >
                Buy
              </Button>
            )}
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
};

export default BuyPopup;
