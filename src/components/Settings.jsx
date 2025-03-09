import React from 'react';
import '../styles/Settings.css';

const Settings = () => {
  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Settings</h2>
      </div>
      <div className="settings-content">
        <div className="tabs-section">
          <button className="tab-button">General</button>
          <button className="tab-button">Notifications</button>
          <button className="tab-button">Users</button>
        </div>
        <div className="profile-section">
          <div className="profile-picture">
            <img src="https://via.placeholder.com/100" alt="Profile" />
          </div>
          <div className="profile-buttons">
            <button className="delete-button">🗑</button>
            <button className="upload-button">Upload</button>
          </div>
        </div>
        <div className="settings-options">
          <div className="settings-option">
            <span className="option-label">Name</span>
            <span className="option-value">John Doe</span>
            <button className="edit-button">Edit</button>
          </div>
          <div className="settings-option">
            <span className="option-label">Username</span>
            <span className="option-value">JohnDoe123</span>
            <button className="edit-button">Edit</button>
          </div>
          <div className="settings-option">
            <span className="option-label">Password</span>
            <span className="option-value">a******23</span>
            <button className="edit-button">Edit</button>
          </div>
          <div className="settings-option">
            <span className="option-label">Contacts</span>
            <span className="option-value">09*******4</span>
            <button className="edit-button">Edit</button>
          </div>
          <div className="settings-option">
            <span className="option-label">Theme</span>
            <span className="option-value">Light Mode</span>
            <button className="edit-button">Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
