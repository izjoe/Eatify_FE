import { useContext, useState } from "react";
import PropTypes from "prop-types";
import "./Navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [showSearch, setShowSearch] = useState(false);

  // Lấy thêm biến role từ Context
  const { getTotalCartAmount, token, setToken, searchTerm, setSearchTerm, role } = useContext(StoreContext);
  
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm) {
      navigate('/');
      setTimeout(() => {
        const foodDisplay = document.getElementById('food-display');
        if (foodDisplay) {
          foodDisplay.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userProfile");
    setToken("");
    toast.success("Logout Successfully");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <li><Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link></li>
        <li><a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a></li>
        <li><Link to="/restaurants" onClick={() => setMenu("restaurant")} className={menu === "restaurant" ? "active" : ""}>restaurant</Link></li>
        <li><Link to="/track-orders" onClick={() => setMenu("track-orders")} className={menu === "track-orders" ? "active" : ""}>track orders</Link></li>
        <li><Link to="/profile" onClick={() => setMenu("profile")} className={menu === "profile" ? "active" : ""}>profile</Link></li>
      </ul>

      <div className="navbar-right">
        <div className="navbar-search-container">
          <input 
            type="text" 
            placeholder="Search food..." 
            className={showSearch ? "search-input active" : "search-input"}
            value={searchTerm || ""}      
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <img 
            src={assets.search_icon} 
            alt="Search" 
            className="search-icon-btn" 
            onClick={() => {
              if (showSearch) {
                handleSearch();
              }
              setShowSearch(!showSearch);
            }} 
          />
        </div>

        {role !== "seller" && (
          <div className="navbar-search-icon">
            <Link to="/cart">
              <img src={assets.basket_icon} alt="Cart" />
            </Link>
            <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
          </div>
        )}

        {token && role === "seller" && (
          <button 
            onClick={() => navigate("/my-shop")} 
            className="my-shop-btn"
          >
            My Shop
          </button>
        )}

        {!token ? (
          <button onClick={() => setShowLogin(true)} className="navbar-signin-btn">
            sign in
          </button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="Profile" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/profile")}>
                <img src={assets.bag_icon} alt="Profile" />
                <p>Profile</p>
              </li>
              <li onClick={() => navigate("/myorders")}> 
                <img src={assets.bag_icon} alt="Orders" />
                <p>{role === "seller" ? "Shop Orders" : "Orders"}</p>
              </li>
              <li><hr /></li>
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="Logout" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

Navbar.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
};

export default Navbar;