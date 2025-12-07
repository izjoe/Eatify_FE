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
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    displayName: "", // Tên hiển thị cho seller
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
    console.log("🔵 Form submitted!", currentState, data);
    
    setIsLoading(true);
    
    // ✅ Frontend validation
    if (currentState === "Sign Up") {
      if (!data.name || !data.email || !data.password) {
        toast.error("Please fill in all fields");
        setIsLoading(false);
        return;
      }
      if (data.password.length < 8) {
        toast.error("Password must be at least 8 characters");
        setIsLoading(false);
        return;
      }
      const hasUpperCase = /[A-Z]/.test(data.password);
      const hasLowerCase = /[a-z]/.test(data.password);
      const hasNumber = /[0-9]/.test(data.password);
      if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        toast.error("Password must contain uppercase, lowercase, and numbers");
        setIsLoading(false);
        return;
      }
    } else {
      if (!data.email || !data.password) {
        toast.error("Please enter email and password");
        setIsLoading(false);
        return;
      }
    }
    
    let newUrl = url;
    if (currentState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    const payload = currentState === "Sign Up" 
      ? { 
          ...data, 
          role: roleSelection,
          // Include displayName only for seller
          ...(roleSelection === "seller" && data.displayName ? { displayName: data.displayName } : {})
        } 
      : { email: data.email, password: data.password };
    console.log("Sending payload to:", newUrl, payload);

    try {
        const response = await axios.post(newUrl, payload);
        console.log("Response:", response.status, response.data);
        
        // ================================
        // 📝 SIGNUP FLOW
        // ================================
        if (currentState === "Sign Up") {
          // Backend should return 201 for successful registration
          if (response.status === 201 || response.data.success === true) {
            console.log("Signup successful! Role saved:", response.data.role);
            toast.success("Registration successful! Please login.");
            
            // Switch to login form
            setCurrentState("Login");
            setData({ name: "", displayName: "", email: "", password: "" });
            setIsLoading(false);
            return;
          }
        }
        
        // ================================
        // 🔐 LOGIN FLOW
        // ================================
        if (currentState === "Login") {
          if (response.status === 200 || response.data.success === true) {
            const { token, role, userID, name, displayName, profileCompleted, onboardingShown } = response.data;
            
            console.log("Login response:", { token: token?.substring(0, 20), role, userID, name, displayName });
            
            // Validate token
            if (!token) {
              toast.error("No authentication token received");
              setIsLoading(false);
              return;
            }
            
            // Validate and normalize role
            let userRole = "buyer"; // Default fallback
            if (role === "seller" || role === "buyer") {
              userRole = role;
            } else {
              console.warn("Invalid role from server:", role, "- defaulting to buyer");
            }
            
            console.log("Saving to localStorage:", { userRole, userID, name, displayName });
            
            // Save to localStorage FIRST (synchronous)
            localStorage.setItem("token", token);
            localStorage.setItem("role", userRole);
            if (userID) localStorage.setItem("userID", userID);
            if (name) localStorage.setItem("userName", name);
            if (displayName) localStorage.setItem("displayName", displayName);
            localStorage.setItem("profileCompleted", profileCompleted ? "true" : "false");
            localStorage.setItem("onboardingShown", onboardingShown ? "true" : "false");
            
            // Update React context
            setToken(token);
            setRole(userRole);
            
            console.log("All data saved. Role:", userRole);
            
            toast.success("Login successful!");
            setIsLoading(false);
            setShowLogin(false);
            
            // Force reload to ensure App.jsx reads correct role from localStorage
            console.log("Redirecting to", userRole === "seller" ? "/seller-dashboard" : "/");
            setTimeout(() => {
              window.location.href = userRole === "seller" ? "/seller-dashboard" : "/";
            }, 300);
            return;
          }
        }
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        setIsLoading(false);
        
        // Special case: Some axios versions treat 201 as error
        if (error.response?.status === 201 && currentState === "Sign Up") {
          console.log("Signup successful (201 in catch)");
          toast.success("Registration successful! Please login.");
          setCurrentState("Login");
          setData({ name: "", email: "", password: "" });
          return;
        }
        
        // Extract error message
        const errorMsg = 
          error.response?.data?.msg || 
          error.response?.data?.message || 
          error.response?.data?.error ||
          error.message || 
          "Cannot connect to server";
        
        toast.error(errorMsg);
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
          
          {/* Tên hiển thị cho seller khi đăng ký */}
          {currentState === "Sign Up" && roleSelection === "seller" && (
            <input 
              name="displayName" 
              onChange={onChangeHandler} 
              value={data.displayName} 
              type="text" 
              placeholder="Store/Shop Name (displayed to customers)" 
              required 
            />
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
        <button type='submit' disabled={isLoading}>
          {isLoading ? "Loading..." : (currentState === "Sign Up" ? "Create account" : "Login")}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currentState === "Login" ? (
          <p>Create a new account? <span onClick={() => {
            setCurrentState("Sign Up");
            setIsLoading(false);
          }}>Click here</span></p>
        ) : (
          <p>Already have an account? <span onClick={() => {
            setCurrentState("Login");
            setIsLoading(false);
          }}>Login here</span></p>
        )}
      </form>
    </div>
  );
};
LoginPopup.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
};

export default LoginPopup;
