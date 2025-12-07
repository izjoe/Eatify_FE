import { useContext, useState, useMemo } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { food_images, food_name_to_image, assets } from "../../assets/frontend_assets/assets";

const Cart = () => {
  const {
    food_list,
    cartItems,
    removeFromCart,
    getTotalCartAmount,
    clearCart,
    url,
    token
  } = useContext(StoreContext);

  const navigate = useNavigate();
  
  // State cho popup QR
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [currentRestaurantIndex, setCurrentRestaurantIndex] = useState(0);
  const [restaurantOrders, setRestaurantOrders] = useState([]);

  // Hàm lấy ảnh từ tên món hoặc filename
  const getImageSrc = (item) => {
    if (item.image && food_images[item.image]) {
      return food_images[item.image];
    }
    
    const foodName = item.name || item.foodName;
    if (foodName) {
      if (food_name_to_image[foodName]) {
        return food_name_to_image[foodName];
      }
      const matchedKey = Object.keys(food_name_to_image).find(key => 
        foodName.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(foodName.toLowerCase())
      );
      if (matchedKey) {
        return food_name_to_image[matchedKey];
      }
    }
    
    if (item.image) {
      return `${url}/images/${item.image}`;
    }
    return null;
  };

  // Nhóm các món theo nhà hàng (sellerID)
  const groupedByRestaurant = useMemo(() => {
    const groups = {};
    
    food_list.forEach(item => {
      if (cartItems[item._id] > 0) {
        const sellerID = item.sellerID || 'unknown';
        const sellerName = item.sellerName || item.storeName || 'Nhà hàng';
        
        if (!groups[sellerID]) {
          groups[sellerID] = {
            sellerID,
            sellerName,
            items: [],
            total: 0
          };
        }
        
        groups[sellerID].items.push({
          ...item,
          quantity: cartItems[item._id],
          subtotal: item.price * cartItems[item._id]
        });
        groups[sellerID].total += item.price * cartItems[item._id];
      }
    });
    
    return Object.values(groups);
  }, [food_list, cartItems]);

  const handleProceedToCheckout = async () => {
    // Check authentication
    if (!token) {
      toast.error("⚠️ Vui lòng đăng nhập trước!");
      return;
    }

    if (getTotalCartAmount() === 0) {
      toast.error("⚠️ Giỏ hàng trống!");
      return;
    }

    try {
      // Call API to get profile and validate required fields
      const response = await axios.get(`${url}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.data.success) {
        toast.error("⚠️ Không thể tải thông tin. Vui lòng thử lại.");
        return;
      }

      const profile = response.data.user || response.data.data || response.data;
      
      // Chỉ kiểm tra 3 trường bắt buộc: name, phoneNumber, address
      const missingFields = [];
      if (!profile.name || profile.name.trim() === '') {
        missingFields.push('Họ tên');
      }
      if (!profile.phoneNumber || profile.phoneNumber.trim() === '') {
        missingFields.push('Số điện thoại');
      }
      if (!profile.address || profile.address.trim() === '') {
        missingFields.push('Địa chỉ');
      }

      if (missingFields.length > 0) {
        toast.error(`⚠️ Vui lòng điền đầy đủ: ${missingFields.join(', ')}`);
        navigate('/profile');
        return;
      }

      // Mở popup QR thanh toán
      setRestaurantOrders(groupedByRestaurant);
      setCurrentRestaurantIndex(0);
      setShowQRPopup(true);
      
    } catch (error) {
      console.error("Profile validation error:", error);
      toast.error("⚠️ Vui lòng hoàn thành hồ sơ trước!");
      navigate('/profile');
    }
  };

  // Xử lý khi user xác nhận đã thanh toán cho 1 nhà hàng
  const handlePaymentConfirm = async () => {
    const currentOrder = restaurantOrders[currentRestaurantIndex];
    
    try {
      toast.success(`✅ Đã xác nhận thanh toán cho ${currentOrder.sellerName}!`);
      
      // Nếu còn nhà hàng khác, chuyển sang nhà hàng tiếp theo
      if (currentRestaurantIndex < restaurantOrders.length - 1) {
        setCurrentRestaurantIndex(currentRestaurantIndex + 1);
      } else {
        // Đã thanh toán hết, đóng popup và chuyển trang
        setShowQRPopup(false);
        toast.success("🎉 Đặt hàng thành công!");
        
        // Clear cart hoặc navigate
        if (clearCart) {
          clearCart();
        }
        navigate('/myorders');
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("❌ Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  // Đóng popup
  const handleClosePopup = () => {
    setShowQRPopup(false);
    setCurrentRestaurantIndex(0);
  };

  // Lấy thông tin nhà hàng hiện tại trong popup
  const currentRestaurant = restaurantOrders[currentRestaurantIndex];

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
                  <img src={getImageSrc(item)} alt={item.name} />
                  <p>{item.name}</p>
                  <p>{item.price.toLocaleString('vi-VN')}đ</p>
                  <p>{cartItems[item._id]}</p>
                  <p>{(item.price * cartItems[item._id]).toLocaleString('vi-VN')}đ</p>
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
              <b>{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount().toLocaleString('vi-VN')}đ</b>
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

      {/* QR Payment Popup */}
      {showQRPopup && currentRestaurant && (
        <div className="qr-popup-overlay">
          <div className="qr-popup">
            <button className="qr-popup-close" onClick={handleClosePopup}>×</button>
            
            <h2>Thanh toán đơn hàng</h2>
            
            {restaurantOrders.length > 1 && (
              <p className="qr-popup-progress">
                Thanh toán {currentRestaurantIndex + 1}/{restaurantOrders.length}
              </p>
            )}
            
            <div className="qr-popup-restaurant">
              <p className="qr-label">Có sản hàng</p>
              <h3>{currentRestaurant.sellerName}</h3>
            </div>
            
            <p className="qr-popup-total">
              Tổng cộng: {currentRestaurant.total.toLocaleString('vi-VN')}đ
            </p>
            
            <div className="qr-popup-code">
              <img src={assets.qr_code} alt="QR Code thanh toán" />
            </div>
            
            <p className="qr-popup-instruction">
              Quét mã QR bằng ứng dụng ngân hàng hoặc ví điện tử để thanh toán trực tiếp cho quán.
            </p>
            
            <button className="qr-popup-confirm" onClick={handlePaymentConfirm}>
              {currentRestaurantIndex < restaurantOrders.length - 1 
                ? `Tôi đã thanh toán → Tiếp theo`
                : `Tôi đã thanh toán`
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
