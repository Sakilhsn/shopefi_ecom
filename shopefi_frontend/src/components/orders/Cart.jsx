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
console.log("🔑 User ID:", userId);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1040);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1040);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      const fetchedOrders = response.data.orders || [];
      console.log("Fetched Orders:", fetchedOrders);
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
const getProductIds = () => {
  let ids = [];

  orders.forEach(order => {
    order.products.forEach(product => {
      if (product.product_id) {
        ids.push(product.product_id);
      } else {
        console.warn("⚠️ Missing product_id:", product);
      }
    });
  });

  console.log("✅ Final product_ids:", ids);
  return ids;
};
  // const placeOrder = () => {
  //   alert(`🎉 Order Placed Successfully! Total Amount: ₹${Math.ceil(totalAmount.toFixed(2))}`);
  //   // Here you can call an API to finalize the order
  // };
const placeOrder = async () => {
  try {
    const product_ids = getProductIds();
 const userIdForOrder = getIds[0];
 console.log("📦 Placing order for products:", product_ids, "User ID:", userIdForOrder);
    // ✅ STEP 1: Create Razorpay Order (YOUR API)
    const res = await axios.post(
      `http://localhost:4000/shopefi/orders/create-order/${userIdForOrder}`,
      { product_ids },
      { headers: { token } }
    );

    const order = res.data.razorOrder;

    console.log("🧾 Razor Order:", order);

    // ✅ STEP 2: Open Razorpay
    const options = {
      key: "rzp_test_SlLkKLlxRUYHSp",
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,

      name: "Shopefi",
      description: "Order Payment",

      handler: async function (response) {
        console.log("✅ Payment Success:", response);

        // ✅ STEP 3: Verify Payment
        const verifyRes = await axios.post(
          `http://localhost:4000/shopefi/orders/verify-payment`,
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            product_ids,
            user_id: userIdForOrder
          },
          { headers: { token } }
        );

        if (verifyRes.data.success) {
          alert("🎉 Payment Successful & Order Placed!");
          fetchCartDetails(); // refresh cart
        } else {
          alert("❌ Payment verification failed");
        }
      },

      prefill: {
        name: "Alex Swift",
        email: "alex@gmail.com",
        contact: "8875674555",
      },

      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error("❌ Payment Error:", err);
    alert("Payment failed. Try again.");
  }
};
useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);
}, []);
  const renderProductDetails = (product, orderId) => {
    const discountAmount = (product.product_price * product.product_discount) / 100;
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

  if (loading) return <div className="loading">Loading your cart...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (orders.length === 0) {
    return (
      <div className="empty-cart-container">
        <div className="empty-cart-box">🛒 Your cart is empty!</div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 Your Shopping Cart</h2>

      {isDesktop ? (
        // ✅ TABLE VIEW for Desktop (>1040px)
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
                const { discountedPrice, cgst, sgst, finalPrice } = renderProductDetails(product, order.order_id);
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
      ) : (
        // ✅ CARD VIEW for Mobile (≤1040px)
        <div className="cart-cards">
          {orders.map((order, index) =>
            order.products.map((product, idx) => {
              const { discountedPrice, cgst, sgst, finalPrice } = renderProductDetails(product, order.order_id);
              return (
                <div className="cart-card" key={`${index}-${idx}`}>
                  <img src={`${BaseUrl}/${product.product_image}`} alt={product.product_name} className="cart-card-img" />
                  <div className="cart-card-details">
                    <h3 className="cart-card-title">{product.product_name}</h3>
                    <p><strong>Original Price:</strong> ₹{product.product_price.toFixed(2)}</p>
                    <p><strong>Discount:</strong> {product.product_discount}%</p>
                    <p><strong>Discounted Price:</strong> <span className="discounted-price">₹{discountedPrice.toFixed(2)}</span></p>
                    <p><strong>CGST (9%):</strong> ₹{cgst.toFixed(2)}</p>
                    <p><strong>SGST (9%):</strong> ₹{sgst.toFixed(2)}</p>
                    <p><strong>Final Price:</strong> <span className="final-price">₹{finalPrice.toFixed(2)}</span></p>
                    <button className="delete-btn" onClick={() => deleteOrder(order.order_id)}>🗑 Delete</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <div className="order-summary">
        <h3>Total Amount: ₹{Math.ceil(totalAmount.toFixed(2))}</h3>
        <button className="place-order-btn" onClick={placeOrder}>✅ Place Order</button>
      </div>
    </div>
  );
};

export default Cart;