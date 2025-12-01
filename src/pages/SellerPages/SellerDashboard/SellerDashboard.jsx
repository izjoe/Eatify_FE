import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../../context/StoreContext';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();
  const [dashboardData] = useState({
    revenue: 5200000,
    revenueGrowth: 12,
    orders: 45,
    pending: 3,
    rating: 4.8,
    reviews: 120,
  });

  useEffect(() => {
    // TODO: Fetch dashboard data từ API
    // fetchDashboardData();
  }, [token, url]);

  return (
    <div className="seller-dashboard">
      <div className="seller-dashboard-header">
        <h1>Welcome, KFC Nguyen Thai Hoc 👋</h1>
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
