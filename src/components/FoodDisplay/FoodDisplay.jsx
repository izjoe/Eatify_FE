import { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types"; 
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const ITEMS_PER_PAGE = 8;

const FoodDisplay = ({ category }) => {
  const { food_list, searchTerm } = useContext(StoreContext);
  const [currentPage, setCurrentPage] = useState(1);

  const safeSearch = searchTerm || ""; 

  // Reset về trang 1 khi đổi category hoặc search
  useEffect(() => {
    setCurrentPage(1);
  }, [category, searchTerm]);

  // Lọc danh sách món theo category và search
  const filteredList = food_list.filter((item) => {
    if (!item || !item.name || !item.category) return false;
    return (
      (category === "All" || category === item.category) &&
      item.name.toLowerCase().includes(safeSearch.toLowerCase())
    );
  });

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedList = filteredList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    document.getElementById('food-display')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {paginatedList.map((item, index) => (
          <FoodItem
            key={item._id || index}
            id={item._id}
            name={item.name}
            description={item.description || ""}
            price={item.price}
            image={item.image}
            rating={item.rating}
          />
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ←
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          
          <button 
            className="pagination-btn" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

FoodDisplay.propTypes = {
  category: PropTypes.string.isRequired,
};

export default FoodDisplay;