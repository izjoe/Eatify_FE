import { useContext, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './FoodDetail.css';
import { StoreContext } from '../../context/StoreContext';
import { assets, food_images, food_name_to_image } from '../../assets/frontend_assets/assets';
import { toast } from 'react-toastify';

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { url, cartItems, addToCart, token } = useContext(StoreContext);
  const [food, setFood] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch food details
  const fetchFoodDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/food/${id}`);
      if (response.data.success) {
        setFood(response.data.data);
        // Set quantity from cart if already added
        if (cartItems[id]) {
          setQuantity(cartItems[id]);
        }
      } else {
        toast.error('Food not found');
        navigate('/menu');
      }
    } catch (error) {
      console.error('Error fetching food:', error);
      toast.error('Error loading food details');
    } finally {
      setLoading(false);
    }
  }, [id, url, cartItems, navigate]);

  // Fetch reviews separately
  const fetchReviews = useCallback(async () => {
    if (!food?.foodID) return;
    try {
      const response = await axios.get(`${url}/api/food/${food.foodID}/reviews`);
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }, [url, food?.foodID]);

  useEffect(() => {
    if (id) {
      fetchFoodDetail();
    }
  }, [id, fetchFoodDetail]);

  useEffect(() => {
    if (food?.foodID) {
      fetchReviews();
    }
  }, [food?.foodID, fetchReviews]);

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Vui lòng đăng nhập để đánh giá!');
      return;
    }

    if (reviewRating < 1 || reviewRating > 5) {
      toast.error('Vui lòng chọn số sao từ 1-5!');
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await axios.post(
        `${url}/api/food/${food.foodID}/review`,
        {
          rating: reviewRating,
          comment: reviewComment
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success('Đánh giá đã được gửi thành công!');
        setReviewComment('');
        setReviewRating(5);
        // Refresh food data and reviews
        await fetchFoodDetail();
        await fetchReviews();
      } else {
        toast.error(response.data.message || 'Không thể gửi đánh giá');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMsg = error.response?.data?.message || 'Lỗi khi gửi đánh giá';
      toast.error(errorMsg);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = () => {
    if (!token) {
      toast.error('Please sign in first to add items to cart!');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(id);
    }
    toast.success(`Added ${quantity} ${food.foodName} to cart`);
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Render star rating (display only)
  const renderStars = (avgRating, size = 'normal') => {
    const stars = [];
    const fullStars = Math.floor(avgRating);
    const hasHalfStar = avgRating - fullStars >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className={`star filled ${size}`}>★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className={`star half ${size}`}>★</span>);
      } else {
        stars.push(<span key={i} className={`star empty ${size}`}>☆</span>);
      }
    }
    return stars;
  };

  // Render interactive star rating for review form
  const renderStarPicker = () => {
    return (
      <div className="star-picker">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star-pick ${star <= (hoverRating || reviewRating) ? 'active' : ''}`}
            onClick={() => setReviewRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            ★
          </span>
        ))}
        <span className="rating-text-pick">{reviewRating}/5</span>
      </div>
    );
  };

  // Format date for reviews
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="food-detail-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="food-detail-page">
        <div className="loading">Food not found</div>
      </div>
    );
  }

  // Get image source - check local assets by filename or name
  const getImageSrc = (imageName) => {
    // 1. Check if image filename is in local assets
    if (food_images[imageName]) {
      return food_images[imageName];
    }
    
    // 2. Try to match by food name
    if (food?.foodName) {
      const foodName = food.foodName;
      // Exact match
      if (food_name_to_image[foodName]) {
        return food_name_to_image[foodName];
      }
      // Partial match
      const nameKeys = Object.keys(food_name_to_image);
      for (const key of nameKeys) {
        if (foodName.toLowerCase().includes(key.toLowerCase()) || 
            key.toLowerCase().includes(foodName.toLowerCase())) {
          return food_name_to_image[key];
        }
      }
    }
    
    // 3. Otherwise, try to load from backend
    return url + "/images/" + imageName;
  };

  return (
    <div className="food-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="food-detail-container">
        {/* Left Side - Image */}
        <div className="food-detail-left">
          <div className="food-image-wrapper">
            <img src={getImageSrc(food.foodImage)} alt={food.foodName} />
          </div>
          
          {/* Image Gallery (if multiple images in future) */}
          <div className="image-thumbnails">
            <div className="thumbnail active">
              <img src={getImageSrc(food.foodImage)} alt={food.foodName} />
            </div>
          </div>
        </div>

        {/* Right Side - Info */}
        <div className="food-detail-right">
          <h1 className="food-title">{food.foodName}</h1>

          <div className="food-price-section">
            <span className="price-value">
              {food.price.toLocaleString('vi-VN')}đ
            </span>
          </div>

          <p className="food-description">{food.description}</p>

          {/* Sold By Section */}
          {food.seller && (
            <div className="sold-by-section">
              <h4>Cung cấp bởi:</h4>
              <Link to={`/restaurant/${food.seller.sellerId}`} className="seller-info">
                <div className="seller-avatar">
                  {food.seller.storeImage ? (
                    <img src={url + "/images/" + food.seller.storeImage} alt={food.seller.storeName} />
                  ) : (
                    <div className="avatar-placeholder">
                      {food.seller.storeName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="seller-details">
                  <span className="seller-name">{food.seller.storeName}</span>
                  <span className="seller-address">{food.seller.storeAddress}</span>
                </div>
              </Link>
            </div>
          )}

          {/* Rating Overview */}
          <div className="rating-overview">
            <div className="rating-score">
              <span className="score-number">{food.averageRating || food.rating?.averageRating || 0}</span>
              <div className="rating-stars">
                {renderStars(food.averageRating || food.rating?.averageRating || 0)}
              </div>
            </div>
            <div className="rating-count-info">
              {food.totalRatings || food.rating?.totalRatings || 0} đánh giá
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

          {/* Service Info */}
          <div className="service-info">
            <div className="service-item">
              <span className="service-icon">🚚</span>
              <span>Giao hàng: 15-30 phút</span>
            </div>
            <div className="service-item">
              <span className="service-icon">📦</span>
              <span>Danh mục: {food.category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="reviews-header">
          <h2 className="reviews-title">
            Đánh giá ({reviews.length || food.reviews?.length || 0})
          </h2>
        </div>

        {/* Review Form */}
        {token ? (
          <div className="review-form-container">
            <h3>Viết đánh giá của bạn</h3>
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="form-group">
                <label>Đánh giá sao:</label>
                {renderStarPicker()}
              </div>
              <div className="form-group">
                <label>Nhận xét (tùy chọn):</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn về món ăn này..."
                  rows={4}
                  maxLength={500}
                />
                <span className="char-count">{reviewComment.length}/500</span>
              </div>
              <button 
                type="submit" 
                className="submit-review-btn"
                disabled={submittingReview}
              >
                {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
            </form>
          </div>
        ) : (
          <div className="login-to-review">
            <p>Vui lòng <Link to="/login">đăng nhập</Link> để đánh giá món ăn này.</p>
          </div>
        )}

        {/* Reviews List */}
        {(reviews.length > 0 || (food.reviews && food.reviews.length > 0)) ? (
          <div className="reviews-list">
            {(reviews.length > 0 ? reviews : food.reviews).map((review, index) => (
              <div key={review.ratingID || review._id || index} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.user?.profileImage ? (
                        <img src={url + "/uploads/avatars/" + review.user.profileImage} alt={review.user.name} />
                      ) : (
                        <div className="avatar-placeholder small">
                          {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <div className="reviewer-details">
                      <span className="reviewer-name">{review.user?.name || 'Người dùng'}</span>
                      <span className="review-date">{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating, 'small')}
                  </div>
                </div>
                {review.comment && (
                  <p className="review-comment">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-reviews">
            <p>Chưa có đánh giá nào cho món ăn này. Hãy là người đầu tiên đánh giá!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDetail;
