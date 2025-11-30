import { useContext, useState } from "react";
import PropTypes from "prop-types";
import "./LoginPopup.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  // Lấy thêm hàm setRole từ Context
  const {url, setToken, setRole } = useContext(StoreContext);
  
  const [currentState, setCurrentState] = useState("Login");
  // State riêng để chọn role khi đăng ký
  const [roleSelection, setRoleSelection] = useState("buyer");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currentState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    // Nếu là đăng ký, gửi kèm roleSelection
    const payload = currentState === "Sign Up" ? { ...data, role: roleSelection } : data;

    try {
        const response = await axios.post(newUrl, payload);
        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            
            // --- CẬP NHẬT ROLE ---
            if (response.data.role) {
                setRole(response.data.role); // Cập nhật Context
                localStorage.setItem("role", response.data.role); // Cập nhật LocalStorage
            }
            // ---------------------

            if (response.data.data) {
                try {
                localStorage.setItem("profileData", JSON.stringify(response.data.data));
                } catch (e) {
                    // Log the error for debugging if saving profile data fails
                    console.warn("Unable to store profileData in localStorage:", e);
                }
            }
            toast.success("Login Successfully")
            setShowLogin(false);
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        toast.error("Network Error");
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          {currentState === "Login" ? <></> : (
            <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="Your name" required />
          )}
          <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Your email" required />
          <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Your password" required />
          
          {/* PHẦN CHỌN ROLE KHI ĐĂNG KÝ */}
          {currentState === "Sign Up" && (
             <div className="role-selection" style={{marginTop: "10px"}}>
                <p style={{marginBottom: "5px", fontWeight: "500"}}>I want to:</p>
                <div style={{display: "flex", gap: "15px"}}>
                    <label style={{display: "flex", alignItems: "center", gap: "5px", cursor: "pointer"}}>
                        <input type="radio" name="role" value="buyer" checked={roleSelection === "buyer"} onChange={(e) => setRoleSelection(e.target.value)} />
                        Buy Food
                    </label>
                    <label style={{display: "flex", alignItems: "center", gap: "5px", cursor: "pointer"}}>
                        <input type="radio" name="role" value="seller" checked={roleSelection === "seller"} onChange={(e) => setRoleSelection(e.target.value)} />
                        Sell Food
                    </label>
                </div>
             </div>
          )}
        </div>
        <button type="submit">{currentState === "Sign Up" ? "Create Account" : "Login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currentState === "Login" ? (
          <p>Create a new account? <span onClick={() => setCurrentState("Sign Up")}>Click here</span></p>
        ) : (
          <p>Already have an account? <span onClick={() => setCurrentState("Login")}>Login here</span></p>
        )}
      </form>
    </div>
  );
};
LoginPopup.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
};

export default LoginPopup;
