import { useState } from 'react';
import PropTypes from 'prop-types';
import './Menu.css';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';

const Menu = () => {
  const [category, setCategory] = useState("All");

  return (
    <div className="menu-page">
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
    </div>
  );
};

Menu.propTypes = {
  category: PropTypes.string,
  setCategory: PropTypes.func
};

export default Menu;
