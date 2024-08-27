import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap';


export default function Services() {
    const services = [
        {
          title: 'Web Development',
          description: 'Build and maintain websites with the latest technologies and best practices.',
          image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          title: 'API Development',
          description: 'Create robust and scalable APIs using Node.js and Express.',
          image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          title: 'Database Management',
          description: 'Design and manage databases with MongoDB and SQL Server.',
          image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          title: 'Cloud Services',
          description: 'Deploy and manage applications on AWS, Azure, or other cloud platforms.',
          image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=600'
        }
      ];
      
  return (
    <>
     <div id="carouselExampleIndicators" className="carousel slide">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=600" className="d-block w-100" alt="A" style={{ height: "auto", objectFit: "cover" }} />
            <div className="carousel-caption d-flex justify-content-center align-items-center" style={{backgroundColor: "rgba(0, 0, 0, 0.5)", color: "white", padding: "20px",    borderRadius: "10px", height: "100%", width: "100%", top: "0", left: "0", bottom: "0", right: "0"}}>
              <h1 className="text-center">Services</h1>
            </div>
          </div>
        </div>
      </div>
      <Container className="my-5">
      <h1 className="text-center mb-4">Our Services</h1>
      <Row>
        {services.map((service, index) => (
          <Col md={6} lg={3} className="mb-4" key={index}>
            <Card>
              <Card.Img variant="top" src={service.image} />
              <Card.Body>
                <Card.Title>{service.title}</Card.Title>
                <Card.Text>{service.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    </>
  )
}
