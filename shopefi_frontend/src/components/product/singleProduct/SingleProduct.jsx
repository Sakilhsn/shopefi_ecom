import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../api/ApiPoint";
import "./SingleProduct.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SingleProduct = () => {
  const { pid } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const userId = localStorage.getItem("user_id")?.split(",")[0];
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    axios
      .get(`${BaseUrl}shopefi/products/show/${pid}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [pid]);

  if (loading) {
    return <div className="text-center mt-5">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="text-center text-danger mt-5">Product not found</div>
    );
  }

  const originalPrice = product.product_price;
  const discountAmount = (originalPrice * product.product_discount) / 100;
  const discountedPrice = originalPrice - discountAmount;

  // const handleAddToCart = async () => {
  //   setMessage("");
  //   setError("");

  //   if (!userId || !token) {
  //     setError("Please sign in to add products to the cart.");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(
  //       `${BaseUrl}shopefi/orders/add-order/${userId}`,
  //       { product_ids: [pid] },
  //       { headers: { token: token } }
  //     );

  //     if (response.status === 201) {
  //       setMessage("Product added to cart successfully!");
  //     } else {
  //       setError("Failed to add product to cart.");
  //     }
  //   } catch (err) {
  //     setError("Error adding to cart. Try again later.");
  //   }
  // };
  const handleAddToCart = async () => {
    

    if (!userId || !token) {
      toast.error(" Please sign in to add products to the cart.");
      return;
    }

    try {
      const response = await axios.post(
        `${BaseUrl}shopefi/cart/add/${userId}`,
        { product_id: pid, quantity },
        { headers: { token: token } },
      );

      if (response.status === 200) {
        toast.success("Product added to cart!");
      } else {
        toast.error("Failed to add product!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product!");
    }
  };
  return (
    <div className="stylish-container">
      {/* Product Image */}
      <div className="image-container">
        <img
          src={`${BaseUrl}/${product.product_image}`}
          alt={product.product_name}
          className="stylish-image"
        />
      </div>

      {/* Product Details */}
      <div className="details-container">
        <span className="category-badge">
          {product.product_category.category_name}
        </span>
        <h1 className="stylish-title">{product.product_name}</h1>
        <p className="stylish-description">{product.product_description}</p>

        {/* Price Section */}
        <div className="price-container">
          <span className="original-price">₹{originalPrice.toFixed(2)}</span>
          <span className="discounted-price">
            ₹{discountedPrice.toFixed(2)}
          </span>
          <span className="discount-badge">
            {product.product_discount}% OFF
          </span>
        </div>
        {/* // Quantity Selector */}
        <div className="qty-wrapper">
          <strong>Quantity:</strong>

          <div className="qty-box">
            <button
              className="qty-btn"
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            >
              -
            </button>

            <span>{quantity}</span>

            <button
              className="qty-btn"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>
        {/* Add to Cart Button */}
        <button
          className={`stylish-button ${!userId || !token ? "disabled-button" : ""}`}
          onClick={handleAddToCart}
          disabled={!userId || !token}
        >
          {userId && token ? "Add to Cart" : "Sign in to Add to Cart"}
        </button>
      </div>
        <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      theme="colored"
    />
    </div>
  );
};

export default SingleProduct;
