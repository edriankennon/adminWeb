// Layout.jsx
import React from 'react';
import Sidebar from './Sidebar'; // Adjust the path to where your Sidebar component is located.

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
