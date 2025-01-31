import React from "react";

export default function About() {
  return (
    <>
      <div id="carouselExampleIndicators" className="carousel slide">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="https://images.pexels.com/photos/599982/pexels-photo-599982.jpeg?auto=compress&cs=tinysrgb&w=600" className="d-block w-100" alt="A" style={{ height: "auto", objectFit: "cover" }} />
            <div className="carousel-caption d-flex justify-content-center align-items-center" style={{backgroundColor: "rgba(0, 0, 0, 0.5)", color: "white", padding: "20px",    borderRadius: "10px", height: "100%", width: "100%", top: "0", left: "0", bottom: "0", right: "0"}}>
              <h1 className="text-center">About Us</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-5">
        <h1 className="text-center mb-4">About Us</h1>
        <div className="row">
          <div className="col-md-6">
            <h2 className="mb-3">Danish Ahmad</h2>
            <p>
              Hi, I'm Danish Ahmad, a passionate Full-Stack Engineer
              specializing in the MERN stack (MongoDB, Express.js, React, and
              Node.js). With a strong background in both front-end and back-end
              development, I create robust and scalable web applications that
              deliver exceptional user experiences.
            </p>
            <p>
              My journey as a developer began with a fascination for technology
              and problem-solving. Over the years, I've honed my skills in
              various technologies and frameworks, and I've successfully
              completed numerous projects that showcase my expertise in building
              dynamic and interactive web solutions.
            </p>
            <p>
              I am committed to continuous learning and staying updated with the
              latest trends in the tech industry. My goal is to leverage my
              skills to solve complex problems and contribute to innovative
              projects that make a difference.
            </p>
            <p>
              Feel free to reach out if you have any questions or if you're
              interested in collaborating on exciting projects. You can contact
              me at:{" "}
              <a href="mailto:ahmadshareef200@gmail.com">
                ahmadshareef200@gmail.com
              </a>
              .
            </p>
          </div>
          <div className="col-md-6">
            <img
              src="https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Danish Ahmad"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </div>
    </>
  );
}
