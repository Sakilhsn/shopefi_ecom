import React, { useEffect, useState } from "react";
import axios from "axios";
import { BaseUrl } from "../api/ApiPoint";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

const Orders = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("userToken");

  const Ids = localStorage.getItem("user_id");
  const getIds = Ids ? Ids.split(",") : [];
  const userId = getIds[1];

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !userId) {
      navigate("/users/signin");
    } else {
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${BaseUrl}shopefi/orders/show/${userId}`,
        {
          headers: { token },
        }
      );

      console.log("📦 Orders:", response.data);

      setOrders(response.data.orders || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const renderProductDetails = (product) => {
    const discountAmount =
      (product.product_price * product.product_discount) / 100;

    const discountedPrice = product.product_price - discountAmount;

    const cgst = (discountedPrice * 9) / 100;
    const sgst = (discountedPrice * 9) / 100;

    const finalPrice = discountedPrice + cgst + sgst;

    return {
      discountedPrice,
      cgst,
      sgst,
      finalPrice,
    };
  };

  if (loading) {
    return <div className="loading">Loading Orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders-container">
        <div className="empty-orders-box">
          📦 No Orders Found
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2 className="orders-title">📦 My Orders</h2>

      <div className="orders-grid">
        {orders.map((order, index) => (
          <div className="order-box" key={index}>
            <div className="order-header">
              <h3>Order ID: {order.order_id}</h3>
              <p>
                Date:{" "}
                {new Date(order.order_date).toLocaleDateString()}
              </p>
            </div>

            {order.products.map((product, idx) => {
              const { discountedPrice, cgst, sgst, finalPrice } =
                renderProductDetails(product);

              return (
                <div className="order-product" key={idx}>
                  <img
                    src={`${BaseUrl}/${product.product_image}`}
                    alt={product.product_name}
                    className="order-product-img"
                  />

                  <div className="order-details">
                    <h4>{product.product_name}</h4>

                    <p>
                      Original Price: ₹
                      {product.product_price}
                    </p>

                    <p>
                      Discount: {product.product_discount}%
                    </p>

                    <p className="discounted-price">
                      Discounted: ₹
                      {discountedPrice.toFixed(2)}
                    </p>

                    <p>
                      CGST: ₹{cgst.toFixed(2)}
                    </p>

                    <p>
                      SGST: ₹{sgst.toFixed(2)}
                    </p>

                    <p className="final-price">
                      Final Price: ₹
                      {finalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;