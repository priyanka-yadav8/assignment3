import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { MdClear } from "react-icons/md";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import serverUrl from "..";

const WatchlistStock = ({ data, deleteFunc }) => {

    const [currentPrice, setCurrentPrice] = useState(null)
    const [change, setChange] = useState(null)
    const [pChange, setPChange] = useState(null)
    const [changePos, setChangePos] = useState(null)

    const navigate = useNavigate()

    

    useEffect(() => {
        console.log(data,"data in list");
        const fetchStockQuote = async () => {
            console.log(data,"data in list");

            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ symbol: data.ticker }),
              };
            const response = await fetch(serverUrl+'stocks/get-stock-quote/', requestOptions);
            const result = await response.json()

            if(response.ok){
                
                if(result.change >= 0){
                    setChangePos(true)
                } else {
                    setChangePos(false)
                }
                setCurrentPrice(Math.round(result.last_price * 100) / 100)
                setChange(Math.round(result.change * 100) / 100)
                setPChange(Math.round(result.change_percentage * 100) / 100)
            }
        }

        fetchStockQuote()

        const interval = setInterval(fetchStockQuote, 15000)
        
        return () => clearInterval(interval)
    }, [])

    

  return (
    <Card className="my-1" onClick={(e) => {
        if(e.defaultPrevented){
          return
        }
        navigate('/search/'+data.ticker)
      }}>
      <Card.Body>
        <Col>
          <Row>
            <Col xs="auto">
              <Button variant="link" className="text-left text-secondary" onClick={deleteFunc}>
                <MdClear />
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <div>
                <h3>{data.ticker}</h3>
                <p>{data.name}</p>
              </div>
            </Col>
            <Col style={{color: changePos ? "green" : "red"}}>
                <p>{currentPrice}</p>
                <span>{changePos ? <IoMdArrowDropup/> : <IoMdArrowDropdown/>}{" "+change+" ("+pChange+"%)"}</span>
            </Col>
          </Row>
        </Col>
      </Card.Body>
    </Card>
  );
};

export default WatchlistStock;