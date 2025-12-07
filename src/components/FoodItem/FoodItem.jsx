import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./FoodItem.css";
import { assets, food_images, food_name_to_image } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const FoodItem = ({ id, name, price, description, image, rating }) => {
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

  // Render star rating (1-5 sao, làm tròn)
  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating); // Làm tròn về số nguyên
    
    for (let i = 0; i < 5; i++) {
      if (i < roundedRating) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    return stars;
  };

  // Get image source - check local assets by filename or name
  const getImageSrc = () => {
    // 1. Check if image filename is in local assets
    if (food_images[image]) {
      return food_images[image];
    }
    
    // 2. Try to match by food name (for backend data)
    if (name) {
      // Exact match
      if (food_name_to_image[name]) {
        return food_name_to_image[name];
      }
      // Partial match - find key that is contained in name or vice versa
      const nameKeys = Object.keys(food_name_to_image);
      for (const key of nameKeys) {
        if (name.toLowerCase().includes(key.toLowerCase()) || 
            key.toLowerCase().includes(name.toLowerCase())) {
          return food_name_to_image[key];
        }
      }
    }
    
    // 3. Otherwise, try to load from backend
    return url + "/images/" + image;
  };

  return (
    <div className="food-item" onClick={handleCardClick}>
      <div className="food-item-img-container">
        <img src={getImageSrc()} alt={name} className="food-item-image" />
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
          <div className="food-item-rating">
            {rating && rating.averageRating > 0 ? (
              <div className="stars-container">
                {renderStars(Math.round(rating.averageRating))}
              </div>
            ) : (
              <div className="stars-container">
                {/* Tạo rating mặc định từ 2-5 sao dựa trên id để consistent */}
                {renderStars(((id?.toString().charCodeAt(0) || 0) % 4) + 2)}
              </div>
            )}
          </div>
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">{price.toLocaleString('vi-VN')}đ</p>
      </div>
    </div>
  );
};

FoodItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string,
  image: PropTypes.string.isRequired,
  rating: PropTypes.shape({
    averageRating: PropTypes.number,
    totalRatings: PropTypes.number
  })
};

export default FoodItem;
