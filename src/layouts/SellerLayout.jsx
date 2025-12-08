// layouts/SellerLayout.jsx
// Layout cho Seller - Không bắt buộc setup, chỉ nhắc nhở

import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import SellerNavbar from '../components/SellerNavbar/SellerNavbar';
import { toast } from 'react-toastify';
import axios from 'axios';
import './SellerLayout.css';

const SellerLayout = ({ children }) => {
  const { role, token, url } = useContext(StoreContext);
  const location = useLocation();
  
  const [storeData, setStoreData] = useState(null);
  const [showProfileReminder, setShowProfileReminder] = useState(false);

  useEffect(() => {
    // Nếu không phải seller, redirect tới home
    if (role !== 'seller') {
      window.location.href = '/';
      return;
    }

    // Kiểm tra store - không bắt buộc, chỉ để hiện reminder
    const checkStore = async () => {
      if (!token) return;
      
      try {
        const response = await axios.get(`${url}/api/seller/store/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success && response.data.data) {
          setStoreData(response.data.data);
          
          // Kiểm tra nếu thiếu thông tin quan trọng
          const store = response.data.data;
          if (!store.storeName || !store.storeAddress) {
            setShowProfileReminder(true);
          }
        } else {
          // Không có store - hiện reminder
          setShowProfileReminder(true);
        }
      } catch (error) {
        // API lỗi - vẫn cho vào, hiện reminder
        console.log('Store check skipped:', error.message);
        setShowProfileReminder(true);
      }
    };

    checkStore();
  }, [role, token, url]);

  // Show reminder toast once
  useEffect(() => {
    if (showProfileReminder && location.pathname !== '/store-setup') {
      toast.info('👋 Hãy cập nhật thông tin cửa hàng trong phần Hồ sơ!', {
        position: 'top-right',
        autoClose: 5000,
        toastId: 'profile-reminder' // Prevent duplicate toasts
      });
    }
  }, [showProfileReminder, location.pathname]);

  // Nếu không có token, hiển thị loading
  if (!token) {
    return <div className="seller-loading">Loading...</div>;
  }

  // Nếu không phải seller
  if (role !== 'seller') {
    return <div className="seller-loading">Redirecting...</div>;
  }

  // Nếu đang ở trang setup, chỉ hiển thị children (không có navbar)
  if (location.pathname === '/store-setup') {
    return (
      <div className="seller-layout setup-mode">
        {children}
      </div>
    );
  }

  // Normal seller layout with navbar + reminder badge
  return (
    <div className="seller-layout">
      <SellerNavbar storeData={storeData} showProfileReminder={showProfileReminder} />
      <div className="seller-layout-content">
        {children}
      </div>
    </div>
  );
};

export default SellerLayout;
