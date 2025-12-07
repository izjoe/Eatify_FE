import { useContext, useEffect, useState, useCallback } from "react";
import "./Profile.css";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import axios from "axios";

const initialFormState = {
  name: "",
  email: "",
  dob: "",
  address: "",
  gender: "",
  phone: "",
  profileImage: "",
};

const Profile = () => {
  const { token, url } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!token) {
      setForm(initialFormState);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch profile from backend API
      const response = await axios.get(`${url}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const userData = response.data.data;
        // Map backend fields to form fields
        setForm({
          name: userData.name || "",
          email: userData.email || "",
          dob: userData.dob ? userData.dob.split('T')[0] : "", // Format date
          address: userData.address || "",
          gender: userData.gender || "",
          phone: userData.phoneNumber || "",
          profileImage: userData.profileImage ? `${url}/uploads/avatars/${userData.profileImage}` : "",
        });
      } else {
        toast.error("Failed to load profile");
        setForm(initialFormState);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      // Fallback to empty form
      setForm(initialFormState);
    } finally {
      setLoading(false);
    }
  }, [token, url]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("⚠️ Please select an image file");
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    
    // Upload to backend
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.post(`${url}/api/user/upload-avatar`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        // Update form with uploaded image URL
        setForm((f) => ({ ...f, profileImage: response.data.fullUrl }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit - reload from localStorage
      loadProfile();
    }
    setIsEditing(!isEditing);
  };

  const onSave = async (e) => {
    e.preventDefault();
    
    // Check authentication
    if (!token) {
        toast.error("Please login to save profile");
        return;
    }

    // Validate required fields (chỉ name là bắt buộc)
    if (!form.name || form.name.trim() === '') {
      toast.error("Full name is required");
      return;
    }

    // Validate and normalize phone format (Vietnamese phone) - nếu có nhập
    let normalizedPhone = '';
    if (form.phone && form.phone.trim() !== '') {
      const phoneRegex = /^(\+84|0)\d{9}$/;
      if (!phoneRegex.test(form.phone.trim())) {
        toast.error("Phone must be in 0XXXXXXXXX format (e.g., 0886038804)");
        return;
      }
      // Normalize phone to 0-format (convert +84xxxxxxxxx to 0xxxxxxxxx)
      normalizedPhone = form.phone.trim();
      if (normalizedPhone.startsWith('+84')) {
        normalizedPhone = '0' + normalizedPhone.substring(3);
      }
    }

    setLoading(true);
    try {
      // Extract filename from profileImage URL if it exists
      let profileImageFilename = "";
      if (form.profileImage && form.profileImage.trim() !== '') {
        const urlParts = form.profileImage.split('/');
        profileImageFilename = urlParts[urlParts.length - 1];
      }

      // Convert date from YYYY-MM-DD to DD-MM-YYYY format for backend
      let formattedDob = "";
      if (form.dob && form.dob.trim() !== '') {
        const [year, month, day] = form.dob.split('-');
        formattedDob = `${day}-${month}-${year}`;
      }

      // Prepare data for backend - chỉ gửi trường name là bắt buộc
      const updateData = {
        name: form.name.trim()
      };

      // Thêm các trường optional nếu có giá trị
      if (formattedDob) updateData.dob = formattedDob;
      if (form.address && form.address.trim()) updateData.address = form.address.trim();
      if (form.gender) updateData.gender = form.gender;
      if (normalizedPhone) updateData.phoneNumber = normalizedPhone;
      if (profileImageFilename) updateData.profileImage = profileImageFilename;

      console.log("📤 Sending update data:", updateData);

      const response = await axios.put(`${url}/api/user/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("✅ Server response:", response.data);

      if (response.data.success) {
        toast.success("✅ Profile updated successfully!");
        setIsEditing(false);
        // Reload profile to get updated data from server
        await loadProfile();
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("❌ Save profile error:", err);
      console.error("📋 Error details:", err.response?.data);
      
      const errorMsg = err.response?.data?.message 
        || err.response?.data?.errors?.join(', ')
        || "Failed to save profile";
      toast.error(`⚠️ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="profile-page">Loading...</div>;

  // Kiểm tra token - nếu chưa sign in thì hiển thị "Sign in first"
  if (!token) {
    return (
      <div className="profile-page">
        <div className="profile-signin-required">
          <div className="signin-message">
            <h2>Please Sign In First</h2>
            <p>You need to sign in to view and edit your profile information.</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ VIEW MODE - Hiển thị sau khi save thành công (isEditing = false)
  if (!isEditing) {
    // Format date for display (from YYYY-MM-DD to DD/MM/YYYY)
    const formatDateDisplay = (dateStr) => {
      if (!dateStr) return "Not set";
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    };

    return (
      <div className="profile-page">
        <div className="profile-view-card">
          {/* Avatar and Name Section */}
          <div className="profile-view-header">
            <div className="profile-view-avatar">
              {form.profileImage ? (
                <img src={form.profileImage} alt="profile" />
              ) : (
                <div className="avatar-placeholder-view">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="60" height="60">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
            </div>
            <h2 className="profile-view-name">{form.name || "User Name"}</h2>
            <p className="profile-view-email">{form.email}</p>
          </div>

          {/* Profile Info Section */}
          <div className="profile-view-info">
            <div className="profile-info-row">
              <span className="info-label">Date of Birth:</span>
              <span className="info-value">{formatDateDisplay(form.dob)}</span>
            </div>
            <div className="profile-info-row">
              <span className="info-label">Phone:</span>
              <span className="info-value">{form.phone || "Not set"}</span>
            </div>
            <div className="profile-info-row">
              <span className="info-label">Gender:</span>
              <span className="info-value">{form.gender || "Not set"}</span>
            </div>
            <div className="profile-info-row">
              <span className="info-label">Address:</span>
              <span className="info-value">{form.address || "Not set"}</span>
            </div>
          </div>

          {/* Edit Button */}
          <button 
            className="btn-edit-profile-again" 
            onClick={() => setIsEditing(true)}
          >
            Edit Profile Again
          </button>
        </div>
      </div>
    );
  }

  // ✅ EDIT MODE - Form để chỉnh sửa
  return (
    <div className="profile-page">
      <h2>Profile</h2>
      <p className="profile-sub">View and edit your profile information</p>
      <form className="profile-form" onSubmit={onSave}>
        <div className="profile-left">
          <div className="avatar">
            {form.profileImage ? (
              <img src={form.profileImage} alt="profile" className="profile-image-display" />
            ) : (
              <div className="avatar-placeholder">No Image</div>
            )}
          </div>
          <div className="image-upload-section">
            <input 
              type="file" 
              accept="image/*" 
              onChange={onImage} 
              id="profile-image-input"
              style={{ display: 'none' }}
              disabled={uploadingImage}
            />
            <label 
              htmlFor="profile-image-input" 
              className="upload-label"
              style={{ opacity: uploadingImage ? 0.6 : 1, cursor: uploadingImage ? 'not-allowed' : 'pointer' }}
            >
              {uploadingImage ? "⏳ Uploading..." : "📷 Choose Image"}
            </label>
            <p style={{ fontSize: "12px", color: "#666", marginTop: "8px", textAlign: "center" }}>
              {uploadingImage ? "Please wait..." : form.profileImage ? "Image uploaded ✓" : "No image selected"}
            </p>
          </div>
        </div>
        <div className="profile-right">
          <label>
            Full name
            <input 
              name="name" 
              value={form.name} 
              onChange={onChange} 
              placeholder="Enter your name"
            />
          </label>
          <label>
            Email
            <input 
              name="email" 
              value={form.email} 
              onChange={onChange} 
              placeholder="Enter your email"
              readOnly
              disabled
              style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            />
          </label>
          <label>
            Date of birth
            <input 
              name="dob" 
              type="date" 
              value={form.dob} 
              onChange={onChange}
            />
          </label>
          <label>
            Phone
            <input 
              name="phone" 
              value={form.phone} 
              onChange={onChange} 
              placeholder="0886038804"
            />
          </label>
          <label>
            Gender
            <select 
              name="gender" 
              value={form.gender} 
              onChange={onChange}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label>
            Address
            <textarea 
              name="address" 
              value={form.address} 
              onChange={onChange} 
              placeholder="Enter your address"
            />
          </label>

          <div className="profile-actions">
            <div className="edit-actions">
              <button type="submit" className="btn-save" disabled={loading || uploadingImage}>
                {loading ? "Saving..." : "Save Edit"}
              </button>
              <button type="button" className="btn-cancel" onClick={handleEditToggle} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;