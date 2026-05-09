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

  const userId = getIds[0]; // ✅ FIXED (Mongo _id)
  console.log("🔑 User ID:", userId);

  const [orders, setOrders] = useState([]); // KEEP SAME NAME (UI unchanged)
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

  // ✅ FETCH CART (NEW API)
  const fetchCartDetails = async () => {
    try {
      const response = await axios.get(`${BaseUrl}shopefi/cart/${userId}`, {
        headers: { token },
      });

      console.log("🛒 Cart Response:", response.data);

      // convert cart → orders format (NO UI CHANGE)
      const cartProducts = response.data.cart?.products || [];

      const formatted = [
        {
          order_id: "cart",
          products: cartProducts.map((item) => ({
            ...item.product_id,
            quantity: item.quantity,
          })),
        },
      ];
console.log("🔄 Formatted Orders:", formatted);
      setOrders(formatted);
      calculateTotalAmount(formatted);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
      setError("Failed to load cart details");
      setLoading(false);
    }
  };

  // ✅ TOTAL WITH QUANTITY
  const calculateTotalAmount = (orders) => {
    let total = 0;

    orders.forEach((order) => {
      order.products.forEach((product) => {
        const discountAmount =
          (product.product_price * product.product_discount) / 100;

        const discountedPrice = product.product_price - discountAmount;

        const cgst = (discountedPrice * 9) / 100;
        const sgst = (discountedPrice * 9) / 100;

        total += (discountedPrice + cgst + sgst) * (product.quantity || 1);
      });
    });

    setTotalAmount(total);
  };

  // ✅ UPDATE QUANTITY
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      await axios.put(
        `${BaseUrl}shopefi/cart/update/${userId}`,
        { product_id: productId, quantity },
        { headers: { token } },
      );

      fetchCartDetails();
    } catch (error) {
      console.error("❌ Update qty error:", error);
    }
  };

  // ✅ REMOVE ITEM
  const deleteOrder = async (productId) => {
    try {
      await axios.delete(`${BaseUrl}shopefi/cart/remove/${userId}`, {
        data: { product_id: productId },
        headers: { token },
      });

      fetchCartDetails();
    } catch (error) {
      console.error("❌ Remove error:", error);
    }
  };

  // ✅ GET PRODUCT IDS FOR PAYMENT
  const getProductIds = () => {
    let ids = [];

    orders.forEach((order) => {
      order.products.forEach((product) => {
        if (product.product_id) {
          ids.push(product.product_id); // original string id
        }
      });
    });

    return ids;
  };

  // ✅ RAZORPAY SAME
  const placeOrder = async () => {
    try {
      const product_ids = getProductIds();

      const res = await axios.post(
        `http://localhost:4000/shopefi/orders/create-order/${userId}`,
        { product_ids },
        { headers: { token } },
      );

      const order = res.data.razorOrder;

      const options = {
        key: "rzp_test_SlLkKLlxRUYHSp",
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,

        name: "Shopefi",
        description: "Order Payment",

        handler: async function (response) {
          const verifyRes = await axios.post(
            `http://localhost:4000/shopefi/orders/verify-payment`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              product_ids,
              user_id: userId,
            },
            { headers: { token } },
          );

          if (verifyRes.data.success) {
            alert("🎉 Payment Successful!");

            fetchCartDetails();
          }
        },

        prefill: {
          name: "Alex Swift",
          email: "alex@gmail.com",
          contact: "8875674555",
        },

        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("❌ Payment Error:", err);
      alert("Payment failed.");
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const renderProductDetails = (product) => {
    const discountAmount =
      (product.product_price * product.product_discount) / 100;

    const discountedPrice = product.product_price - discountAmount;

    const cgst = (discountedPrice * 9) / 100;
    const sgst = (discountedPrice * 9) / 100;

    const finalPrice = discountedPrice + cgst + sgst;

    return { discountedPrice, cgst, sgst, finalPrice };
  };
console.log("🔄 Render Orders:", orders[0]?.products?.length);
  if (loading) return <div className="loading">Loading your cart...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (orders[0]?.products?.length === 0) {
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
              <th>Qty</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) =>
              order.products.map((product, idx) => {
                const { discountedPrice, cgst, sgst, finalPrice } =
                  renderProductDetails(product);

                return (
                  <tr key={`${index}-${idx}`}>
                    <td>
                      <img
                        src={`${BaseUrl}/${product.product_image}`}
                        alt={product.product_name}
                        className="cart-product-img"
                      />
                    </td>

                    <td>{product.product_name}</td>
                    <td>₹{product.product_price.toFixed(2)}</td>
                    <td>{product.product_discount}%</td>
                    <td className="discounted-price">
                      ₹{discountedPrice.toFixed(2)}
                    </td>
                    <td>₹{cgst.toFixed(2)}</td>
                    <td>₹{sgst.toFixed(2)}</td>
                    <td className="final-price">
                      ₹{(finalPrice * product.quantity).toFixed(2)}
                    </td>

                    {/* ✅ Quantity */}
                    <td>
                      <div className="qty-box">
                        <button
                          onClick={() =>
                            updateQuantity(product._id, product.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <span>{product.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(product._id, product.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteOrder(product._id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                );
              }),
            )}
          </tbody>
        </table>
      ) : (
        <div className="cart-cards">
          {orders.map((order, index) =>
            order.products.map((product, idx) => {
              const { discountedPrice, cgst, sgst, finalPrice } =
                renderProductDetails(product);

              return (
                <div className="cart-card" key={`${index}-${idx}`}>
                  <img
                    src={`${BaseUrl}/${product.product_image}`}
                    alt={product.product_name}
                    className="cart-card-img"
                  />

                  <div className="cart-card-details">
                    <h3 className="cart-card-title">{product.product_name}</h3>

                    <p>
                      <strong>Original Price:</strong> ₹
                      {product.product_price.toFixed(2)}
                    </p>

                    <p>
                      <strong>Discount:</strong> {product.product_discount}%
                    </p>

                    <p>
                      <strong>Discounted Price:</strong>{" "}
                      <span className="discounted-price">
                        ₹{discountedPrice.toFixed(2)}
                      </span>
                    </p>

                    <p>
                      <strong>CGST (9%):</strong> ₹{cgst.toFixed(2)}
                    </p>
                    <p>
                      <strong>SGST (9%):</strong> ₹{sgst.toFixed(2)}
                    </p>
  {/* ✅ ADD THIS BLOCK */}
  <div className="qty-box">
    <button onClick={() => updateQuantity(product._id, product.quantity - 1)}>-</button>
    <span>{product.quantity}</span>
    <button onClick={() => updateQuantity(product._id, product.quantity + 1)}>+</button>
  </div>
                    {/* ✅ multiply with quantity */}
                    <p>
                      <strong>Final Price:</strong>{" "}
                      <span className="final-price">
                        ₹{(finalPrice * (product.quantity || 1)).toFixed(2)}
                      </span>
                    </p>

                    <button
                      className="delete-btn"
                      onClick={() => deleteOrder(product._id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              );
            }),
          )}
        </div>
      )}

      <div className="order-summary">
        <h3>Total Amount: ₹{Math.ceil(totalAmount)}</h3>
        <button className="place-order-btn" onClick={placeOrder}>
          ✅ Place Order
        </button>
      </div>
    </div>
  );
};

export default Cart;
