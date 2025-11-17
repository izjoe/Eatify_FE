import { useContext, useEffect, useState } from 'react';
import './TrackOrder.css';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext'; // Import StoreContext
import { assets } from '../../assets/frontend_assets/assets'; // Giả sử có icon parcel

const TrackOrder = () => {
  const { token } = useContext(StoreContext); // Lấy token từ context
  const [orders, setOrders] = useState([]);

  // Hàm gọi API lấy đơn hàng của người dùng
  const fetchUserOrders = async () => {
    if (token) {
      try {
        // Thay đổi URL thành API endpoint của bạn
        const response = await axios.get('http://localhost:4000/api/order/userorders', {
          headers: { token } // Gửi token trong headers
        });
        if (response.data.success) {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user orders:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [token]); // Chạy lại khi token thay đổi (sau khi đăng nhập)

  // Hàm helper để render danh sách món ăn
  const renderItems = (items) => {
    return items.map((item) => (
      `${item.name} x ${item.quantity}`
    )).join(", ");
  };

  return (
    <div className='track-order'>
      <h2>Track Your Orders</h2>
      <p className='track-order-description'>
        Here are your recent orders. You can track their status from processing to delivery.
      </p>

      <div className="order-list">
        {orders.length > 0 ? orders.map((order) => (
          <div key={order._id} className="order-item">
            <img src={assets.parcel_icon} alt="Order Icon" className='order-item-icon' />
            <div className="order-item-details">
              <p className='order-item-items'>
                <strong>Items:</strong> {renderItems(order.items)}
              </p>
              <p className='order-item-id'><strong>Order ID:</strong> #{order._id.slice(-8)}</p>
              <p className='order-item-total'><strong>Total:</strong> ${order.amount}.00</p>
            </div>
            <div className="order-item-status">
              <p>Status: <span className={`status status-${order.status.toLowerCase().replace(" ", "-")}`}>{order.status}</span></p>
              <button className='order-item-track-btn'>Track</button>
            </div>
          </div>
        )) : (
          <p className='no-orders'>You have not placed any orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;