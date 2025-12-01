import './SellerRevenue.css';

const SellerRevenue = () => {
  return (
    <div className="seller-revenue">
      <div className="revenue-header">
        <h1>Báo cáo doanh thu</h1>
      </div>

      <div className="revenue-stats">
        <div className="revenue-card">
          <h3>Tổng doanh thu</h3>
          <p className="revenue-amount">25.000.000đ</p>
          <p className="revenue-period">Tháng này</p>
        </div>
        <div className="revenue-card">
          <h3>Doanh thu hôm nay</h3>
          <p className="revenue-amount">5.200.000đ</p>
          <p className="revenue-period">Cập nhật lúc 14:30</p>
        </div>
        <div className="revenue-card">
          <h3>Số đơn hôm nay</h3>
          <p className="revenue-amount">45</p>
          <p className="revenue-period">Đơn hàng</p>
        </div>
      </div>

      <div className="revenue-chart">
        <h2>Biểu đồ doanh thu chi tiết</h2>
        <div className="chart-placeholder">
          📊 Biểu đồ chi tiết sẽ được hiển thị ở đây
        </div>
      </div>
    </div>
  );
};

export default SellerRevenue;
