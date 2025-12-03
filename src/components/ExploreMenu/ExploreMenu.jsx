import { useContext } from "react";
import PropTypes from "prop-types";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";

const ExploreMenu = ({ category, setCategory }) => {
  const { food_list } = useContext(StoreContext);

  const getCountByCategory = (categoryName) => {
    if (categoryName === "All") {
      return food_list.length;
    }
    const count = food_list.filter(item => item.category === categoryName).length;
    return count > 99 ? "99+" : count;
  };

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a detectable array of dishes. Our
        mission is to satisfy your cravings and elevate your dining experience,
        one delicious meal at a time.
      </p>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          const itemCount = getCountByCategory(item.menu_name);
          return (
            <div 
              onClick={() => setCategory(prev => prev === item.menu_image.name ? "All" : item.menu_name)} 
              key={index} 
              className="explore-menu-list-item"
            >
              <img 
                className={category === item.menu_name ? "active" : ""} 
                src={item.menu_image} 
                alt={item.menu_name} 
              />
              <p>
                {item.menu_name} <span style={{ color: '#666', fontSize: '0.9em' }}>({itemCount})</span>
              </p>
            </div>
          );
        })}
      </div>
      <hr/>
    </div>
  );
};

ExploreMenu.propTypes = {
  category: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired,
};

export default ExploreMenu;
