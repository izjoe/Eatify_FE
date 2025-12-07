import { useEffect, useState, useMemo, useContext } from 'react';
import './Restaurant.css';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Restaurant = () => {
  const { food_list, url } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const navigate = useNavigate();

  // Dynamic categories from food_list
  const categories = useMemo(() => {
    if (!food_list || food_list.length === 0) return [];
    
    const categoryMap = {};
    food_list.forEach(item => {
      const cat = item.category || 'Uncategorized';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    
    return Object.entries(categoryMap).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);
  }, [food_list]);

  // Filter foods by category
  useEffect(() => {
    if (!food_list) return;
    
    let filtered = food_list;

    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(food =>
        food.category === selectedCategory
      );
    }

    setFilteredFoods(filtered);
  }, [searchTerm, selectedCategory, food_list]);

  const handleFoodClick = (foodId) => {
    navigate(`/food/${foodId}`);
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
            <label className='category-item'>
              <input
                type='radio'
                name='category'
                value='All'
                onChange={() => setSelectedCategory('All')}
                checked={selectedCategory === 'All'}
              />
              <span className='category-name'>All</span>
              <span className='category-count'>({food_list?.length || 0})</span>
            </label>
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
            <h2>{filteredFoods.length} Dishes</h2>
            <div className='restaurants-count-divider'></div>
          </div>

          <div className='foods-grid'>
            {filteredFoods.map((food) => (
              <div
                key={food._id}
                className='food-card'
                onClick={() => handleFoodClick(food._id)}
              >
                <div className='food-card-image'>
                  <img src={url + "/images/" + food.image} alt={food.name} />
                  <div className='add-btn'>+</div>
                </div>

                <div className='food-card-body'>
                  <h3>{food.name}</h3>
                  <p className='food-description'>{food.description}</p>
                  <div className='food-price-rating'>
                    <span className='food-price'>{(food.price * 2500).toLocaleString('vi-VN')}đ</span>
                    <div className='food-rating'>
                      <span className='star-icon'>⭐</span>
                      <span>4.5</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFoods.length === 0 && (
            <div className='no-restaurants'>
              <p>No dishes found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurant;