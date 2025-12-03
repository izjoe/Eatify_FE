import { useContext, useEffect, useState, useCallback } from 'react';
import './TrackOrder.css';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';


const TrackOrder = () => {
  const { token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [showChat, setShowChat] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [currentMessage, setCurrentMessage] = useState('');

  const fetchUserOrders = useCallback(async () => {
    if (token) {
      try {
        const response = await axios.get('http://localhost:4000/api/order/userorders', {
          headers: { token }
        });
        if (response.data.success) {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user orders:", error);
        setOrders([
          {
            _id: '1023',
            restaurant: 'Cơm Tấm Sài Gòn',
            status: 'Delivering',
            items: [{ name: 'Cơm Suơn Bị Chả', quantity: 1 }],
            amount: 55000,
            estimatedTime: '15 phút nữa',
            currentStep: 2,
            sellerPhone: '0901234567'
          }
        ]);
      }
    }
  }, [token]);

  const handleCallSeller = (phoneNumber) => {
    if (!phoneNumber) {
      alert('Không tìm thấy số điện thoại nhà hàng');
      return;
    }
    window.location.href = `tel:${phoneNumber}`;
  };

  const toggleChat = (orderId) => {
    setShowChat(showChat === orderId ? null : orderId);
    const savedChats = localStorage.getItem(`chat_${orderId}`);
    if (savedChats && !chatMessages[orderId]) {
      setChatMessages(prev => ({
        ...prev,
        [orderId]: JSON.parse(savedChats)
      }));
    }
  };

  const sendMessage = (orderId) => {
    if (!currentMessage.trim()) return;

    const newMessage = {
      sender: 'buyer',
      message: currentMessage,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...(chatMessages[orderId] || []), newMessage];
    
    setChatMessages(prev => ({
      ...prev,
      [orderId]: updatedMessages
    }));

    localStorage.setItem(`chat_${orderId}`, JSON.stringify(updatedMessages));
    setCurrentMessage('');

    setTimeout(() => {
      const sellerReply = {
        sender: 'seller',
        message: 'Cảm ơn bạn! Đơn hàng đang được giao nhanh nhất có thể.',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      
      const updatedWithReply = [...updatedMessages, sellerReply];
      setChatMessages(prev => ({
        ...prev,
        [orderId]: updatedWithReply
      }));
      localStorage.setItem(`chat_${orderId}`, JSON.stringify(updatedWithReply));
    }, 2000);
  };

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  const renderItems = (items) => {
    return items.map((item) => `${item.quantity}x ${item.name}`).join(", ");
  };

  const getOrderStatus = (currentStep) => {
    const steps = ['Placed', 'Preparing', 'Delivering', 'Completed'];
    return steps[currentStep] || 'Placed';
  };

  const getProgressPercentage = (currentStep) => {
    return (currentStep / 3) * 100;
  };

  const activeOrders = orders.filter(order => order.status !== 'Completed');
  const historyOrders = orders.filter(order => order.status === 'Completed');

  return (
    <div className='track-order-page'>
      {/* Tabs */}
      <div className='track-order-tabs'>
        <button
          className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active Orders ({activeOrders.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>

      {/* Orders List */}
      <div className='track-order-list'>
        {activeTab === 'active' && activeOrders.length > 0 ? (
          activeOrders.map((order) => (
            <div key={order._id} className='track-order-card'>
              <div className='order-header'>
                <h3>{order.restaurant} - Order #{order._id}</h3>
                <p className='order-status'>{getOrderStatus(order.currentStep)}</p>
              </div>

              {/* Progress Timeline */}
              <div className='order-progress'>
                <div className='progress-bar-container'>
                  <div
                    className='progress-bar-fill'
                    style={{ width: `${getProgressPercentage(order.currentStep)}%` }}
                  ></div>
                </div>
                <div className='progress-steps'>
                  <div className={`step ${order.currentStep >= 0 ? 'completed' : ''}`}>
                    <div className='step-circle'>✓</div>
                    <p>Placed</p>
                  </div>
                  <div className={`step ${order.currentStep >= 1 ? 'completed' : ''}`}>
                    <div className='step-circle'>✓</div>
                    <p>Preparing</p>
                  </div>
                  <div className={`step ${order.currentStep >= 2 ? 'active' : ''}`}>
                    <div className='step-circle'>🚚</div>
                    <p>Delivering</p>
                  </div>
                  <div className={`step ${order.currentStep >= 3 ? 'completed' : ''}`}>
                    <div className='step-circle'></div>
                    <p>Completed</p>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className='order-details'>
                <p className='estimated-time'>Dự kiến giao: <strong>{order.estimatedTime}</strong></p>
                <div className='order-actions'>
                  <button 
                    className='btn-call'
                    onClick={() => handleCallSeller(order.sellerPhone)}
                  >
                    📞 Gọi nhà hàng
                  </button>
                  <button 
                    className='btn-chat'
                    onClick={() => toggleChat(order._id)}
                  >
                    💬 Chat
                  </button>
                </div>
              </div>

              {/* Chat Box */}
              {showChat === order._id && (
                <div className='chat-container'>
                  <div className='chat-header'>
                    <h4>Chat với {order.restaurant}</h4>
                    <button onClick={() => setShowChat(null)}>✕</button>
                  </div>
                  <div className='chat-messages'>
                    {(chatMessages[order._id] || []).map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`chat-message ${msg.sender === 'buyer' ? 'buyer-message' : 'seller-message'}`}
                      >
                        <div className='message-content'>
                          <p>{msg.message}</p>
                          <span className='message-time'>{msg.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='chat-input'>
                    <input 
                      type='text' 
                      placeholder='Nhập tin nhắn...'
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          sendMessage(order._id);
                        }
                      }}
                    />
                    <button onClick={() => sendMessage(order._id)}>Gửi</button>
                  </div>
                </div>
              )}

              {/* Items */}
              <div className='order-items'>
                <p className='items-label'>
                  {renderItems(order.items)} <span className='amount'>{order.amount.toLocaleString()}đ</span>
                </p>
              </div>
            </div>
          ))
        ) : activeTab === 'active' ? (
          <p className='no-orders'>Không có đơn hàng nào đang giao</p>
        ) : null}

        {activeTab === 'history' && historyOrders.length > 0 ? (
          historyOrders.map((order) => (
            <div key={order._id} className='track-order-card completed'>
              <div className='order-header'>
                <h3>{order.restaurant} - Order #{order._id}</h3>
              </div>
              <p className='status-completed'>✓ Đã nhận hàng</p>
            </div>
          ))
        ) : activeTab === 'history' ? (
          <p className='no-orders'>Không có lịch sử đơn hàng</p>
        ) : null}
      </div>
    </div>
  );
};

export default TrackOrder;