import React, { useEffect, useState } from 'react';
import '../styles/Home.css';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const [userCounts, setUserCounts] = useState({
    tourist: 0,
    business: 0,
    residents: 0,
    totalUsers: 0,
    newUsers: 0,
    activeUsers: 0,
    newBusiness: 0,
    lastUpdate: '',
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDoc = doc(db, "homeData", "counts"); // Correct collection and document
        const snapshot = await getDoc(userDoc);

        if (snapshot.exists()) {
          const data = snapshot.data();
          console.log("Fetched Firestore Data:", data);

          setUserCounts({
            tourist: data.tourists || 0,
            business: data.business || 0,
            residents: data.residents || 0,
            totalUsers: (data.tourists || 0) + (data.business || 0) + (data.residents || 0),
            newUsers: data.newUsers || 0,
            activeUsers: data.activeUsers || 0,
            newBusiness: data.newBusiness || 0,
            lastUpdate: data.lastUpdate || "N/A",
          });
        } else {
          console.log("No such document!");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
    console.log(userCounts);
  }, []);

  const doughnutData = {
    labels: ['Tourist', 'Business Owners', 'Local Residents'],
    datasets: [
      {
        data: [userCounts.tourist, userCounts.business, userCounts.residents],
        backgroundColor: ['#F5A623', '#9B9B9B', '#4A90E2'],
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="home-container">
      {isLoading ? (
        <div className="loading">Loading data...</div>
      ) : (
        <>
          <div className="welcome-section">
            <div className="chart-container">
              <div className="chart-left">
                <h2>Welcome back, Admin!</h2>
                <p className="subtitle">This is the Explore Damilag system report</p>
                <div className="doughnut-chart-container">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
                <p className="total-count">Total Users</p>
                <p className="user-count">{userCounts.totalUsers}</p>
                <p className="last-update">Last update: {userCounts.lastUpdate}</p>
              </div>
              <div className="vertical-divider"></div>
              <div className="chart-right">
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#F5A623' }}></span>
                  <span className="legend-label">{userCounts.tourist} Tourist</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#9B9B9B' }}></span>
                  <span className="legend-label">{userCounts.business} Business Owners</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#4A90E2' }}></span>
                  <span className="legend-label">{userCounts.residents} Local Residents</span>
                </div>
              </div>
            </div>
          </div>
          <div className="summary-cards">
            <div className="card new-users">
              <div className="card-icon">🆕</div>
              <p className="card-title">New Users</p>
              <p className="card-number">{userCounts.newUsers}</p>
            </div>
            <div className="card active-users">
              <div className="card-icon">👥</div>
              <p className="card-title">Active Users</p>
              <p className="card-number">{userCounts.activeUsers}</p>
            </div>
            <div className="card new-business">
              <div className="card-icon">💼</div>
              <p className="card-title">New Business</p>
              <p className="card-number">{userCounts.newBusiness}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
  