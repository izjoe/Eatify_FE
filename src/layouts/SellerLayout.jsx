import { useContext, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';
import SellerNavbar from '../components/SellerNavbar/SellerNavbar';
import './SellerLayout.css';

const SellerLayout = ({ children }) => {
  const { role, token } = useContext(StoreContext);

  useEffect(() => {
    // Nếu không phải seller, redirect tới home
    if (role !== 'seller') {
      window.location.href = '/';
    }
  }, [role]);

  // Nếu không có token, hiển thị loading hoặc redirect
  if (!token) {
    return <div>Loading...</div>;
  }

  return (
    <div className="seller-layout">
      <SellerNavbar />
      <div className="seller-layout-content">
        {children}
      </div>
    </div>
  );
};

export default SellerLayout;
