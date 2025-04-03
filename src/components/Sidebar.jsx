import React from "react";
import { FaHome, FaUsers, FaChartBar, FaCog, FaUserCircle, FaChartLine } from "react-icons/fa";
import { MdAssessment } from "react-icons/md";
import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "./../styles/Sidebar.css";

function Sidebar() {
  const { user } = useAuth();
  return (
    <aside className="sidebar">
      <div className="logo">
      <img src={require('../assets/Exploredamilag.png')} alt="Logo" className="logo-image" />
      </div>
      <nav className="nav">
      {
        <NavLink to="/home" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <FaChartLine className="icon" /> Analytics
        </NavLink>}
      {/*
        <NavLink to="/evaluation" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <MdAssessment className="icon" /> For Evaluation
        </NavLink>*/}
        <NavLink to="/manage-users" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <FaUsers className="icon" /> Manage Users
        </NavLink>
      {/*}
        <NavLink to="/analytics" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <FaChartBar className="icon" /> Home
        </NavLink>*/}
        {/*
        <NavLink to="/settings" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <FaCog className="icon" /> Settings
        </NavLink>
        */}
      </nav>
    
 {/* My Account section moved to the bottom */}
 <div className="account-section">
    <hr className="separator" />
    <NavLink to="/accounts" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
      <FaUserCircle className="icon" /> My Account
    </NavLink>
  </div>

    </aside>
  );
}

export default Sidebar;