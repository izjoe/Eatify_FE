// layouts/SellerLayout.jsx
// Layout cho Seller với kiểm tra store completion

import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import SellerNavbar from '../components/SellerNavbar/SellerNavbar';
import axios from 'axios';
import './SellerLayout.css';

const SellerLayout = ({ children }) => {
  const { role, token, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [storeStatus, setStoreStatus] = useState({
    loading: true,
    hasStore: false,
    isComplete: false,
    store: null,
  });

  useEffect(() => {
    // Nếu không phải seller, redirect tới home
    if (role !== 'seller') {
      window.location.href = '/';
      return;
    }

    // Kiểm tra store completion
    const checkStoreCompletion = async () => {
      if (!token) return;
      
      try {
        const response = await axios.get(`${url}/api/seller/store/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.ok) {
          const store = response.data.store;
          const isComplete = response.data.completeness?.isComplete || false;
          
          setStoreStatus({
            loading: false,
            hasStore: !!store,
            isComplete: isComplete,
            store: store,
          });
          
          // Nếu store chưa complete và không đang ở trang setup, redirect
          if (!isComplete && location.pathname !== '/store-setup') {
            navigate('/store-setup');
          }
        } else {
          setStoreStatus({
            loading: false,
            hasStore: false,
            isComplete: false,
            store: null,
          });
          
          // Redirect to setup if not already there
          if (location.pathname !== '/store-setup') {
            navigate('/store-setup');
          }
        }
      } catch (error) {
        console.error('Error checking store:', error);
        setStoreStatus({
          loading: false,
          hasStore: false,
          isComplete: false,
          store: null,
        });
        
        // On error, still allow access but redirect to setup for new sellers
        if (location.pathname !== '/store-setup') {
          navigate('/store-setup');
        }
      }
    };

    checkStoreCompletion();
  }, [role, token, url, navigate, location.pathname]);

  // Nếu không có token, hiển thị loading
  if (!token) {
    return <div className="seller-loading">Loading...</div>;
  }

  // Loading state while checking store
  if (storeStatus.loading) {
    return (
      <div className="seller-loading">
        <div className="loading-spinner"></div>
        <p>Đang kiểm tra thông tin cửa hàng...</p>
      </div>
    );
  }

  // Nếu đang ở trang setup, chỉ hiển thị children (không có navbar)
  if (location.pathname === '/store-setup') {
    return (
      <div className="seller-layout setup-mode">
        {children}
      </div>
    );
  }

  // Normal seller layout with navbar
  return (
    <div className="seller-layout">
      <SellerNavbar storeData={storeStatus.store} />
      <div className="seller-layout-content">
        {children}
      </div>
    </div>
  );
};

export default SellerLayout;
