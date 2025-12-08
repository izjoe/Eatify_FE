import './SellerOrders.css';
import { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../../context/StoreContext';
import { toast } from 'react-toastify';

const SellerOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${url}/api/order/seller-orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Không thể tải đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [url, token]);

  const handleAccept = async (orderId) => {
    try {
      const res = await fetch(`${url}/api/order/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId, status: 'Đã xác nhận' })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev =>
          prev.map(order =>
            order._id === orderId ? { ...order, status: 'Đã xác nhận' } : order
          )
        );
        toast.success('Đã xác nhận đơn hàng');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleReject = async (orderId) => {
    try {
      const res = await fetch(`${url}/api/order/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId, status: 'Đã huỷ' })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev =>
          prev.map(order =>
            order._id === orderId ? { ...order, status: 'Đã huỷ' } : order
          )
        );
        toast.success('Đã từ chối đơn hàng');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleComplete = async (orderId) => {
    try {
      const res = await fetch(`${url}/api/order/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId, status: 'Hoàn thành' })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev =>
          prev.map(order =>
            order._id === orderId ? { ...order, status: 'Hoàn thành' } : order
          )
        );
        toast.success('Đơn hàng đã hoàn thành');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
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
            onClick={() => handleAccept(order._id)}
          >
            Chấp nhận
          </button>
          <button
            className="action-btn reject"
            onClick={() => handleReject(order._id)}
          >
            Từ chối
          </button>
        </>
      );
    } else if (order.status === 'Đã xác nhận') {
      return (
        <button
          className="action-btn complete"
          onClick={() => handleComplete(order._id)}
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

  // Loading state
  if (loading) {
    return (
      <div className="seller-orders">
        <div className="orders-header">
          <h1>Quản lý đơn hàng</h1>
        </div>
        <div className="orders-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-orders">
      <div className="orders-header">
        <h1>Quản lý đơn hàng</h1>
      </div>

      <div className="orders-container">
        {orders.length === 0 ? (
          <div className="empty-orders">
            <span className="empty-icon">📦</span>
            <h3>Chưa có đơn hàng nào</h3>
            <p>Khi có khách hàng đặt hàng, đơn hàng sẽ hiển thị ở đây</p>
          </div>
        ) : (
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
                  <tr key={order._id}>
                    <td>#{order._id?.slice(-6).toUpperCase()}</td>
                    <td>{order.address?.firstName} {order.address?.lastName}</td>
                    <td>{order.amount?.toLocaleString()}đ</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>
                      {renderActionButtons(order)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;
