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
      toast.error("⚠️ Image size should be less than 5MB");
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
        toast.success("✅ Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("⚠️ Failed to upload image");
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
        toast.error("⚠️ Please login to save profile");
        return;
    }

    // Validate required fields
    const requiredFields = {
      name: 'Full name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address'
    };

    const missingFields = [];
    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!form[field] || form[field].trim() === '') {
        missingFields.push(label);
      }
    });

    if (missingFields.length > 0) {
      toast.error(`⚠️ Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("⚠️ Please enter a valid email address");
      return;
    }

    // Validate phone format (Vietnamese phone)
    const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
    if (!phoneRegex.test(form.phone)) {
      toast.error("⚠️ Please enter a valid phone number (+84 or 0 + 9-10 digits)");
      return;
    }

    setLoading(true);
    try {
      // Extract filename from profileImage URL if it exists
      let profileImageFilename = "";
      if (form.profileImage) {
        const urlParts = form.profileImage.split('/');
        profileImageFilename = urlParts[urlParts.length - 1];
      }

      // Prepare data for backend (map to backend field names)
      const updateData = {
        name: form.name,
        email: form.email,
        dob: form.dob,
        address: form.address,
        gender: form.gender,
        phoneNumber: form.phone,
        profileImage: profileImageFilename
      };

      const response = await axios.put(`${url}/api/user/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success("✅ Profile updated successfully!");
        setIsEditing(false);
        // Reload profile to get updated data
        loadProfile();
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Save profile error:", err);
      toast.error("⚠️ Failed to save profile");
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
          {isEditing && (
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
          )}
        </div>
        <div className="profile-right">
          <label>
            Full name
            <input 
              name="name" 
              value={form.name} 
              onChange={onChange} 
              placeholder="Enter your name"
              disabled={!isEditing}
            />
          </label>
          <label>
            Email
            <input 
              name="email" 
              value={form.email} 
              onChange={onChange} 
              placeholder="Enter your email"
              disabled={!isEditing}
            />
          </label>
          <label>
            Date of birth
            <input 
              name="dob" 
              type="date" 
              value={form.dob} 
              onChange={onChange}
              disabled={!isEditing}
            />
          </label>
          <label>
            Phone
            <input 
              name="phone" 
              value={form.phone} 
              onChange={onChange} 
              placeholder="Enter phone number"
              disabled={!isEditing}
            />
          </label>
          <label>
            Gender
            <select 
              name="gender" 
              value={form.gender} 
              onChange={onChange}
              disabled={!isEditing}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Address
            <textarea 
              name="address" 
              value={form.address} 
              onChange={onChange} 
              placeholder="Enter your address"
              disabled={!isEditing}
            />
          </label>

          <div className="profile-actions">
            {!isEditing ? (
              <button type="button" className="btn-edit" onClick={handleEditToggle}>
                ✏️ Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button type="submit" className="btn-save" disabled={loading || uploadingImage}>
                  {loading ? "⏳ Saving..." : "💾 Save Edit"}
                </button>
                <button type="button" className="btn-cancel" onClick={handleEditToggle} disabled={loading}>
                  ❌ Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;