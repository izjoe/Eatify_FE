import { useContext, useEffect, useState } from "react";
import "./Profile.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { url, token } = useContext(StoreContext);
  const [loading, setLoading] = useState(false); // Sửa thành false mặc định để đỡ bị trắng trang lâu
  
  // 1. Định nghĩa trạng thái rỗng ban đầu
  const initialFormState = {
    name: "",
    email: "",
    dob: "",
    address: "",
    gender: "",
    phone: "",
    profileImage: "",
  };

  const [form, setForm] = useState(initialFormState);

  // 2. useEffect: Chạy mỗi khi token thay đổi
  useEffect(() => {
    const loadProfile = async () => {
      // TRƯỜNG HỢP 1: Đã Logout (Không có token)
      if (!token) {
        setForm(initialFormState); // Reset form về rỗng ngay lập tức
        setLoading(false);
        return; 
      }

      // TRƯỜNG HỢP 2: Có token -> Gọi API lấy dữ liệu
      setLoading(true);
      try {
        const resp = await axios.get(url + "/api/user/profile", {
          headers: { token },
        });

        if (resp.data && resp.data.success) {
          // Nếu backend có dữ liệu thì điền vào
          setForm((prev) => ({ ...prev, ...resp.data.data }));
        } else {
          // Nếu backend chưa có profile (user mới), giữ nguyên form rỗng hoặc lấy email từ login nếu có
          setForm(initialFormState);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token, url]); // Chạy lại khi token thay đổi

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

  const onSave = async (e) => {
    e.preventDefault();
    
    // Chỉ cho lưu khi đã đăng nhập
    if (!token) {
        toast.error("Please login to save profile");
        return;
    }

    try {
      const resp = await axios.post( // Thường update profile dùng POST hoặc PUT tùy backend bạn viết
        url + "/api/user/profile",
        { ...form },
        { headers: { token } }
      );
      if (resp.data && resp.data.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(resp.data.message || "Error updating profile");
      }
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
              <img src={form.profileImage} alt="profile" />
            ) : (
              <div className="avatar-placeholder">No Image</div>
            )}
            <input type="file" accept="image/*" onChange={onImage} />
            <p style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
              Chọn ảnh
              <br />
              chưa chọn ảnh nào
            </p>
          </div>
        </div>
        <div className="profile-right">
          <label>
            Full name
            <input name="name" value={form.name} onChange={onChange} placeholder="Enter your name"/>
          </label>
          <label>
            Email
            <input name="email" value={form.email} onChange={onChange} placeholder="Enter your email" />
          </label>
          <label>
            Date of birth
            <input name="dob" type="date" value={form.dob} onChange={onChange} />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={onChange} placeholder="Enter phone number"/>
          </label>
          <label>
            Gender
            <select name="gender" value={form.gender} onChange={onChange}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Address
            <textarea name="address" value={form.address} onChange={onChange} placeholder="Enter your address"/>
          </label>

          <div className="profile-actions">
            <button type="submit" className="btn-save">Save</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;