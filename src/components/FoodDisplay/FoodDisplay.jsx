import { useContext } from "react";
import PropTypes from "prop-types"; 
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  // Lấy danh sách món ăn và từ khóa tìm kiếm từ Context
  const { food_list, searchTerm } = useContext(StoreContext);

  // --- CƠ CHẾ AN TOÀN (QUAN TRỌNG) ---
  // Nếu searchTerm bị undefined (do chưa config bên StoreContext), 
  // ta gán mặc định là chuỗi rỗng "" để không bị lỗi .toLowerCase()
  const safeSearch = searchTerm || ""; 
  // -----------------------------------

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          // ✅ Safe checks - prevent undefined errors
          if (!item || !item.name || !item.category) {
            return null;
          }
          
          // Logic lọc:
          // 1. Kiểm tra Category
          // 2. Kiểm tra tên món ăn với biến safeSearch
          if (
            (category === "All" || category === item.category) &&
            item.name.toLowerCase().includes(safeSearch.toLowerCase())
          ) {
            return (
              <FoodItem
                key={item._id || index}
                id={item._id}
                name={item.name}
                description={item.description || ""}
                price={item.price}
                image={item.image}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

FoodDisplay.propTypes = {
  category: PropTypes.string.isRequired,
};

export default FoodDisplay;