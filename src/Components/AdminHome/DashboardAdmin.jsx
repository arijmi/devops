import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Header from './Header';
import './Dashboard.css';
// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardAdmin = () => {
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        // Fetch dashboard data from the API
        axios.get('http://localhost:5000/dashboard')
            .then(response => {
                console.log('Dashboard Data:', response.data); // Log the response data
                setDashboardData(response.data);
            })
            .catch(error => {
                console.error('Error fetching dashboard data:', error);
            });
    }, []);

    if (!dashboardData) {
        return <div>Loading...</div>;
    }

    // Data for the bar charts
    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allow custom height and width settings
        plugins: {
            title: {
                display: true,
                text: 'Dashboard Overview',
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: (tooltipItem) => `Count: ${tooltipItem.raw}`,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 10, // Make the x-axis labels smaller
                    },
                },
            },
            y: {
                ticks: {
                    font: {
                        size: 10, // Make the y-axis labels smaller
                    },
                },
            },
        },
    };

    const employeeData = {
        labels: ['Employees', 'Managers'],
        datasets: [
            {
                label: 'Count',
                data: [dashboardData.employeesCount, dashboardData.managersCount],
                backgroundColor: ['#4BC0C0', '#FF6384'],
                borderColor: ['#36A2EB', '#FF6384'],
                borderWidth: 1,
            },
        ],
    };

    const leaveData = {
        labels: ['Accepted', 'Rejected', 'Pending'],
        datasets: [
            {
                label: 'Leave Requests',
                data: [
                    dashboardData.leaveStatus.accepter,
                    dashboardData.leaveStatus.refuser,
                    dashboardData.leaveStatus.attend,
                ],
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
                borderColor: ['#36A2EB', '#FF6384', '#FFCE56'],
                borderWidth: 1,
            },
        ],
    };

    const timesheetData = {
        labels: ['Accepted', 'Rejected', 'Pending'],
        datasets: [
            {
                label: 'Timesheets',
                data: [
                    dashboardData.timesheetStatus.accepter,
                    dashboardData.timesheetStatus.refuser,
                    dashboardData.timesheetStatus.attend,
                ],
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
                borderColor: ['#36A2EB', '#FF6384', '#FFCE56'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
        <Header />
        <div className="dashboard-container">
       
            <div className="charts-card">
                <h2>Dashboard Overview</h2>
                <div className="charts-container">
                    <div className="chart-card">
                        <h3>Employees & Managers</h3>
                        <Bar data={employeeData} options={options} />
                    </div>
                    <div className="chart-card">
                        <h3>Leave Requests</h3>
                        <Bar data={leaveData} options={options} />
                    </div>
                    <div className="chart-card">
                        <h3>Timesheets</h3>
                        <Bar data={timesheetData} options={options} />
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default DashboardAdmin;
