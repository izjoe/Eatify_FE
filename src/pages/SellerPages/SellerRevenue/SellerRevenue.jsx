import './SellerRevenue.css';
import { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../../context/StoreContext';

const SellerRevenue = () => {
  const { url, token } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    todayOrders: 0,
    lastUpdated: null
  });

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${url}/api/revenue/seller`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setStats({
            totalRevenue: data.totalRevenue || 0,
            todayRevenue: data.todayRevenue || 0,
            todayOrders: data.todayOrders || 0,
            lastUpdated: new Date()
          });
        }
      } catch (error) {
        console.error('Error fetching revenue:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchRevenue();
    }
  }, [url, token]);

  if (loading) {
    return (
      <div className="seller-revenue">
        <div className="revenue-header">
          <h1>Báo cáo doanh thu</h1>
        </div>
        <div className="revenue-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const hasData = stats.totalRevenue > 0 || stats.todayOrders > 0;

  return (
    <div className="seller-revenue">
      <div className="revenue-header">
        <h1>Báo cáo doanh thu</h1>
      </div>

      {!hasData ? (
        <div className="empty-revenue">
          <span className="empty-icon">📊</span>
          <h3>Chưa có dữ liệu doanh thu</h3>
          <p>Khi có đơn hàng hoàn thành, doanh thu sẽ được thống kê ở đây</p>
        </div>
      ) : (
        <>
          <div className="revenue-stats">
            <div className="revenue-card">
              <h3>Tổng doanh thu</h3>
              <p className="revenue-amount">{stats.totalRevenue.toLocaleString()}đ</p>
              <p className="revenue-period">Tháng này</p>
            </div>
            <div className="revenue-card">
              <h3>Doanh thu hôm nay</h3>
              <p className="revenue-amount">{stats.todayRevenue.toLocaleString()}đ</p>
              <p className="revenue-period">
                {stats.lastUpdated ? `Cập nhật lúc ${stats.lastUpdated.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : ''}
              </p>
            </div>
            <div className="revenue-card">
              <h3>Số đơn hôm nay</h3>
              <p className="revenue-amount">{stats.todayOrders}</p>
              <p className="revenue-period">Đơn hàng</p>
            </div>
          </div>

          <div className="revenue-chart">
            <h2>Biểu đồ doanh thu chi tiết</h2>
            <div className="chart-placeholder">
              📊 Biểu đồ chi tiết sẽ được hiển thị ở đây
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SellerRevenue;
