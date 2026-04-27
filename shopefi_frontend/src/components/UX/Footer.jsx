import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const clearStorageHandler=()=>{
    localStorage.clear();
  }
  return (
    <footer className="footer bg-dark text-light text-center py-4 mt-auto">
      <div className="container">
        {/* Shopefi Brand Info */}
        <p className="mb-2">&copy; {new Date().getFullYear()} <strong>Shopefi</strong>. All Rights Reserved.</p>
        <p className="footer-tagline">Your One-Stop Shop for Everything!</p>

        {/* Quick Links */}
        <div className="footer-links">
          <Link to="/privacy-policy" className="text-light mx-2">Privacy Policy</Link>
          <Link to="/terms-of-service" className="text-light mx-2">Terms of Service</Link>
          <Link to="/admin/signin" className="text-light mx-2">Admin</Link>
          <Link to="/about" className="text-light mx-2">About Us</Link>
        </div>

        {/* Social Media Links */}
        <div className="footer-social mt-3">
          <a href="#" className="social-icon mx-2"><FaFacebook size={24} /></a>
          <a href="#" className="social-icon mx-2"><FaInstagram size={24} /></a>
          <a href="#" className="social-icon mx-2"><FaTwitter size={24} /></a>
        </div>

        {/* Contact Information */}
        <div className="footer-contact mt-3">
          <button  className='btn text-white' onClick={()=>clearStorageHandler()}>-clear storage-</button>
          <p>Email: <a href="mailto:support@shopefi.com" className="text-light">support@shopefi.com</a></p>
          <p>Phone: <a href="tel:+919876543210" className="text-light">+91 98765 43210</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
