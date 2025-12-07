import { useEffect, useState, useContext } from 'react';
import './Restaurant.css';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { restaurant_images } from '../../assets/frontend_assets/assets';

// Số quán mỗi trang
const ITEMS_PER_PAGE = 6;

// Hàm lấy ảnh cho restaurant
const getRestaurantImage = (restaurant, url) => {
  // Thử tìm theo tên quán
  if (restaurant.storeName && restaurant_images[restaurant.storeName]) {
    return restaurant_images[restaurant.storeName];
  }
  // Fallback về backend URL nếu có
  if (restaurant.storeImage) {
    return `${url}/images/${restaurant.storeImage}`;
  }
  return null;
};

const Restaurant = () => {
  const { url } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Fetch all restaurants/sellers from backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${url}/api/seller`);
        if (response.data.success) {
          setRestaurants(response.data.data);
          setFilteredRestaurants(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [url]);

  // Filter restaurants by search term
  useEffect(() => {
    if (!restaurants) return;
    
    let filtered = restaurants;

    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(restaurant =>
        restaurant.storeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRestaurants(filtered);
    setCurrentPage(1); // Reset về trang 1 khi search
  }, [searchTerm, restaurants]);

  const handleRestaurantClick = (sellerId) => {
    navigate(`/restaurant/${sellerId}`);
  };

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRestaurants = filteredRestaurants.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='restaurant-page'>
      {/* Search Bar */}
      <div className='restaurant-search-section'>
        <div className='restaurant-search-bar'>
          <input
            type='text'
            placeholder='Search for restaurants...'
            className='restaurant-search-input'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className='search-icon'>🔍</span>
        </div>
      </div>

      <div className='restaurant-container'>
        {/* Main Content - No Sidebar */}
        <div className='restaurant-main-full'>
          {loading ? (
            <div className='loading-state'>
              <p>Loading restaurants...</p>
            </div>
          ) : (
            <>
              <div className='restaurants-grid'>
                {currentRestaurants.map((restaurant) => (
                  <div
                    key={restaurant._id}
                    className='restaurant-card'
                    onClick={() => handleRestaurantClick(restaurant.sellerID)}
                  >
                    <div className='restaurant-card-image'>
                      <img 
                        src={getRestaurantImage(restaurant, url) || 'https://via.placeholder.com/400x200?text=Restaurant'} 
                        alt={restaurant.storeName}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x200?text=Restaurant';
                        }}
                      />
                    </div>

                    <div className='restaurant-card-body'>
                      <h3>{restaurant.storeName}</h3>
                      <p className='restaurant-address'>{restaurant.storeAddress}</p>
                      {restaurant.storeDescription && (
                        <p className='restaurant-description'>{restaurant.storeDescription}</p>
                      )}
                      <div className='restaurant-info'>
                        {restaurant.categories && restaurant.categories.length > 0 && (
                          <div className='restaurant-categories'>
                            {restaurant.categories.slice(0, 3).map((cat, idx) => (
                              <span key={idx} className='category-tag'>{cat}</span>
                            ))}
                          </div>
                        )}
                        {restaurant.averageRating > 0 && (
                          <div className='restaurant-rating'>
                            <span className='star-icon'>⭐</span>
                            <span>{restaurant.averageRating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredRestaurants.length === 0 && (
                <div className='no-restaurants'>
                  <p>No restaurants found</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='restaurant-pagination'>
                  <button
                    className='pagination-btn'
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ←
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    className='pagination-btn'
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurant;