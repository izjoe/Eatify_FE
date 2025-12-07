import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../../context/StoreContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();
  
  // User data state
  const [userData, setUserData] = useState({
    displayName: '',
    profileCompleted: false,
    onboardingShown: false,
  });
  
  const [dashboardData] = useState({
    revenue: 5200000,
    revenueGrowth: 12,
    orders: 45,
    pending: 3,
    rating: 4.8,
    reviews: 120,
  });

  // Fetch current user data và handle onboarding
  useEffect(() => {
    const fetchUserAndHandleOnboarding = async () => {
      if (!token) return;
      
      try {
        const response = await axios.get(`${url}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          const user = response.data.data;
          setUserData({
            displayName: user.displayName || user.name || 'Seller',
            profileCompleted: user.profileCompleted,
            onboardingShown: user.onboardingShown,
          });
          
          // Show onboarding toast nếu là seller và chưa hoàn thành profile
          if (user.role === 'seller' && !user.profileCompleted && !user.onboardingShown) {
            // Hiển thị toast chào mừng với CTA
            const toastId = toast.info(
              <div role="alert" aria-live="polite">
                <strong>Chào mừng {user.displayName || user.name}! 👋</strong>
                <p style={{ margin: '8px 0' }}>Vui lòng hoàn thành hồ sơ seller của bạn.</p>
                <button 
                  onClick={() => {
                    toast.dismiss(toastId);
                    navigate('/seller-profile');
                  }}
                  aria-label="Đi tới trang hoàn thành hồ sơ"
                  style={{
                    background: 'tomato',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    marginTop: '8px'
                  }}
                >
                  Hoàn thành hồ sơ
                </button>
              </div>,
              {
                position: "top-right",
                autoClose: 8000, // Tự đóng sau 8s
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
              }
            );
            
            // Mark onboarding as shown
            await axios.put(`${url}/api/auth/mark-onboarding-shown`, {}, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            // Auto redirect sau 8s nếu chưa click
            setTimeout(() => {
              if (!userData.profileCompleted) {
                navigate('/seller-profile');
              }
            }, 8000);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to localStorage
        const storedName = localStorage.getItem('displayName') || localStorage.getItem('userName') || 'Seller';
        setUserData(prev => ({ ...prev, displayName: storedName }));
      }
    };

    fetchUserAndHandleOnboarding();
  }, [token, url, navigate]);

  return (
    <div className="seller-dashboard">
      <div className="seller-dashboard-header">
        <h1>Welcome, {userData.displayName} 👋</h1>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => navigate('/seller-revenue')} style={{ cursor: 'pointer' }}>
          <div className="stat-content">
            <p className="stat-label">Today&apos;s Revenue</p>
            <p className="stat-value">{dashboardData.revenue.toLocaleString()}đ</p>
            <p className="stat-growth">+{dashboardData.revenueGrowth}%</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/seller-orders')} style={{ cursor: 'pointer' }}>
          <div className="stat-content">
            <p className="stat-label">Today&apos;s Orders</p>
            <p className="stat-value">{dashboardData.orders}</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/seller-orders')} style={{ cursor: 'pointer' }}>
          <div className="stat-content">
            <p className="stat-label">Pending</p>
            <p className="stat-value">{dashboardData.pending}</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/seller-profile')} style={{ cursor: 'pointer' }}>
          <div className="stat-content">
            <p className="stat-label">Rating</p>
            <p className="stat-value">{dashboardData.rating}</p>
            <p className="stat-reviews">({dashboardData.reviews} reviews)</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="dashboard-content">
        <div className="chart-section">
          <div className="chart-header">
            <h2>Today&apos;s Revenue</h2>
            <button className="chart-filter">Today ▼</button>
          </div>
          <div className="chart-placeholder">
            {/* TODO: Add chart library (Chart.js hoặc Recharts) */}
            <p>📊 Revenue chart will be displayed here</p>
          </div>
        </div>

        <div className="top-items-section">
          <h2>Top Selling Items</h2>
          <div className="top-items-list">
            <div className="top-item">
              <div className="top-item-name">Fried Chicken</div>
              <div className="top-item-count">(20)</div>
            </div>
            <div className="top-item">
              <div className="top-item-name">Beef Hamburger</div>
              <div className="top-item-count">(15)</div>
            </div>
            <div className="top-item">
              <div className="top-item-name">Pepsi Medium</div>
              <div className="top-item-count">(10)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
