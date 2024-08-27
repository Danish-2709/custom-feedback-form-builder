import React from 'react'

export default function Footer() {
  return (
    <>
    <footer className="bg-light text-center text-lg-start">
      <div className="container p-4">
        <div className="row">
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">About Us</h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla a ultricies pharetra.
            </p>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-dark">Home</a></li>
              <li><a href="/About" className="text-dark">About</a></li>
              <li><a href="/Services" className="text-dark">Services</a></li>
              <li><a href="/Contact" className="text-dark">Contact</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Contact Us</h5>
            <p>Email:  <a href={`mailto:ahmadshareef200@gmail.com`}>ahmadshareef200@gmail.com</a></p>
            <p>Phone: <a href={`tel:+919140483492`}>+91 9140483492</a></p>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Follow Us</h5>
            <a href="https://facebook.com" className="btn btn-link text-dark" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://twitter.com" className="btn btn-link text-dark" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://instagram.com" className="btn btn-link text-dark" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
      </div>

      <div className="bg-dark text-white text-center p-3">
        <p>&copy; 2024 Danish Ahmad. All rights reserved.</p>
      </div>
    </footer>
    </>
  )
}
