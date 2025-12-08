// pages/SellerPages/StoreSetup/StoreSetup.jsx
// Trang bắt buộc seller mới phải hoàn thành trước khi truy cập dashboard

import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../../context/StoreContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import './StoreSetup.css';

const StoreSetup = () => {
  const { url, token, setToken, setRole } = useContext(StoreContext);
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: Store Info, 2: Add Menu Item
  const [loading, setLoading] = useState(false);
  const [storeData, setStoreData] = useState(null);

  // Logout handler
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userID');
    localStorage.removeItem('userName');
    localStorage.removeItem('displayName');
    
    // Clear context
    setToken('');
    setRole('buyer');
    
    toast.success('Đã đăng xuất');
    
    // Redirect to home
    window.location.href = '/';
  };
  
  // Store form data
  const [storeForm, setStoreForm] = useState({
    storeName: '',
    storeDescription: '',
    storeAddress: '',
    storePhone: '',
    storeEmail: '',
    storeImage: '',
  });
  
  // Menu item form data
  const [menuForm, setMenuForm] = useState({
    foodName: '',
    description: '',
    price: '',
    category: '',
    foodImage: '',
    stock: 10,
  });

  // Check existing store on mount
  useEffect(() => {
    const checkExistingStore = async () => {
      if (!token) return;
      
      try {
        const response = await axios.get(`${url}/api/seller/store/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success && response.data.data) {
          const store = response.data.data;
          setStoreData(store);
          
          // Pre-fill form with existing data
          setStoreForm({
            storeName: store.storeName || '',
            storeDescription: store.storeDescription || '',
            storeAddress: store.storeAddress || '',
            storePhone: store.storePhone || '',
            storeEmail: store.storeEmail || '',
            storeImage: store.storeImage || '',
          });
          
          // If store is complete (has name, address, image), go to step 2 or dashboard
          if (store.isComplete) {
            // Store is complete, redirect to dashboard
            navigate('/seller-dashboard');
          } else if (store.storeName && store.storeAddress) {
            // Has basic info, go to step 2 (add menu)
            setStep(2);
          }
        }
      } catch (error) {
        console.error('Error checking store:', error);
        // 404 is expected for new sellers - don't show error
      }
    };
    
    checkExistingStore();
  }, [token, url, navigate]);

  const handleStoreFormChange = (e) => {
    const { name, value } = e.target;
    setStoreForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMenuFormChange = (e) => {
    const { name, value } = e.target;
    setMenuForm(prev => ({ 
      ...prev, 
      [name]: name === 'price' || name === 'stock' ? Number(value) : value 
    }));
  };

  // Step 1: Save Store Info
  const handleSaveStore = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['storeName', 'storeAddress'];
    const missingFields = requiredFields.filter(f => !storeForm[f]?.trim());
    
    if (missingFields.length > 0) {
      toast.error(`Vui lòng điền đầy đủ: ${missingFields.join(', ')}`);
      return;
    }
    
    setLoading(true);
    
    try {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('storeName', storeForm.storeName);
      formData.append('storeDescription', storeForm.storeDescription || '');
      formData.append('storeAddress', storeForm.storeAddress);
      
      // If there's a new image file, append it
      if (storeForm.storeImageFile) {
        formData.append('storeImage', storeForm.storeImageFile);
      }
      
      const response = await axios.post(`${url}/api/seller/store`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        toast.success('Thông tin cửa hàng đã được lưu!');
        setStoreData(response.data.data);
        setStep(2); // Move to menu step
      } else {
        toast.error(response.data.message || 'Lỗi khi lưu thông tin');
      }
    } catch (error) {
      console.error('Save store error:', error);
      toast.error(error.response?.data?.message || 'Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Add First Menu Item
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['foodName', 'description', 'price', 'category', 'foodImage'];
    const missingFields = requiredFields.filter(f => !menuForm[f]);
    
    if (missingFields.length > 0) {
      toast.error(`Vui lòng điền đầy đủ: ${missingFields.join(', ')}`);
      return;
    }
    
    if (!storeData?.sellerID) {
      toast.error('Vui lòng hoàn thành thông tin cửa hàng trước');
      setStep(1);
      return;
    }
    
    setLoading(true);
    
    console.log('📤 Sending menu item to API:', {
      foodName: menuForm.foodName,
      category: menuForm.category,
      price: menuForm.price,
    });
    
    try {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('foodName', menuForm.foodName);
      formData.append('description', menuForm.description);
      formData.append('price', menuForm.price);
      formData.append('category', menuForm.category);
      formData.append('stock', menuForm.stock || 10);
      
      // If foodImage is base64, convert to blob
      if (menuForm.foodImage && menuForm.foodImage.startsWith('data:')) {
        const response = await fetch(menuForm.foodImage);
        const blob = await response.blob();
        formData.append('foodImage', blob, 'food-image.jpg');
      }
      
      const response = await axios.post(
        `${url}/api/food/add`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      
      console.log('📥 API Response:', response.data);
      
      if (response.data.success) {
        toast.success('🎉 Chúc mừng! Cửa hàng của bạn đã sẵn sàng!');
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/seller-dashboard');
        }, 1500);
      } else {
        toast.error(response.data.message || 'Lỗi khi thêm món');
      }
    } catch (error) {
      console.error('Add menu item error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Lỗi thêm món ăn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="store-setup">
      {/* Logout button */}
      <button className="setup-logout-btn" onClick={handleLogout}>
        🚪 Đăng xuất
      </button>
      
      <div className="setup-container">
        <div className="setup-header">
          <h1>🏪 Thiết lập cửa hàng của bạn</h1>
          <p>Hoàn thành các bước sau để bắt đầu bán hàng trên Eatify</p>
        </div>

        {/* Progress Steps */}
        <div className="setup-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">{step > 1 ? '✓' : '1'}</div>
            <div className="step-label">Thông tin cửa hàng</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Thêm món đầu tiên</div>
          </div>
        </div>

        {/* Step 1: Store Info Form */}
        {step === 1 && (
          <form className="setup-form" onSubmit={handleSaveStore}>
            <h2>Thông tin cửa hàng</h2>
            <p className="form-subtitle">Tất cả các trường đều bắt buộc</p>
            
            <div className="form-group">
              <label>Tên cửa hàng *</label>
              <input
                type="text"
                name="storeName"
                value={storeForm.storeName}
                onChange={handleStoreFormChange}
                placeholder="VD: Quán Phở Việt"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Mô tả cửa hàng *</label>
              <textarea
                name="storeDescription"
                value={storeForm.storeDescription}
                onChange={handleStoreFormChange}
                placeholder="Mô tả ngắn về cửa hàng của bạn..."
                rows={3}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Số điện thoại *</label>
                <input
                  type="tel"
                  name="storePhone"
                  value={storeForm.storePhone}
                  onChange={handleStoreFormChange}
                  placeholder="0901234567"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="storeEmail"
                  value={storeForm.storeEmail}
                  onChange={handleStoreFormChange}
                  placeholder="store@example.com"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Địa chỉ *</label>
              <input
                type="text"
                name="storeAddress"
                value={storeForm.storeAddress}
                onChange={handleStoreFormChange}
                placeholder="123 Nguyễn Huệ, Q1, TP.HCM"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Ảnh cửa hàng *</label>
              <div className="image-upload-container">
                <input
                  type="file"
                  id="storeImageUpload"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Preview image
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setStoreForm(prev => ({ ...prev, storeImage: reader.result, storeImageFile: file }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="file-input"
                />
                <label htmlFor="storeImageUpload" className="file-upload-label">
                  {storeForm.storeImage ? '📷 Đổi ảnh' : '📷 Chọn ảnh từ máy'}
                </label>
              </div>
              {storeForm.storeImage && (
                <div className="image-preview">
                  <img src={storeForm.storeImage} alt="Store preview" onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Tiếp tục →'}
            </button>
          </form>
        )}

        {/* Step 2: Add First Menu Item */}
        {step === 2 && (
          <form className="setup-form" onSubmit={handleAddMenuItem}>
            <h2>Thêm món ăn đầu tiên</h2>
            <p className="form-subtitle">Bạn cần ít nhất 1 món để hoàn tất thiết lập</p>
            
            <div className="form-group">
              <label>Tên món *</label>
              <input
                type="text"
                name="foodName"
                value={menuForm.foodName}
                onChange={handleMenuFormChange}
                placeholder="VD: Phở Bò Tái"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Mô tả món *</label>
              <textarea
                name="description"
                value={menuForm.description}
                onChange={handleMenuFormChange}
                placeholder="Mô tả chi tiết món ăn..."
                rows={3}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Giá (VNĐ) *</label>
                <input
                  type="number"
                  name="price"
                  value={menuForm.price}
                  onChange={handleMenuFormChange}
                  placeholder="45000"
                  min="1000"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Danh mục *</label>
                <select
                  name="category"
                  value={menuForm.category}
                  onChange={handleMenuFormChange}
                  required
                >
                  <option value="">Chọn danh mục</option>
                  <option value="Vietnamese">Vietnamese</option>
                  <option value="Noodles">Noodles</option>
                  <option value="Rice">Rice</option>
                  <option value="Chicken">Chicken</option>
                  <option value="Burger">Burger</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Số lượng</label>
                <input
                  type="number"
                  name="stock"
                  value={menuForm.stock}
                  onChange={handleMenuFormChange}
                  placeholder="10"
                  min="0"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Ảnh món ăn *</label>
              <div className="image-upload-container">
                <input
                  type="file"
                  id="foodImageUpload"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Check file size (max 5MB)
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error('Ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB');
                        return;
                      }
                      // Preview image as base64
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setMenuForm(prev => ({ ...prev, foodImage: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="file-input"
                />
                <label htmlFor="foodImageUpload" className="file-upload-label">
                  {menuForm.foodImage ? '📷 Đổi ảnh' : '📷 Chọn ảnh từ máy'}
                </label>
              </div>
              {menuForm.foodImage && (
                <div className="image-preview">
                  <img src={menuForm.foodImage} alt="Food preview" onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
            </div>
            
            <div className="form-actions">
              <button type="button" className="back-btn" onClick={() => setStep(1)}>
                ← Quay lại
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Đang lưu...' : '🎉 Hoàn tất thiết lập'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StoreSetup;
