import { useEffect, useState } from 'react';
import './Restaurant.css';
import { assets } from '../../assets/frontend_assets/assets';
import { useNavigate } from 'react-router-dom';

const Restaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const navigate = useNavigate();

  // Placeholder restaurants data
  const placeholderRestaurants = [
    { _id: '1', name: 'Nhà hàng 1', distance: '1.2', rating: '4.5', image: assets.food_1 },
    { _id: '2', name: 'Nhà hàng 2', distance: '1.5', rating: '4.3', image: assets.food_2 },
    { _id: '3', name: 'Nhà hàng 3', distance: '2.0', rating: '4.7', image: assets.food_3 },
    { _id: '4', name: 'Nhà hàng 4', distance: '1.8', rating: '4.6', image: assets.food_4 }
  ];

  const categories = [
    { name: 'Appetizers', count: 52 },
    { name: 'Beverages', count: 33 },
    { name: 'Chicken', count: 19 },
    { name: 'Chinese', count: 15 },
    { name: 'Breakfast', count: 14 },
    { name: 'Uncategorized', count: 3 },
    { name: 'BBQ', count: 9 }
  ];

  const fetchRestaurants = async () => {
    try {
      // Tạm thời dùng placeholder data
      setRestaurants(placeholderRestaurants);
      setFilteredRestaurants(placeholderRestaurants);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    let filtered = restaurants;

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(restaurant =>
        restaurant.category === selectedCategory
      );
    }

    setFilteredRestaurants(filtered);
  }, [searchTerm, selectedCategory, restaurants]);

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <div className='restaurant-page'>
      {/* Location Section */}
      <div className='restaurant-location-section'>
        <div className='location-dropdown'>
          <span className='location-icon'></span>
          <span>Location: [Location]</span>
          <select 
            value={selectedLocation} 
            onChange={(e) => setSelectedLocation(e.target.value)}
            className='location-select'
          >
            <option value=''>Track your location</option>
            <option value='Thu Duc'>Thu Duc</option>
            <option value='Di An'>Di An</option>
            <option value='Binh Thanh'>Binh Thanh</option>
          </select>
        </div>
      </div>

      <div className='restaurant-container'>
        {/* Sidebar Filter */}
        <div className='restaurant-sidebar'>
          {/* Search By Food */}
          <div className='sidebar-section'>
            <h3>Search By Food</h3>
            <div className='sidebar-divider'></div>
            <input
              type='text'
              placeholder='Search categories...'
              className='category-search'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className='categories-list'>
            {categories.map((category, index) => (
              <label key={index} className='category-item'>
                <input
                  type='radio'
                  name='category'
                  value={category.name}
                  onChange={() => setSelectedCategory(category.name)}
                  checked={selectedCategory === category.name}
                />
                <span className='category-name'>{category.name}</span>
                <span className='category-count'>({category.count})</span>
              </label>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className='restaurant-main'>
          <div className='restaurants-header'>
            <h2>{filteredRestaurants.length}+ Restaurants</h2>
            <div className='restaurants-count-divider'></div>
          </div>

          <div className='restaurants-grid'>
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className='restaurant-card'
                onClick={() => handleRestaurantClick(restaurant._id)}
              >
                <div className='restaurant-card-image'>
                  <img src={restaurant.image} alt={restaurant.name} />
                </div>

                <div className='restaurant-card-body'>
                  <h3>{restaurant.name}</h3>
                  
                  <div className='restaurant-card-info'>
                    <div className='info-row'>
                      <span className='location-icon-small'>📍</span>
                      <span className='distance'>{restaurant.distance || '1.2'} km</span>
                    </div>
                    <div className='info-row top-right'>
                      <span className='distance'>{restaurant.distance || '1.2'} km</span>
                    </div>
                    <div className='info-row'>
                      <span className='location-icon-small'>📍</span>
                      <span className='distance'>{restaurant.distance || '1.2'} km</span>
                    </div>
                    <div className='info-row bottom-right'>
                      <span className='star-icon'>⭐</span>
                      <span className='rating'>{restaurant.rating || '4.5'}</span>
                    </div>
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
        </div>
      </div>
    </div>
  );
};

export default Restaurant;