// pages/SellerPages/SellerDashboard/SellerDashboard.jsx
// Dashboard với dữ liệu thực từ API, không có sample data

import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../../context/StoreContext';
import axios from 'axios';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    todayRevenue: 0,
    revenueGrowth: 0,
    todayOrders: 0,
    pendingOrders: 0,
    rating: 0,
    totalReviews: 0,
    topSellingItems: [],
  });

  // Fetch store and dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      
      setLoading(true);
      
      try {
        // 1. Fetch store info
        const storeResponse = await axios.get(`${url}/api/seller/store/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (storeResponse.data.ok && storeResponse.data.store) {
          setStoreData(storeResponse.data.store);
          
          const sellerID = storeResponse.data.store.sellerID;
          
          // 2. Fetch orders for this seller (today)
          try {
            const ordersResponse = await axios.get(`${url}/api/order/seller/${sellerID}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            if (ordersResponse.data.success) {
              const orders = ordersResponse.data.data || [];
              const today = new Date().toDateString();
              
              // Filter today's orders
              const todayOrders = orders.filter(order => 
                new Date(order.createdAt).toDateString() === today
              );
              
              // Calculate today's revenue
              const todayRevenue = todayOrders.reduce((sum, order) => 
                sum + (order.totalAmount || 0), 0
              );
              
              // Count pending orders
              const pendingOrders = orders.filter(order => 
                order.status === 'pending' || order.status === 'processing'
              ).length;
              
              // Calculate top selling items from all orders
              const itemCounts = {};
              orders.forEach(order => {
                (order.items || []).forEach(item => {
                  const name = item.foodName || item.name;
                  if (name) {
                    itemCounts[name] = (itemCounts[name] || 0) + (item.quantity || 1);
                  }
                });
              });
              
              const topSellingItems = Object.entries(itemCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([name, count]) => ({ name, count }));
              
              setDashboardData(prev => ({
                ...prev,
                todayRevenue,
                todayOrders: todayOrders.length,
                pendingOrders,
                topSellingItems,
              }));
            }
          } catch (orderError) {
            console.log('No orders data available:', orderError.message);
          }
          
          // 3. Fetch rating data
          try {
            const ratingResponse = await axios.get(`${url}/api/seller/${sellerID}`);
            if (ratingResponse.data.success) {
              setDashboardData(prev => ({
                ...prev,
                rating: ratingResponse.data.data?.avgRating || 0,
                totalReviews: ratingResponse.data.data?.totalReviews || 0,
              }));
            }
          } catch (ratingError) {
            console.log('No rating data available:', ratingError.message);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, url]);

  if (loading) {
    return (
      <div className="seller-dashboard">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-dashboard">
      <div className="seller-dashboard-header">
        <h1>Welcome, {storeData?.storeName || 'Seller'} 👋</h1>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => navigate('/seller-revenue')} style={{ cursor: 'pointer' }}>
          <div className="stat-content">
            <p className="stat-label">Today&apos;s Revenue</p>
            <p className="stat-value">
              {dashboardData.todayRevenue > 0 
                ? `${dashboardData.todayRevenue.toLocaleString()}đ` 
                : '0đ'}
            </p>
            {dashboardData.revenueGrowth !== 0 && (
              <p className={`stat-growth ${dashboardData.revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
                {dashboardData.revenueGrowth >= 0 ? '+' : ''}{dashboardData.revenueGrowth}%
              </p>
            )}
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/seller-orders')} style={{ cursor: 'pointer' }}>
          <div className="stat-content">
            <p className="stat-label">Today&apos;s Orders</p>
            <p className="stat-value">{dashboardData.todayOrders}</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/seller-orders')} style={{ cursor: 'pointer' }}>
          <div className="stat-content">
            <p className="stat-label">Pending</p>
            <p className="stat-value">{dashboardData.pendingOrders}</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/seller-profile')} style={{ cursor: 'pointer' }}>
          <div className="stat-content">
            <p className="stat-label">Rating</p>
            <p className="stat-value">
              {dashboardData.rating > 0 ? dashboardData.rating.toFixed(1) : '-'}
            </p>
            {dashboardData.totalReviews > 0 && (
              <p className="stat-reviews">({dashboardData.totalReviews} reviews)</p>
            )}
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
            {dashboardData.todayRevenue > 0 ? (
              <div className="revenue-display">
                <p className="revenue-amount">{dashboardData.todayRevenue.toLocaleString()}đ</p>
                <p className="revenue-label">Doanh thu hôm nay</p>
              </div>
            ) : (
              <div className="empty-state">
                <p>📊 Chưa có doanh thu hôm nay</p>
                <p className="empty-hint">Doanh thu sẽ được hiển thị khi có đơn hàng</p>
              </div>
            )}
          </div>
        </div>

        <div className="top-items-section">
          <h2>Top Selling Items</h2>
          <div className="top-items-list">
            {dashboardData.topSellingItems.length > 0 ? (
              dashboardData.topSellingItems.map((item, index) => (
                <div className="top-item" key={index}>
                  <div className="top-item-name">{item.name}</div>
                  <div className="top-item-count">({item.count})</div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>Chưa có dữ liệu bán hàng</p>
                <button 
                  className="add-menu-btn"
                  onClick={() => navigate('/manage-menu')}
                >
                  + Thêm món vào menu
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
