import React from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

export default function Contact() {
  return (
    <>
      <div id="carouselExampleIndicators" className="carousel slide">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="https://images.pexels.com/photos/821754/pexels-photo-821754.jpeg?auto=compress&cs=tinysrgb&w=600" className="d-block w-100" alt="A" style={{ height: "auto", objectFit: "cover" }} />
            <div className="carousel-caption d-flex justify-content-center align-items-center" style={{backgroundColor: "rgba(0, 0, 0, 0.5)", color: "white", padding: "20px",    borderRadius: "10px", height: "100%", width: "100%", top: "0", left: "0", bottom: "0", right: "0"}}>
              <h1 className="text-center">Contac Us</h1>
            </div>
          </div>
        </div>
      </div>
      <Container className="my-5">
      <h1 className="text-center mb-4">Contact Us</h1>
      <Row>
        <Col md={6}>
          <h3>Get in Touch</h3>
          <p>If you have any questions or need further information, feel free to reach out to us using the contact details below or fill out the contact form.</p>
          <ul className="list-unstyled">
            <li><strong>Email:</strong> <a href={`mailto:ahmadshareef200@gmail.com`}>ahmadshareef200@gmail.com</a></li>
            <li><strong>Phone:</strong> <a href={`tel:+919140483492`}>+91 9140483492</a></li>
            <li><strong>Address:</strong> Kanpur, Uttar Pradesh, India</li>
          </ul>
        </Col>
        <Col md={6}>
          <h3>Contact Form</h3>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Your Name" />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Your Email" />
            </Form.Group>
            <Form.Group controlId="formMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows={4} placeholder="Your Message" />
            </Form.Group>
            <Button className='my-2' variant="primary" type="submit">
              Send Message
            </Button>
          </Form>
        </Col>
      </Row>
      </Container>
    </>
  )
}
