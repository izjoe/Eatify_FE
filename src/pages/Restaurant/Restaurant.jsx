import { useEffect, useState } from 'react';
import './Restaurant.css';
import axios from 'axios'; // Dùng để gọi API
import { assets } from '../../assets/frontend_assets/assets'; // Giả sử bạn có icon rating

const Restaurant = () => {
  const [restaurants, setRestaurants] = useState([]);

  // Hàm gọi API để lấy danh sách nhà hàng từ backend
  const fetchRestaurants = async () => {
    try {
      // Thay đổi URL thành API endpoint của bạn
      const response = await axios.get('http://localhost:4000/api/restaurant/list'); 
      if (response.data.success) {
        setRestaurants(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  // Chạy hàm fetchRestaurants khi component được tải lần đầu
  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className='restaurant'>
      <h2>Our Restaurants</h2>
      <p className='restaurant-description'>
        Dully your grote mstd ire, forn culrstom er sliary, senal ours mangnt, on ihn thenssad agn tmat ben daotion postheion sliary our lon ahle tist your
        experim tito fur rol oerperine. Hsle the sne your for love tre icon to you modition rno time.
      </p>
      
      <div className="restaurant-list">
        {restaurants.map((item) => (
          <div key={item._id} className="restaurant-item">
            <img className='restaurant-item-image' src={item.image} alt={item.name} />
            <div className="restaurant-item-info">
              <h3>{item.name}</h3>
              <p className='restaurant-item-desc'>{item.description}</p>
              <div className="restaurant-item-rating">
                <p>{item.rating}</p>
                <img src={assets.rating_starts} alt="rating" /> {/* Giả sử bạn có ảnh sao rating */}
              </div>
              <button className='restaurant-item-button'>View Menu</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Restaurant;