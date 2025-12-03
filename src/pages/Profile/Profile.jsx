import { useContext, useEffect, useState, useCallback } from "react";
import "./Profile.css";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

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
  const { token } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);

  const loadProfile = useCallback(() => {
    if (!token) {
      setForm(initialFormState);
      setLoading(false);
      return;
    }

    // Chỉ load từ localStorage nếu có data đã lưu
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        setForm(JSON.parse(savedProfile));
      } catch (err) {
        console.error("Error parsing saved profile:", err);
        setForm(initialFormState);
      }
    } else {
      // Nếu chưa có data, để trống
      setForm(initialFormState);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const onSave = (e) => {
    e.preventDefault();
    
    // Chỉ cho lưu khi đã đăng nhập
    if (!token) {
        toast.error("Please login to save profile");
        return;
    }

    try {
      // Lưu vào localStorage (FE storage)
      localStorage.setItem('userProfile', JSON.stringify(form));
      toast.success("Profile saved successfully");
      setIsEditing(false); // Thoát chế độ edit sau khi save
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
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
            {isEditing && (
              <>
                <input type="file" accept="image/*" onChange={onImage} />
                <p style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
                  Chọn ảnh
                  <br />
                  chưa chọn ảnh nào
                </p>
              </>
            )}
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
              <button type="button" className="btn-edit" onClick={() => setIsEditing(true)}>Edit Profile</button>
            ) : (
              <>
                <button type="submit" className="btn-save">Save</button>
                <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;