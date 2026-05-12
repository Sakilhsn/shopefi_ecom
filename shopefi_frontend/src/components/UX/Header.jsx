import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from '../../assets/logo.png';

const Header = () => {
const [isUserLoggedIn, setIsUserLoggedIn] = useState(
  !!localStorage.getItem("userToken")
);
const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
  !!localStorage.getItem("adminToken")
);

  useEffect(()=>{
    const userToken = localStorage.getItem("userToken");
    const adminToken = localStorage.getItem("adminToken");

    setIsAdminLoggedIn(!!adminToken)
    setIsUserLoggedIn(!!userToken)
  },[])


  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user_id");

    // refresh UI
    window.location.reload();
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-sm p-2"
      style={{ background: "linear-gradient(90deg, #ff6f61, #de5d83)" }}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="Shopefi Logo"
            className="me-2 rounded-circle shadow"
            style={{
              height: "45px",
              width: "45px",
              objectFit: "cover",
              border: "2px solid white"
            }}
          />
          <span
            className="text-light"
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              letterSpacing: "0.5px"
            }}
          >
            Shopefi
          </span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <Link className="nav-link text-light fw-semibold px-2" to={isAdminLoggedIn?"/admin/dashboard":"/"}>
              {
                isAdminLoggedIn ? ("Dashboard"):("Home")
              }
              </Link>
            </li>

            {
              isUserLoggedIn && (
                <>
                <li className="nav-item">
              <Link className="nav-link text-light fw-semibold px-2" to="/about">About</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-light fw-semibold px-2" to="/cart-details">
                <i className="fas fa-shopping-basket me-1"></i>Cart
              </Link>
            </li>
            </>
              )
            }

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle text-light fw-semibold px-2"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
              >
                <i className="fas fa-user-circle me-1"></i>Account
              </a>

              <ul className="dropdown-menu dropdown-menu-end bg-light border-0 shadow">

                {!isUserLoggedIn && !isAdminLoggedIn ? (
                  <>
                    <li>
                      <Link className="dropdown-item py-2" to="/users/signin">
                        <i className="fas fa-sign-in-alt me-1"></i>Sign In
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item py-2" to="/users/signup">
                        <i className="fas fa-user-plus me-1"></i>Sign Up
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        className="dropdown-item py-2"
                        to={isAdminLoggedIn ? "/admin/dashboard" : "/users/dashboard"}
                      >
                        <i className="fas fa-user-plus me-1"></i>Profile
                      </Link>
                    </li>
                    <li>
                    {isUserLoggedIn && (
  <Link
    className="dropdown-item py-2"
    to="/users/orders"
  >
    <i className="fas fa-box me-1"></i>
    Orders
  </Link>
)}
</li>

                    <li>
                      <button
                        className="dropdown-item py-2"
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt me-1"></i>Sign Out
                      </button>
                    </li>
                  </>
                )}

              </ul>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;