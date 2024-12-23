import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeHome.css';
import  Header  from './Header';
import { Footer } from './Footer';
import { ToastContainer, toast } from 'react-toastify';
import { Bar } from 'react-chartjs-2';
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS
const EmployeeHome = () => {

    const [employeeDetails, setEmployeeDetails] = useState({});
    const [allemployeeDetails, setAllEmployeeDetails] = useState({});
    const [loading, setLoading] = useState(true); // Loading state

    const [leaveData, setLeaveData] = useState({ accepter: 5, refuser: 6, attend: 9 });
    const [timeSheet, setTimeSheet] = useState(null);
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email'); // Fetching email from localStorage

    useEffect(() => {
        // Fetch posts and employee details when component loads
        const fetchData = async () => {
            await Promise.all([ fetchEmployeeDetails(),
                fetchAllEmployeeDetails(),
               
                fetchTimeSheet(),]);
            
            setLoading(false);
        };

        fetchData();
    }, []);



    const fetchEmployeeDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/user/findbyemail/${email}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployeeDetails(response.data);
            fetchLeaveDashboard(response.data._id);
        } catch (error) {
            console.error('Error fetching employee details:', error);
            alert('Failed to fetch employee details. Please try again later.');
        }
       
    };

    // Fetch additional employee details by email
    const fetchAllEmployeeDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/detailuser/finddetailbyemail/${email}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAllEmployeeDetails(response.data);
        } catch (error) {
            console.error('Error fetching additional employee details:', error);
            toast.info('Failed to fetch your details'); // Show error toast
        }
    };

    // Fetch leave request dashboard data
    const fetchLeaveDashboard = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/conge/dashboard/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
          
            setLeaveData(response.data);
        } catch (error) {
            console.error('Error fetching leave dashboard:', error);
            toast.error('Failed to load leave dashboard.');
        }
    };

    // Fetch timesheet for the logged-in employee
    const fetchTimeSheet = async () => {
        try {
            const userResponse = await axios.get(`http://localhost:5000/user/findbyemail/${email}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const userId = userResponse.data._id;

            const timesheetResponse = await axios.get(`http://localhost:5000/timesheets/employee/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTimeSheet(timesheetResponse.data);
        } catch (error) {
            console.error('Error fetching timesheet:', error);
        }
    };

    const getTodaysTimesheet = () => {
        const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase(); // Get today's day in French
        if (timeSheet && timeSheet.jours) {
            return timeSheet.jours.find((day) => day.jour.toLowerCase() === today);
        }
        return null;
    };
    // Bar chart data
    const data = {
        labels: ['Accepted', 'Refused', 'Pending'],
        datasets: [
            {
                label: 'Number of Leave Requests',
                data: [leaveData.accepter, leaveData.refuser, leaveData.attend],
                backgroundColor: ['#4caf50', '#f44336', '#ff9800'], // Colors for the bars
                borderColor: ['#388e3c', '#d32f2f', '#f57c00'], // Border colors
                borderWidth: 1,
            },
        ],
    };
    const getTimesheetStatus = () => {
        
        if (!timeSheet) return 'attend'; // Default to 'attend' if no status

        if (timeSheet.etat === 'accepter') return 'accepter';
        if (timeSheet.etat === 'refuser') return 'refuser';
        return 'attend'; // Default to 'attend'
    };

    const timesheetStatusClass = getTimesheetStatus();
    // Bar chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1, // Increment by 1
                },
            },
        },
    };
    return (
        <div>
            <Header />
            <br />
            <br />
            <div className="employee-home-container">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                       <div className="details-and-timesheet">
                            {/* Employee Details */}
                            <section className="employee-details">
                                <h2>Your Details</h2>
                                <p>
                                    <strong>Name:</strong> {employeeDetails.username}
                                </p>
                                <p>
                                    <strong>Email:</strong> {employeeDetails.email}
                                </p>
                                {allemployeeDetails.poste && (
                                    <>
                                        <p>
                                            <strong>Position:</strong> {allemployeeDetails.poste}
                                        </p>
                                        <p>
                                            <strong>Salary:</strong> {allemployeeDetails.salaire}
                                        </p>
                                        <p>
                                            <strong>Remaining Leave Days:</strong>{' '}
                                            {allemployeeDetails.nombre_jours_conge}
                                        </p>
                                    </>
                                )}
                            </section>

                            {/* Today's Timesheet */}
                            <section className={`todays-timesheet ${timesheetStatusClass}`}>
                                <h2>Today's Timesheet</h2>
                                {getTodaysTimesheet() ? (
                                    <div>
                                        <p>
                                            <strong>Morning:</strong>{' '}
                                            {getTodaysTimesheet().periodes.matin ? 'Yes' : 'No'}
                                        </p>
                                        <p>
                                            <strong>Evening:</strong>{' '}
                                            {getTodaysTimesheet().periodes.soir ? 'Yes' : 'No'}
                                        </p>
                                    </div>
                                ) : (
                                    <p>No timesheet available for today.</p>
                                )}
                            </section>
                        </div>
                
                        <div className="leave-dashboard">
                            <h2>Leave Dashboard</h2>
                            <div className="chart-container">
                                <Bar data={data} options={options} />
                            </div>
                        </div>
                   

                        <section className="weekly-schedule">
                            <h2>Weekly Schedule</h2>
                            {timeSheet && timeSheet.jours ? (
                                <table className="schedule-table">
                                    <thead>
                                        <tr>
                                            <th>Day</th>
                                            <th>Morning</th>
                                            <th>Evening</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timeSheet.jours.map((day, index) => (
                                            <tr key={index}>
                                                <td>{day.jour.charAt(0).toUpperCase() + day.jour.slice(1)}</td>
                                                <td>{day.periodes.matin ? 'Yes' : 'No'}</td>
                                                <td>{day.periodes.soir ? 'Yes' : 'No'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>Loading weekly schedule...</p>
                            )}
                        </section>
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default EmployeeHome;
