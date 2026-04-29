import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./UX/Home";
import ErrorPage from "./UX/ErrorPage";
import Header from "./UX/Header";
import About from "./UX/About";
import SingleProduct from "./product/singleProduct/SingleProduct";
import Footer from "./UX/Footer";
import SignIn from "./Admin/SignIn";
import SignUp from "./Admin/SignUp";
import AdminDashboard from "./Admin/AdminDashboard";
import UserSignUp from "./users/UserSignUp";
import UserSignIn from "./users/UserSignIn";
import UserDashboard from "./users/UserDashboard";
import Cart from "./orders/Cart";
import AddProducts from "./product/singleProduct/adminProducts/AddProducts";
import UpdateProduct from "./product/singleProduct/adminProducts/UpdateProduct";
import UpdateUser from "./users/UpdateUser";

const Routing = () => {
  return (
    <>
      <BrowserRouter>
        <div className="app-wrapper">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Home Page */}
              <Route path="/" element={<Home />} />
              {/* Individual Products */}
              <Route path="/product/:pid" element={<SingleProduct />} />

              {/* Admin Routes */}
              <Route path="/admin/signin" element={<SignIn />} />
              <Route path="/admin/not-access/signup" element={<SignUp />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route
                path="/admin/dashboard/add-product"
                element={<AddProducts />}
              />
              <Route
                path="/admin/dashboard/update/:pid"
                element={<UpdateProduct />}
              />

              {/* User Routes */}
              <Route path="/users/signup" element={<UserSignUp />} />
              <Route path="/users/signin" element={<UserSignIn />} />
              <Route path="/users/dashboard" element={<UserDashboard />} />
              <Route
                path="/users/dashboard/update/:uid"
                element={<UpdateUser />}
              />

              {/* Cart Details */}
              <Route path="/cart-details" element={<Cart />} />

              {/* About */}
              <Route path="/about" element={<About />} />
              {/* Error Path Setup */}
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
};

export default Routing;
