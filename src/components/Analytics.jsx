import React, { useEffect, useState } from 'react';
import '../styles/Analytics.css';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [doughnutChartData, setDoughnutChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [stats, setStats] = useState({
    redirects: 0,
    successRate: 0,
    errors: 0,
    errorRatio: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch responseRates document
        const docRef = doc(db, "analyticsData", "responseRates");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          // Set Line Chart Data
          setLineChartData({
            labels: data.lineLabels || [], // e.g., ['8 AM', '9 AM', ...]
            datasets: [
              {
                label: 'Errors',
                data: data.errors || [], // Data for errors
                borderColor: '#000000',
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: '#000000',
                tension: 0.4,
              },
              {
                label: 'Breakdowns',
                data: data.breakdowns || [], // Data for breakdowns
                borderColor: '#C5E3BF',
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: '#C5E3BF',
                tension: 0.4,
              },
            ],
          });

          // Set Doughnut Chart Data
          setDoughnutChartData({
            labels: data.doughnutLabels || [], // e.g., ['200', '300', '500']
            datasets: [
              {
                data: data.doughnutData || [], // Data for each label
                backgroundColor: ['#4A90E2', '#50E3C2', '#F5A623'],
                hoverOffset: 4,
              },
            ],
          });

          // Set Stats Data
          setStats({
            redirects: data.redirects || 0,
            successRate: data.successRate || 0,
            errors: data.errorsCount || 0, // Assuming `errorsCount` field exists
            errorRatio: data.errorRatio || 0,
          });
        } else {
          console.error("No such document!");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          padding: 20,
          font: {
            size: 14,
            family: 'Arial, sans-serif',
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e0e0e0',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14,
            family: 'Arial, sans-serif',
          },
        },
      },
    },
  };

  return (
    <div className="analytics-container">
      {isLoading ? (
        <p>Loading analytics data...</p>
      ) : (
        <>
          <div className="header-stats">
            <div className="stat-card blue">
              <p>{stats.redirects.toLocaleString()}</p>
              <span>Redirects</span>
              <div className="growth">+5.78%</div>
            </div>
            <div className="stat-card green">
              <p>{stats.successRate}%</p>
              <span>Success rate</span>
              <div className="growth">+3.85%</div>
            </div>
            <div className="stat-card orange">
              <p>{stats.errors.toLocaleString()}</p>
              <span>Errors</span>
              <div className="growth">+1.64%</div>
            </div>
            <div className="stat-card black">
              <p>{stats.errorRatio}%</p>
              <span>Error ratio</span>
              <div className="growth">+3.28%</div>
            </div>
          </div>

          <div className="chart-section">
            <div className="line-chart">
              <h2>Response</h2>
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
            <div className="analytics-doughnut-chart">
              <h2>Response Code Breakdown</h2>
              <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
