import './SellerProfile.css';
import { useState } from 'react';

const SellerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    storeName: 'KFC Nguyễn Thái Học',
    email: 'kfc@example.com',
    phone: '0123456789',
    address: 'Số 123 Đường Nguyễn Thái Học, Quận 1, TP.HCM',
    rating: 4.8,
    description: 'Nhà hàng fried chicken hàng đầu',
  });

  const [tempProfile, setTempProfile] = useState(profile);

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

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="seller-profile">
      <div className="profile-header">
        <h1>Store Information</h1>
      </div>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-form">
            <div className="form-group">
              <label>Store Name</label>
              <input 
                type="text" 
                name="storeName"
                value={isEditing ? tempProfile.storeName : profile.storeName}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email"
                value={isEditing ? tempProfile.email : profile.email}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input 
                type="tel" 
                name="phone"
                value={isEditing ? tempProfile.phone : profile.phone}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea 
                name="address"
                value={isEditing ? tempProfile.address : profile.address}
                onChange={handleChange}
                readOnly={!isEditing}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                name="description"
                value={isEditing ? tempProfile.description : profile.description}
                onChange={handleChange}
                readOnly={!isEditing}
              ></textarea>
            </div>
            
            {isEditing ? (
              <div className="button-group">
                <button className="save-btn" onClick={handleSave}>Save Changes</button>
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
              <div className="rating-number">{profile.rating}/5</div>
              <div className="rating-stars">⭐⭐⭐⭐⭐</div>
            </div>
            <p className="review-count">{120} reviews</p>
          </div>

          <div className="customer-reviews">
            <h2>Customer Reviews</h2>
            <div className="reviews-list">
              <div className="review-item">
                <div className="reviewer-name">Nguyễn Văn A</div>
                <div className="reviewer-rating">5 ⭐</div>
                <div className="reviewer-comment">Great food, nice service!</div>
              </div>
              <div className="review-item">
                <div className="reviewer-name">Trần Thị B</div>
                <div className="reviewer-rating">4 ⭐</div>
                <div className="reviewer-comment">Good taste, fast delivery.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
