import './SellerProfile.css';
import { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const SellerProfile = () => {
  const { url, token } = useContext(StoreContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reviews, setReviews] = useState([]);
  
  const [profile, setProfile] = useState({
    storeName: '',
    storeEmail: '',
    storePhone: '',
    storeAddress: '',
    storeDescription: '',
    storeImage: '',
    rating: 0,
    totalReviews: 0,
    sellerID: '',
  });

  const [tempProfile, setTempProfile] = useState(profile);

  // Fetch store data from backend
  useEffect(() => {
    const fetchStoreData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await axios.get(`${url}/api/seller/store/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.ok && response.data.store) {
          const store = response.data.store;
          setProfile({
            storeName: store.storeName || '',
            storeEmail: store.storeEmail || '',
            storePhone: store.storePhone || '',
            storeAddress: store.storeAddress || '',
            storeDescription: store.storeDescription || '',
            storeImage: store.storeImage || '',
            rating: store.averageRating || 0,
            totalReviews: store.totalReviews || 0,
            sellerID: store.sellerID || '',
          });
          
          // Fetch reviews if available
          if (store.sellerID) {
            fetchReviews(store.sellerID);
          }
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
        toast.error('Không thể tải thông tin cửa hàng');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStoreData();
  }, [token, url]);
  
  // Fetch reviews for the store
  const fetchReviews = async (sellerID) => {
    try {
      const response = await axios.get(`${url}/api/seller/${sellerID}`);
      if (response.data.success && response.data.data) {
        // Get rating and reviews from seller detail
        setProfile(prev => ({
          ...prev,
          rating: response.data.data.avgRating || 0,
          totalReviews: response.data.data.totalReviews || 0,
        }));
        
        // Fetch actual reviews if there's an endpoint
        // For now, we'll show totalReviews count
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempProfile(profile);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axios.post(`${url}/api/seller/store`, {
        storeName: tempProfile.storeName,
        storeEmail: tempProfile.storeEmail,
        storePhone: tempProfile.storePhone,
        storeAddress: tempProfile.storeAddress,
        storeDescription: tempProfile.storeDescription,
        storeImage: tempProfile.storeImage,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.ok) {
        setProfile(tempProfile);
        setIsEditing(false);
        toast.success('Cập nhật thông tin thành công!');
      } else {
        toast.error(response.data.message || 'Lỗi khi cập nhật');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.response?.data?.message || 'Lỗi kết nối server');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempProfile(profile);
  };

  // Helper to get image URL
  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('data:')) return image; // Base64 image
    if (image.startsWith('http')) return image; // Full URL
    return `${url}/images/${image}`; // Backend path
  };

  // Generate star display based on rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;
    let stars = '⭐'.repeat(fullStars);
    if (hasHalf && fullStars < 5) stars += '⭐';
    return stars || '⭐';
  };

  if (loading) {
    return (
      <div className="seller-profile">
        <div className="profile-header">
          <h1>Store Information</h1>
        </div>
        <div className="loading-state">
          <p>Đang tải thông tin cửa hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-profile">
      <div className="profile-header">
        <h1>Store Information</h1>
      </div>

      <div className="profile-container">
        <div className="profile-card">
          {/* Store Image Section */}
          {profile.storeImage && (
            <div className="store-image-section">
              <img 
                src={getImageUrl(profile.storeImage)} 
                alt={profile.storeName || 'Store'} 
                className="store-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="profile-form">
            <div className="form-group">
              <label>Store Name</label>
              <input 
                type="text" 
                name="storeName"
                value={isEditing ? tempProfile.storeName : profile.storeName}
                onChange={handleChange}
                readOnly={!isEditing}
                placeholder="Tên cửa hàng"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="storeEmail"
                value={isEditing ? tempProfile.storeEmail : profile.storeEmail}
                onChange={handleChange}
                readOnly={!isEditing}
                placeholder="Email cửa hàng"
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input 
                type="tel" 
                name="storePhone"
                value={isEditing ? tempProfile.storePhone : profile.storePhone}
                onChange={handleChange}
                readOnly={!isEditing}
                placeholder="Số điện thoại"
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea 
                name="storeAddress"
                value={isEditing ? tempProfile.storeAddress : profile.storeAddress}
                onChange={handleChange}
                readOnly={!isEditing}
                placeholder="Địa chỉ cửa hàng"
              ></textarea>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                name="storeDescription"
                value={isEditing ? tempProfile.storeDescription : profile.storeDescription}
                onChange={handleChange}
                readOnly={!isEditing}
                placeholder="Mô tả cửa hàng"
              ></textarea>
            </div>
            
            {isEditing ? (
              <div className="button-group">
                <button 
                  className="save-btn" 
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Đang lưu...' : 'Save Changes'}
                </button>
                <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
              </div>
            ) : (
              <button className="edit-profile-btn" onClick={handleEdit}>Edit Information</button>
            )}
          </div>
        </div>

        <div className="profile-stats">
          <div className="overall-rating">
            <h2>Overall Rating</h2>
            <div className="rating-display">
              <div className="rating-number">{profile.rating > 0 ? profile.rating.toFixed(1) : '0'}/5</div>
              <div className="rating-stars">{renderStars(profile.rating)}</div>
            </div>
            <p className="review-count">{profile.totalReviews} reviews</p>
          </div>

          <div className="customer-reviews">
            <h2>Customer Reviews</h2>
            <div className="reviews-list">
              {profile.totalReviews > 0 ? (
                <p className="reviews-info">
                  Cửa hàng của bạn có {profile.totalReviews} đánh giá với điểm trung bình {profile.rating > 0 ? profile.rating.toFixed(1) : '0'} sao.
                </p>
              ) : (
                <p className="no-reviews">Chưa có đánh giá nào. Các đánh giá sẽ xuất hiện sau khi khách hàng đặt hàng và đánh giá.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
