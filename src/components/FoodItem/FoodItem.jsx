import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./FoodItem.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image }) => {
  const {cartItems,addToCart,removeFromCart,url}=useContext(StoreContext);
  const navigate = useNavigate();

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
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className="food-item-counter">
            <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt="" />
            <p>{cartItems[id]}</p>
            <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt="" />
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

export default FoodItem;
