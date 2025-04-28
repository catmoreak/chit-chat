import { Link } from "react-router-dom";
import "./Navbar.css";
import { Send  } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <Send  className="logo-icon" />
          <span>Chit-Chat</span>
        </Link>
      </div>
      <div className="navbar-right">
        <Link to="/about" className="navbar-link">About Us</Link>
        <Link to="/chat" className="navbar-link">Chat Now</Link>
        <Link to="/contact" className="navbar-link">Contact Us</Link>
      </div>
    </nav>
  );
};

export default Navbar;
