import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

const DisplayNews = ({ companyNews }) => {
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
    <div className="row">
      {companyNews.map((news, index) => (
        <div key={index} className="col-md-6 mb-3">
          <div className="card">
            <div className="row g-0">
              <div className="col-md-4">
              <div style={{ maxWidth: '100%', maxHeight: '100%', width:"100%", overflow: 'hidden', borderRadius: '10px' }}>
                <img src={news.image} alt={news.title} className="img-fluid" />
                </div>
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <p >{news.headline}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      </div>
    
  );
};

export default DisplayNews;
