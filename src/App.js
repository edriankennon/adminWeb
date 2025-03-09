import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import ManageUsers from "./components/ManageUser";
import Evaluation from "./components/Evaluation";
import Accounts from "./components/Accounts";
import Analytics from "./components/Analytics";
import Layout from "./components/Layout"; 
import Settings from "./components/Settings";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Login (No Sidebar) */}
        <Route path="/" element={<Login />} />

        {/* Routes with Sidebar */}
        <Route
          path="/manage-users"
          element={
            <Layout>
              <ManageUsers />
            </Layout>
          }
        />
        <Route
          path="/analytics"
          element={
            <Layout>
              <Analytics /> 
            </Layout>
          }
        />
        <Route
          path="/evaluation"
          element={
            <Layout>
              <Evaluation />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings /> 
            </Layout>
          }
        />
        <Route
          path="/home"
          element={
            <Layout>
              <Home /> 
            </Layout>
          }
        />
        <Route
          path="/accounts"
          element={
            <Layout>
              <Accounts />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
