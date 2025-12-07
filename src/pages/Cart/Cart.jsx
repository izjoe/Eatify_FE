import { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Cart = () => {
  const {
    food_list,
    cartItems,
    removeFromCart,
    getTotalCartAmount,
    url,
    token
  } = useContext(StoreContext);

  const navigate=useNavigate();

  const handleProceedToCheckout = async () => {
    // Check authentication
    if (!token) {
      toast.error("⚠️ Please sign in first!");
      return;
    }

    try {
      // Call API to get profile and validate required fields
      const response = await axios.get(`${url}/api/user/profile`, {
        headers: { token }
      });

      if (!response.data.success) {
        toast.error("⚠️ Failed to load profile. Please try again.");
        return;
      }

      const { isComplete, missingFields } = response.data;

      if (!isComplete) {
        toast.error(`⚠️ Please complete your profile first! Missing: ${missingFields.join(', ')}`);
        navigate('/profile');
        return;
      }

      // All validations passed - proceed to checkout
      navigate('/order');
      
    } catch (error) {
      console.error("Profile validation error:", error);
      toast.error("⚠️ Please complete your profile first!");
      navigate('/profile');
    }
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={url+"/images/"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>{(item.price * 2500).toLocaleString('vi-VN')}đ</p>
                  <p>{cartItems[item._id]}</p>
                  <p>{(item.price * cartItems[item._id] * 2500).toLocaleString('vi-VN')}đ</p>
                  <p onClick={() => removeFromCart(item._id)} className="cross">
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <b>Total</b>
              <b>{getTotalCartAmount() === 0 ? 0 : (getTotalCartAmount() * 2500).toLocaleString('vi-VN')}đ</b>
            </div>
          </div>
          <button onClick={handleProceedToCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promocode, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
