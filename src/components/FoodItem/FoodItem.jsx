import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./FoodItem.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const FoodItem = ({ id, name, price, description, image }) => {
  const {cartItems,addToCart,removeFromCart,url,token}=useContext(StoreContext);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!token) {
      toast.error("Please sign in first to add items to cart!");
      return;
    }
    addToCart(id);
  };

  const handleRemoveFromCart = (e) => {
    e.stopPropagation();
    if (!token) {
      toast.error("Please sign in first!");
      return;
    }
    removeFromCart(id);
  };

  const handleCardClick = (e) => {
    // Don't navigate if clicking on add/remove buttons
    if (e.target.closest('.food-item-counter') || e.target.closest('.add')) {
      return;
    }
    navigate(`/food/${id}`);
  };

  return (
    <div className="food-item" onClick={handleCardClick}>
      <div className="food-item-img-container">
        <img src={url+"/images/"+image} alt="" className="food-item-image" />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={handleAddToCart}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className="food-item-counter">
            <img onClick={handleRemoveFromCart} src={assets.remove_icon_red} alt="" />
            <p>{cartItems[id]}</p>
            <img onClick={handleAddToCart} src={assets.add_icon_green} alt="" />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">{(price * 2500).toLocaleString('vi-VN')}đ</p>
      </div>
    </div>
  );
};

FoodItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string,
  image: PropTypes.string.isRequired
};

export default FoodItem;
