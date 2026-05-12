import React, { useEffect, useState } from "react";
import axios from "axios";
import { BaseUrl } from "../api/ApiPoint";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slider1 from "../../assets/slider1.jpg";
import slider2 from "../../assets/slider2.jpg";
import slider3 from "../../assets/slider3.jpg";
import slider4 from "../../assets/slider4.jpg";
import "./Home.css";
import { Link } from "react-router-dom";
import botIcon from "../../assets/botIcon.png"

const Home = () => {
  const [products, setProducts] = useState(null); // null for better error handling
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const [isChatOpen, setIsChatOpen] = useState(false);
const [messages, setMessages] = useState([
  { text: "Hi 👋 How can I help you?", sender: "bot" },
]);
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("API URL:", `${BaseUrl}shopefi/products/show`);

    axios
      .get(`${BaseUrl}shopefi/products/show`)
      .then((response) => {
        console.log("Full API Response:", response);
        console.log("Response Data:", response.data);
        setProducts(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error(
          "API Error:",
          error.response ? error.response.data : error.message,
        );
        setProducts(null);
      });
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    centerMode: true,
    centerPadding: "30px",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const filteredProducts =
    Array.isArray(products) && products.length > 0
      ? products.filter((product) =>
          product.product_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
        )
      : [];

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  //send Message to AI Bot
const sendMessage = async () => {
  if (!input.trim()) return;
 
  // User message
  const userMessage = {
    text: input,
    sender: "user",
  };
 
  setMessages((prev) => [...prev, userMessage]);
 
  const userInput = input;
 
  setInput("");
 
  try {
    setLoading(true);
 
    const response = await axios.post(
      `${BaseUrl}shopefi/ai/chat`,
      {
        message: userInput,
      }
    );
 
    const botMessage = {
      text: response.data.reply,
      sender: "bot",
    };
 console.log("Bot Response:", response.data);
    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.log(error);
 
    setMessages((prev) => [
      ...prev,
      {
        text: "Something went wrong",
        sender: "bot",
      },
    ]);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="container py-5">
      {/* Chatbot Button */}
<div className="chatbot-icon" onClick={() => setIsChatOpen(!isChatOpen)}>
 <img src={botIcon} alt="" />
</div>

{/* Chatbot Popup */}
{isChatOpen && (
  <div className="chatbot-popup">
    <div className="chatbot-header">
      <span>Support</span>
      <button className="crossBtn" onClick={() => setIsChatOpen(false)}>✖</button>
    </div>

    <div className="chatbot-body">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`chat-message ${msg.sender === "bot" ? "bot" : "user"}`}
        >
          {msg.text}
        </div>
      ))}
    </div>

    <div className="chatbot-footer">
      <input
        type="text"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
      className="sendBtn"
        onClick={sendMessage}
        disabled={loading}
      >
        ➤
      </button>
    </div>
  </div>
)}
      <h1 className="text-center fw-bold text-gradient mb-4">
        Welcome to Shopefi
      </h1>
      <p className="text-center text-muted">
        Discover the best products at unbeatable prices!
      </p>

      {/* Search Bar */}
      <div className="search-bar text-center mb-4">
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Slider Section */}
      <div className="mb-5">
        <Slider {...sliderSettings}>
          {[slider1, slider2, slider3, slider4].map((slide, index) => (
            <div key={index}>
              <img
                src={slide}
                className="img-fluid rounded shadow-lg w-100 p-2"
                style={{ height: "250px", objectFit: "cover" }}
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Products Listing */}
      <div className="row mt-4">
        {products === null ? (
          <div className="text-center w-100">
            <p className="text-danger">
              Error loading products. Please try again later.
            </p>
          </div>
        ) : currentProducts.length > 0 ? (
          currentProducts.map((product) => {
            const originalPrice = parseFloat(product.product_price) || 0;
            const discountPercentage =
              parseFloat(product.product_discount) || 0;
            const discountedPrice =
              originalPrice * (1 - discountPercentage / 100);
            const imageUrl = product.product_image.startsWith("http")
              ? product.product_image
              : `${BaseUrl}/${product.product_image}`;

            return (
              <div className="col-md-4 col-lg-3 mb-4" key={product.product_id}>
                <div className="product-card shadow-lg bg-white border rounded p-3">
                  <div className="position-relative text-center">
                    <img
                      src={imageUrl}
                      className="card-img-top rounded shadow-sm"
                      alt={product.product_name}
                      style={{
                        width: "100%",
                        height: "auto",
                        aspectRatio: "1 / 1",
                        objectFit: "contain",
                      }}
                    />
                    <span className="badge-discount">
                      {product.product_discount}% OFF
                    </span>
                  </div>
                  <div className="card-body text-center">
                    <h5 className="product-title stylish-title">
                      {product.product_name}
                    </h5>
                    <p className="original-price">₹{originalPrice}</p>
                    <p className="discounted-price stylish-price">
                      ₹{discountedPrice.toFixed(2)}
                    </p>
                    <Link
                      to={`/product/${product.product_id}/`}
                      className="explore-btn stylish-button"
                    >
                      Explore More
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center w-100">
            <p className="text-warning">No products available</p>
          </div>
        )}
      </div>
      <div className="pagination">
        <button
          className="page-item"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="page-item"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      {/* Features Section */}
      <div className="features-section mt-5">
        <h2 className="text-center stylish-heading">Why Choose Shopefi?</h2>
        <div className="row mt-4">
          {[
            {
              title: "🚀 Fast Delivery",
              desc: "Get your products delivered at lightning speed.",
            },
            {
              title: "💰 Best Prices",
              desc: "Unbeatable discounts and offers on all products.",
            },
            {
              title: "🛠 24/7 Support",
              desc: "Our support team is always here to help you.",
            },
          ].map((feature, index) => (
            <div className="col-md-4" key={index}>
              <div className="feature-card">
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
