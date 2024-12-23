import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Notifications.css'; // Add custom styling
import { Header } from './Header';
import { Footer } from './Footer';

const Notifications = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [timesheets, setTimesheets] = useState([]);
    const [notifications, setNotifications] = useState([]); // State to store all notifications

    // Fetch pending leave requests, timesheets, and all notifications
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token'); // Retrieve the token
            try {
                // Fetch pending leave requests
                const leaveResponse = await axios.get('http://localhost:5000/conge/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setLeaveRequests(leaveResponse.data); // Set leave requests data

                // Fetch pending timesheets
                const timesheetResponse = await axios.get('http://localhost:5000/timesheets/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTimesheets(timesheetResponse.data); // Set timesheets data

                // Fetch all notifications
                const notificationResponse = await axios.get('http://localhost:5000/notifications', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setNotifications(notificationResponse.data); // Set notifications data
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <Header />
            <br /><br />
            <div className="notifications-container">
                <h2>Pending Notifications</h2>

                {/* Display pending leave requests */}
                <section>
                    <h3>Pending Leave Requests</h3>
                    {leaveRequests.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Employee Name</th>
                                    <th>Start date</th>
                                    <th>End date</th>
                                    <th>Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaveRequests.map(request => (
                                    <tr key={request._id}>
                                        <td>{request.idemployee.username}</td>
                                        <td>{new Date(request.date_debut).toLocaleDateString()}</td>
                                        <td>{new Date(request.date_fin).toLocaleDateString()}</td>
                                        <td>{request.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No pending leave requests.</p>
                    )}
                </section>

                {/* Display pending timesheets */}
                <section>
                    <h3>Pending Timesheets</h3>
                    {timesheets.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Employee Name</th>
                                    <th>Timesheet Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {timesheets.map(timesheet => (
                                    <tr key={timesheet._id}>
                                        <td>{timesheet.employeeName}</td>
                                        <td>{new Date(timesheet.timesheetDate).toLocaleDateString()}</td>
                                        <td>{timesheet.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No pending timesheets.</p>
                    )}
                </section>

                {/* Display all notifications */}
                <section>
                    <h3>All Notifications</h3>
                    {notifications.length > 0 ? (
                        <ul>
                            {notifications.map(notif => (
                                <li key={notif._id}>
                                    <p><strong>Message:</strong> {notif.message}</p>
                                    <p><strong>From:</strong> {notif.actorId.username}</p>
                                    <p><strong>Type:</strong> {notif.type}</p>
                                    <p><strong>Created At:</strong> {new Date(notif.createdAt).toLocaleString()}</p>
                                    <hr />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No notifications available.</p>
                    )}
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default Notifications;
