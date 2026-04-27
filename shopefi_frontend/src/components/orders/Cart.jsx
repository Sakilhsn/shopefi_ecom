import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../api/ApiPoint";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const Ids = localStorage.getItem("user_id");
  const getIds = Ids ? Ids.split(",") : [];
  const userId = getIds[1];

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (!token || !userId) {
      navigate("/users/signin");
    } else {
      fetchCartDetails();
    }
  }, [token, userId]);

  const fetchCartDetails = async () => {
    try {
      const response = await axios.get(`${BaseUrl}shopefi/orders/show/${userId}`, {
        headers: { token: token },
      });
      const fetchedOrders = response.data.orders;
      setOrders(fetchedOrders);
      calculateTotalAmount(fetchedOrders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart details:", error);
      setError("Failed to load cart details");
      setLoading(false);
    }
  };

  const calculateTotalAmount = (orders) => {
    let total = 0;
    orders.forEach((order) => {
      order.products.forEach((product) => {
        const discountAmount = (product.product_price * product.product_discount) / 100;
        const discountedPrice = product.product_price - discountAmount;
        const cgst = (discountedPrice * 9) / 100;
        const sgst = (discountedPrice * 9) / 100;
        total += discountedPrice + cgst + sgst;
      });
    });
    setTotalAmount(total);
  };

  const deleteOrder = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BaseUrl}shopefi/orders/delete/${orderId}`, {
        headers: { token: token },
      });
      alert("Order deleted successfully!");
      fetchCartDetails();
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order!");
    }
  };

  const placeOrder = () => {
    alert(`🎉 Order Placed Successfully! Total Amount: ₹${Math.ceil(totalAmount.toFixed(2))}`);
    // Here you can call an API to finalize the order
  };

  if (loading) return <div className="loading">Loading your cart...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (orders.length === 0) return <div className="empty-cart">Your cart is empty!</div>;

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 Your Shopping Cart</h2>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product Name</th>
            <th>Original Price</th>
            <th>Discount</th>
            <th>Discounted Price</th>
            <th>CGST (9%)</th>
            <th>SGST (9%)</th>
            <th>Final Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) =>
            order.products.map((product, idx) => {
              const discountAmount = (product.product_price * product.product_discount) / 100;
              const discountedPrice = product.product_price - discountAmount;
              const cgst = (discountedPrice * 9) / 100;
              const sgst = (discountedPrice * 9) / 100;
              const finalPrice = discountedPrice + cgst + sgst;

              return (
                <tr key={`${index}-${idx}`}>
                  <td>
                    <img src={`${BaseUrl}/${product.product_image}`} alt={product.product_name} className="cart-product-img" />
                  </td>
                  <td>{product.product_name}</td>
                  <td>₹{product.product_price.toFixed(2)}</td>
                  <td>{product.product_discount}%</td>
                  <td className="discounted-price">₹{discountedPrice.toFixed(2)}</td>
                  <td>₹{cgst.toFixed(2)}</td>
                  <td>₹{sgst.toFixed(2)}</td>
                  <td className="final-price">₹{finalPrice.toFixed(2)}</td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteOrder(order.order_id)}>🗑 Delete</button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div className="order-summary">
        <h3>Total Amount: ₹{Math.ceil(totalAmount.toFixed(2))}</h3>
        <button className="place-order-btn" onClick={placeOrder}>✅ Place Order</button>
      </div>
    </div>
  );
};

export default Cart;
