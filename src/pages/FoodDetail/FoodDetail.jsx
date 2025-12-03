import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './FoodDetail.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/frontend_assets/assets';
import { toast } from 'react-toastify';

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { food_list, url, cartItems, addToCart, removeFromCart } = useContext(StoreContext);
  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (food_list && id) {
      const foundFood = food_list.find(item => item._id === id);
      setFood(foundFood);
      
      // Set quantity from cart if already added
      if (cartItems[id]) {
        setQuantity(cartItems[id]);
      }
    }
  }, [food_list, id, cartItems]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(id);
    }
    toast.success(`Added ${quantity} ${food.name} to cart`);
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (!food) {
    return (
      <div className="food-detail-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="food-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="food-detail-container">
        {/* Left Side - Image */}
        <div className="food-detail-left">
          <div className="food-image-wrapper">
            <img src={url + "/images/" + food.image} alt={food.name} />
          </div>
        </div>

        {/* Right Side - Info */}
        <div className="food-detail-right">
          <div className="food-badge">
            <span className="badge-text">⭐ Best Seller</span>
          </div>

          <h1 className="food-title">{food.name}</h1>

          <div className="food-meta">
            <div className="rating">
              <span className="star">⭐</span>
              <span className="rating-text">4.5</span>
              <span className="reviews">(99+ đánh giá)</span>
            </div>
          </div>

          <div className="food-description-section">
            <h3>Mô tả</h3>
            <p>{food.description}</p>
            <p className="description-extra">
              Food provides essential nutrients for overall health and well-being
            </p>
          </div>

          <div className="food-price-section">
            <div className="price-wrapper">
              <span className="price-label">Giá:</span>
              <span className="price-value">
                {(food.price * 2500).toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-section">
            <span className="quantity-label">Số lượng:</span>
            <div className="quantity-controls">
              <button className="qty-btn" onClick={decreaseQuantity}>-</button>
              <span className="qty-value">{quantity}</span>
              <button className="qty-btn" onClick={increaseQuantity}>+</button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="action-buttons">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Thêm vào giỏ hàng
            </button>
          </div>

          {/* Promotions */}
          <div className="promotions-section">
            <h3>Khuyến mãi</h3>
            <div className="promo-item">
              <span className="promo-icon">🎁</span>
              <div className="promo-text">
                <p className="promo-title">HOME CREDIT giảm 30.000đ</p>
                <button className="copy-code-btn">Copy code 📋</button>
              </div>
            </div>
            <div className="promo-item">
              <span className="promo-icon">🎁</span>
              <div className="promo-text">
                <p className="promo-title">Mã giảm 30k trên giá món</p>
                <button className="copy-code-btn">Copy code 📋</button>
              </div>
            </div>
            <div className="promo-item">
              <span className="promo-icon">🎁</span>
              <div className="promo-text">
                <p className="promo-title">Mã giảm 33k trên giá món</p>
                <button className="copy-code-btn">Copy code 📋</button>
              </div>
            </div>
          </div>

          {/* Service Info */}
          <div className="service-info">
            <div className="service-item">
              <span className="service-icon">🚚</span>
              <span>Giao hàng: 15-30 phút</span>
            </div>
            <div className="service-item">
              <span className="service-icon">📍</span>
              <span>Khoảng cách: 2.5 km</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
