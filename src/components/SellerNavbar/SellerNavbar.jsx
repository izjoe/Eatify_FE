import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/frontend_assets/assets';
import './SellerNavbar.css';

const SellerNavbar = () => {
  const { setToken, setRole } = useContext(StoreContext);
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken('');
    setRole('buyer');
    navigate('/');
  };

  const handleMenuClick = (menuItem, path) => {
    setActiveMenu(menuItem);
    navigate(path);
  };

  return (
    <div className="seller-navbar">
      {/* Logo */}
      <div className="seller-navbar-logo">
        <img src={assets.logo} alt="eEatify" className="seller-navbar-logo-img" />
      </div>

      {/* Menu Items */}
      <div className="seller-navbar-menu">
        <div
          className={`seller-menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleMenuClick('dashboard', '/seller-dashboard')}
        >
          <span>Dashboard</span>
        </div>

        <div
          className={`seller-menu-item ${activeMenu === 'manage-menu' ? 'active' : ''}`}
          onClick={() => handleMenuClick('manage-menu', '/manage-menu')}
        >
          <span>Manage Menu</span>
        </div>

        <div
          className={`seller-menu-item ${activeMenu === 'orders' ? 'active' : ''}`}
          onClick={() => handleMenuClick('orders', '/seller-orders')}
        >
          <span>Orders</span>
        </div>

        <div
          className={`seller-menu-item ${activeMenu === 'revenue' ? 'active' : ''}`}
          onClick={() => handleMenuClick('revenue', '/seller-revenue')}
        >
          <span>Revenue</span>
        </div>

        <div
          className={`seller-menu-item ${activeMenu === 'profile' ? 'active' : ''}`}
          onClick={() => handleMenuClick('profile', '/seller-profile')}
        >
          <span>Profile</span>
        </div>

        <div
          className={`seller-menu-item ${activeMenu === 'promotions' ? 'active' : ''}`}
          onClick={() => handleMenuClick('promotions', '/seller-promotions')}
        >
          <span>Promotions</span>
        </div>

        <div
          className={`seller-menu-item ${activeMenu === 'settings' ? 'active' : ''}`}
          onClick={() => handleMenuClick('settings', '/seller-settings')}
        >
          <span>Settings</span>
        </div>
      </div>

      {/* Logout Button */}
      <div className="seller-navbar-footer">
        <button className="seller-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

SellerNavbar.propTypes = {};
export default SellerNavbar;
