import './SellerSettings.css';
import { useState } from 'react';

const SellerSettings = () => {
  const [settings] = useState({
    notifications: true,
    emailAlerts: true,
  });

  return (
    <div className="seller-settings">
      <div className="settings-header">
        <h1>Settings</h1>
      </div>

      <div className="settings-container">
        <div className="settings-card">
          <h2>Notifications</h2>
          <div className="setting-item">
            <div className="setting-label">
              <p>Enable Notifications</p>
              <span className="setting-desc">Receive notifications for new orders</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={settings.notifications} readOnly />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <p>Email Alerts</p>
              <span className="setting-desc">Receive email when new orders arrive</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={settings.emailAlerts} readOnly />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-card danger">
          <h2>Danger Zone</h2>
          <button className="danger-btn">Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default SellerSettings;
