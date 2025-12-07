import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../../components/FoodItem/FoodItem';
import axios from 'axios';
import './RestaurantDetail.css';
import { restaurant_images } from '../../assets/frontend_assets/assets';

// Hàm lấy ảnh cho restaurant
const getRestaurantImage = (restaurant, url) => {
  // Thử tìm theo tên quán
  if (restaurant.storeName && restaurant_images[restaurant.storeName]) {
    return restaurant_images[restaurant.storeName];
  }
  // Fallback về backend URL nếu có
  if (restaurant.storeAvatar) {
    return `${url}/images/${restaurant.storeAvatar}`;
  }
  if (restaurant.storeImage) {
    return `${url}/images/${restaurant.storeImage}`;
  }
  return null;
};

const RestaurantDetail = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const { url } = useContext(StoreContext);
  
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Fetch restaurant details and foods
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch restaurant info (includes foods)
        const restaurantRes = await axios.get(`${url}/api/seller/${sellerId}`);
        if (restaurantRes.data.success) {
          const data = restaurantRes.data.data;
          setRestaurant(data.sellerInfo);
          
          // Map foods from response
          if (data.foods && data.foods.length > 0) {
            const mappedFoods = data.foods.map(food => ({
              _id: food.foodID,
              name: food.foodName,
              image: food.foodImage,
              price: food.price,
              description: food.description || '',
              category: food.category,
              rating: food.averageRating || 0,
              totalRatings: food.totalRatings || 0
            }));
            setFoods(mappedFoods);
          }
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) {
      fetchData();
    }
  }, [sellerId, url]);

  // Get unique categories from foods
  const categories = ['All', ...new Set(foods.map(food => food.category))];

  // Filter foods by selected category
  const filteredFoods = selectedCategory === 'All' 
    ? foods 
    : foods.filter(food => food.category === selectedCategory);

  if (loading) {
    return (
      <div className="restaurant-detail-loading">
        <p>Loading restaurant...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="restaurant-detail-error">
        <h2>Restaurant not found</h2>
        <button onClick={() => navigate('/restaurant')}>Back to Restaurants</button>
      </div>
    );
  }

  return (
    <div className="restaurant-detail">
      {/* Restaurant Header */}
      <div className="restaurant-header">
        <div className="restaurant-header-image">
          <img 
            src={getRestaurantImage(restaurant, url) || 'https://via.placeholder.com/1200x400?text=Restaurant'} 
            alt={restaurant.storeName}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/1200x400?text=Restaurant';
            }}
          />
          <div className="restaurant-header-overlay">
            <div className="restaurant-header-info">
              <h1>{restaurant.storeName}</h1>
              <p className="restaurant-address">📍 {restaurant.storeAddress}</p>
              {restaurant.categories && restaurant.categories.length > 0 && (
                <div className="restaurant-tags">
                  {restaurant.categories.map((cat, idx) => (
                    <span key={idx} className="tag">{cat}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Description */}
      <div className="restaurant-about">
        <h2>About</h2>
        <p>{restaurant.storeDescription || 'Welcome to our restaurant!'}</p>
      </div>

      {/* Category Filter */}
      <div className="restaurant-categories">
        <h2>Menu ({foods.length} items)</h2>
        <div className="category-tabs">
          {categories.map((category, idx) => (
            <button
              key={idx}
              className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
              {category !== 'All' && (
                <span className="category-count">
                  ({foods.filter(f => f.category === category).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Food Grid */}
      <div className="restaurant-foods">
        {filteredFoods.length > 0 ? (
          <div className="foods-grid">
            {filteredFoods.map((food) => (
              <FoodItem
                key={food._id}
                id={food._id}
                name={food.name}
                price={food.price}
                description={food.description}
                image={food.image}
                rating={food.rating}
              />
            ))}
          </div>
        ) : (
          <div className="no-foods">
            <p>No items found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
