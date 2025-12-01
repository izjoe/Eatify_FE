import './SellerOrders.css';
import { useState } from 'react';

const SellerOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: '#12345',
      customer: 'Nguyễn Văn A',
      total: '250.000đ',
      status: 'Chờ xác nhận',
      time: '14:30'
    },
    {
      id: '#12344',
      customer: 'Trần Thị B',
      total: '180.000đ',
      status: 'Đã xác nhận',
      time: '13:15'
    },
    {
      id: '#12343',
      customer: 'Lê Văn C',
      total: '350.000đ',
      status: 'Hoàn thành',
      time: '12:00'
    },
    {
      id: '#12342',
      customer: 'Phạm Thị D',
      total: '120.000đ',
      status: 'Đã huỷ',
      time: '11:45'
    }
  ]);

  const handleAccept = (orderId) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: 'Đã xác nhận' } : order
      )
    );
  };

  const handleReject = (orderId) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: 'Đã huỷ' } : order
      )
    );
  };

  const handleComplete = (orderId) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: 'Hoàn thành' } : order
      )
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Chờ xác nhận':
        return 'pending';
      case 'Đã xác nhận':
        return 'confirmed';
      case 'Hoàn thành':
        return 'completed';
      case 'Đã huỷ':
        return 'cancelled';
      default:
        return '';
    }
  };

  const renderActionButtons = (order) => {
    if (order.status === 'Chờ xác nhận') {
      return (
        <>
          <button
            className="action-btn accept"
            onClick={() => handleAccept(order.id)}
          >
            Chấp nhận
          </button>
          <button
            className="action-btn reject"
            onClick={() => handleReject(order.id)}
          >
            Từ chối
          </button>
        </>
      );
    } else if (order.status === 'Đã xác nhận') {
      return (
        <button
          className="action-btn complete"
          onClick={() => handleComplete(order.id)}
        >
          Hoàn thành
        </button>
      );
    } else {
      return (
        <span className="no-action">Không có hành động</span>
      );
    }
  };

  return (
    <div className="seller-orders">
      <div className="orders-header">
        <h1>Quản lý đơn hàng</h1>
      </div>

      <div className="orders-container">
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thời gian</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.total}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.time}</td>
                  <td>
                    {renderActionButtons(order)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerOrders;
