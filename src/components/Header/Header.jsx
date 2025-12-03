import "./Header.css";
import { assets } from '../../assets/frontend_assets/assets';

const Header = () => {
  const scrollToMenu = () => {
    const menuSection = document.getElementById('explore-menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="header" style={{ backgroundImage: `url(${assets.header_img})` }}>
      <div className="header-contents">
        <h2>Order your favourite food here</h2>
        <button onClick={scrollToMenu}>View Menu</button>
      </div>
    </div>
  );
};

export default Header;
