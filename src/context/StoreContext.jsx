/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  // Lưu ý: Bạn nên dùng process.env.VITE_API_URL nếu có, còn không thì giữ link cứng này
  const url = "https://food-delivery-backend-5b6g.onrender.com"; 
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [food_list, setFoodList] = useState([]);

  // --- 1. THÊM STATE SEARCH VÀ ROLE ---
  const [searchTerm, setSearchTerm] = useState("");
  // Mặc định role là buyer nếu không tìm thấy trong localStorage
  const [role, setRole] = useState(() => localStorage.getItem("role") || "buyer");
  // ------------------------------------

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      const response = await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Item Added to Cart");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      const response = await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Item Removed from Cart");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
            totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
        const response = await axios.get(url + "/api/food/list");
        if (response.data.success) {
          setFoodList(response.data.data);
        } else {
          toast.error("Error! Products are not fetching..");
        }
    } catch (error) {
        // toast.error("Server Error"); // Có thể comment lại để đỡ báo lỗi khi chưa bật server
    }
  };

  const loadCardData = async (token) => {
    try {
        const response = await axios.post(
            url + "/api/cart/get",
            {},
            { headers: { token } }
          );
          setCartItems(response.data.cartData);
    } catch (error) {
        console.log(error);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        // Load lại role từ localStorage để khi F5 không bị mất quyền
        setRole(localStorage.getItem("role") || "buyer");
        await loadCardData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    searchTerm,
    setSearchTerm,
    // --- 2. TRUYỀN ROLE RA NGOÀI ---
    role,
    setRole
    // -------------------------------
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;