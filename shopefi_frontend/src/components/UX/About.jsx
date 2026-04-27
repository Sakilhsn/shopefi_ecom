import React from "react";
import { useNavigate } from "react-router-dom";
import img from '../../assets/aboutImage.jpg'

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="container py-5">
      <div className="row justify-content-center text-center">
        <div className="col-lg-8">
          <h1 className="fw-bold text-primary mb-3">About Shopefi</h1>
          <p className="lead text-muted">
            Welcome to <span className="fw-bold">Shopefi</span>, your ultimate destination for seamless online shopping. We bring you the best products at the most affordable prices with a hassle-free shopping experience.
          </p>
        </div>
      </div>
      
      <div className="row mt-5">
        <div className="col-md-6 d-flex align-items-center">
          <img src={img} alt="About Us" className="img-fluid rounded shadow" />
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h3 className="fw-bold text-secondary">Why Choose Us?</h3>
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><i className="fas fa-check-circle text-success me-2"></i> Wide variety of high-quality products</li>
            <li className="list-group-item"><i className="fas fa-check-circle text-success me-2"></i> Secure payment options</li>
            <li className="list-group-item"><i className="fas fa-check-circle text-success me-2"></i> Fast and reliable delivery</li>
            <li className="list-group-item"><i className="fas fa-check-circle text-success me-2"></i> 24/7 Customer support</li>
          </ul>
        </div>
      </div>
      
      <div className="row mt-5 text-center">
        <div className="col">
          <h4 className="fw-bold text-dark">Join us and start shopping smarter today!</h4>
          <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>Shop Now</button>
        </div>
      </div>
    </div>
  );
};

export default About;