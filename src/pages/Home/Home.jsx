import { useState, useContext } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import { StoreContext } from '../../context/StoreContext';

const Home = () => {
  const [category, setCategory] = useState("All");
  const { searchTerm } = useContext(StoreContext);
  
  return (
    <div>
      {!searchTerm && <Header />}
      {!searchTerm && <ExploreMenu category={category} setCategory={setCategory} />}
      <FoodDisplay category={category} />
    </div>
  );
};

export default Home;
