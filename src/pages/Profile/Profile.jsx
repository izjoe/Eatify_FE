import { useContext, useEffect, useState } from "react";
import "./Profile.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { url, token } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    dob: "",
    address: "",
    gender: "",
    phone: "",
    profileImage: "",
  });

  useEffect(() => {
    const load = async () => {
      // try to load from backend if endpoint exists
      if (token) {
        try {
          const resp = await axios.get(url + "/api/user/profile", {
            headers: { token },
          });
          if (resp.data && resp.data.success && resp.data.data) {
            setForm((f) => ({ ...f, ...resp.data.data }));
            setLoading(false);
            return;
          }
        } catch (err) {
          // ignore, fallback to localStorage
        }
      }
      // fallback: load from localStorage
      const local = localStorage.getItem("profileData");
      if (local) {
        try {
          setForm(JSON.parse(local));
        } catch (e) {
          // ignore
        }
      }
      setLoading(false);
    };
    load();
  }, [token, url]);

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
    // try backend update
    if (token) {
      try {
        const resp = await axios.put(
          url + "/api/user/profile",
          { ...form },
          { headers: { token } }
        );
        if (resp.data && resp.data.success) {
          toast.success("Profile updated successfully");
          return;
        }
      } catch (err) {
        // ignore and fallback to local
      }
    }
    // fallback: save to localStorage
    localStorage.setItem("profileData", JSON.stringify(form));
    toast.success("Profile saved locally (backend endpoint not available)");
  };

  if (loading) return <div className="profile-page">Loading...</div>;

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
          </div>
        </div>
        <div className="profile-right">
          <label>
            Full name
            <input name="name" value={form.name} onChange={onChange} />
          </label>
          <label>
            Email
            <input name="email" value={form.email} onChange={onChange} />
          </label>
          <label>
            Date of birth
            <input name="dob" type="date" value={form.dob} onChange={onChange} />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={onChange} />
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
            <textarea name="address" value={form.address} onChange={onChange} />
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
