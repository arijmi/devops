import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa'; // Import icons
import Header from './Header';
import './Dashboard.css';
// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const navigate = useNavigate();
    const [statusFilters, setStatusFilters] = useState('all'); // Default to "all"
    const [searchName, setSearchName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [timesheets, setTimesheets] = useState([]);
    const [filteredTimesheets, setFilteredTimesheets] = useState([]);

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

        const fetchTimesheets = async () => {
            try {
                const response = await axios.get('http://localhost:5000/timesheets/employee');
                console.log('All Timesheets:', response.data);
                setTimesheets(response.data); // Store the data for filtering
            } catch (error) {
                console.error('Error fetching timesheets:', error);
            }
        };
        fetchTimesheets();
    }, []);

    useEffect(() => {
        // Filter the timesheets based on status filters and search name
        const filtered = timesheets.filter((timesheet) => {
            // Check if the status matches the selected filter
            const statusMatch =
                statusFilters === 'all' ||
                (statusFilters === 'accepter' && timesheet.etat === 'accepter') ||
                (statusFilters === 'refuser' && timesheet.etat === 'refuser') ||
                (statusFilters === 'attend' && timesheet.etat === 'attend');

            // Check if the employee name matches the search
            const nameMatch = timesheet.idEmployee.username.toLowerCase().includes(searchName.toLowerCase());

            return statusMatch && nameMatch;
        }).filter((timesheet) => {
            // Filter by status if selected
            if (statusFilters === 'all') return true;
            return timesheet.etat.toLowerCase() === statusFilters;
        })
        .sort((a, b) => {
            // Sort timesheets by creation date (newest first)
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA; // For descending order (newest first)
        });

        setFilteredTimesheets(filtered);
    }, [statusFilters, searchName, timesheets]);

    if (!dashboardData) {
        return <div>Loading...</div>;
    }

    const handleStatusChange = (e) => {
        setStatusFilters(e.target.value); // Update the selected status filter
    };

    const handleSearchChange = (e) => {
        setSearchName(e.target.value);
    };

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
    const handleEdit = (timesheetId) => {
       // console.log(`Edit timesheet with id: ${timesheetId}`);
        navigate(`/EditTimeSheetManage/${timesheetId}`);
    };

    const handleDelete = (timesheetId) => {
        console.log(`Delete timesheet with id: ${timesheetId}`);
        // Add your delete logic here (e.g., call API to delete)
    };

    const handleView = (timesheetId) => {
        console.log(`View timesheet with id: ${timesheetId}`);
        // Add your view logic here (redirect to view page or open a modal)
    };
    
    return (
        <div>
            <Header />
            <div className="dashboard-container">
                <div className="charts-card">
                    <h2>Dashboard Overview</h2>
                    <div className="charts-container">
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

                <div className="filters-container">
                <h3>Timesheets List</h3>
                <input
                    type="text"
                    placeholder="Search by employee name"
                    value={searchName}
                    onChange={handleSearchChange}
                />
                <div className="status-filters">
                    <label>
                        <input
                            type="radio"
                            name="status"
                            value="all"
                            checked={statusFilters === 'all'}
                            onChange={handleStatusChange}
                        />
                        All
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="status"
                            value="accepter"
                            checked={statusFilters === 'accepter'}
                            onChange={handleStatusChange}
                        />
                        Accepted
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="status"
                            value="refuser"
                            checked={statusFilters === 'refuser'}
                            onChange={handleStatusChange}
                        />
                        Rejected
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="status"
                            value="attend"
                            checked={statusFilters === 'attend'}
                            onChange={handleStatusChange}
                        />
                        Pending
                    </label>
                </div>
            
               
                <table>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Status</th>
                            <th>Description</th>
                            <th>Creation Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {filteredTimesheets.map((timesheet) => (
                            <tr key={timesheet._id}>
                                <td>{timesheet.idEmployee.username}</td>
                                <td>{timesheet.etat}</td>
                                <td>{timesheet.description}</td>
                                <td>{new Date(timesheet.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <div className="action-icons">
                                        <FaEdit className="icon" onClick={() => handleEdit(timesheet._id)} />
                                        <FaTrash className="icon" onClick={() => handleDelete(timesheet._id)} />
                                        <FaEye className="icon" onClick={() => handleView(timesheet._id)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    );
};

export default Dashboard;
