import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="container text-center d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="display-1 text-danger fw-bold">404</h1>
      <h2 className="text-dark">Oops! Page Not Found</h2>
      <p className="text-muted">The page you're looking for doesn't exist or has been moved.</p>
      <Link to={"/"} className="btn btn-primary mt-3">
        Go Back Home
      </Link>
    </div>
  );
};

export default ErrorPage;
