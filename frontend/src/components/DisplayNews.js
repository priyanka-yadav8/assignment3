import React from "react";
import {useState} from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareFacebook } from "@fortawesome/free-brands-svg-icons";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { Button, Form, Modal} from 'react-bootstrap';
import ClearIcon from '@mui/icons-material/Clear';

const DisplayNews = ({ companyNews }) => {
  const [showNewsDataModal, setShowNewsDataModal] = useState(false);
  const [modalNews, setModalNews] = useState(null);
  const handleNewsModalClose = () => {
    setShowNewsDataModal(false);
  }
  const showModal = (news) => {
    setModalNews(news);
    setShowNewsDataModal(true);
  }
  return (
    // <Row xs={1} md={2} className="g-4">
    //   {companyNews.map((news, index) => (
    //     <Col key={index}>
    //       <Card>
    //         <Card.Body>
    //           {/* <div className='row'>
    //             <div className='col-lg-3 col-md-3 col-sm-12 col-xs-12'>
    //                 <Image src={news.image} style={{ maxWidth: '250px', minWidth: '100px'}}></Image>
    //             </div>
    //             <div className='col-lg-8 col-md-8 col-sm-12 col-xs-12 mx-1'>
    //                 <p>{news.headline}</p>
    //             </div>
    //         </div> */}
    //           {/* <div className="d-flex flex-column flex-md-row align-items-start">
    //             <div className="flex-shrink-0">
    //               <Image
    //                 style={{ width: 'auto', maxWidth: '250px', minWidth: '50px', marginRight: '20px' }}
    //                 src={news.image}
    //               />
    //             </div>
    //             <div className="flex-grow-1">
    //               <Card.Title>{news.headline}</Card.Title>

    //             </div>
    //           </div> */}
    //           <div key={index} className="col-md-6 mb-3">
    //             <div className="card " >
    //               <div className="row g-0">
    //                 <div className="col-md-4">
    //                   <div
    //                     style={{
    //                       maxWidth: "100%",
    //                       maxHeight: "100%",
    //                       width: "100%",
    //                       overflow: "hidden",
    //                       borderRadius: "10px",
    //                     }}
    //                   >
    //                     <img
    //                       src={news.image}
    //                       alt={news.title}
    //                       className="img-fluid"
    //                     />
    //                   </div>
    //                 </div>
    //                 <div className="col-md-8">
    //                   <div className="card-body">
    //                     <p>{news.headline}</p>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </Card.Body>
    //       </Card>
    //     </Col>
    //   ))}
    // </Row>
    <>
      <div className="row">
        {companyNews.map((news, index) => (
          <div key={index} className="col-md-6 mb-3" onClick={(e)=>showModal(news)}>
            <div className="card">
              <div className="row g-0">
                <div className="col-md-4">
                  <div
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      width: "100%",
                      overflow: "hidden",
                      borderRadius: "10px",
                    }}
                  >
                    <img
                      src={news.image}
                      alt={news.title}
                      className="img-fluid"
                    />
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <p>{news.headline}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showNewsDataModal} onHide={handleNewsModalClose}>
        <Modal.Header>
          <Modal.Title>
            <Form>
              <Form.Group>
                <span style={{ fontSize: "30px" }}>
                  {modalNews && modalNews.source}
                </span>
              </Form.Group>
              <Form.Group>
                {modalNews && (
                  <span style={{ fontWeight: "normal", fontSize: "15px" }}>
                   {modalNews.datetime}

                  </span>
                )}
              </Form.Group>
            </Form>
          </Modal.Title>
          <Button variant="btn-primary-outline">
            <ClearIcon onClick={handleNewsModalClose} />
          </Button>
        </Modal.Header>
        <Modal.Body>
          {/* Modal body content here */}
          <Form.Group>
            <b>{modalNews && modalNews.headline}</b>
          </Form.Group>

          {modalNews && modalNews.summary}

          <Form.Group>
            For more details click{" "}
            <a target="_blank" href={`${modalNews && modalNews.url}`}>
              Here
            </a>
          </Form.Group>
          <div style={{ border: "0.2px solid gray", padding: "2%" }}>
            <div> Share </div>
            <div style={{ display: "inline-block" }}>
              <Button
                variant="btn-primary-outline"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  modalNews && modalNews.headline
                )}+ ' ' + ${encodeURIComponent(
                  modalNews && modalNews.url
                )}`}
                target="_blank"
                style={{ verticalAlign: "middle" }}
              >
                <FontAwesomeIcon
                  icon={faXTwitter}
                  style={{ fontSize: "2.2em" }}
                />
              </Button>
              <span
                className="fb-share-button"
                data-href="https://developers.facebook.com/docs/plugins/"
                data-layout=""
                data-size=""
              >
                <a
                  target="_blank"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    modalNews && modalNews.url
                  )}`}
                  className="fb-xfbml-parse-ignore"
                  style={{ fontSize: "2.2em", verticalAlign: "middle" }}
                >
                  <FontAwesomeIcon
                    icon={faSquareFacebook}
                    style={{ fontSize: "inherit" }}
                  />
                </a>
              </span>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DisplayNews;
