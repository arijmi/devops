import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Header } from './Header';
import { Footer } from './Footer';
import './MyTimeSheet.css';

const MyTimeSheet = () => {
    const navigate = useNavigate();
    const [timeSheet, setTimeSheet] = useState(null);
    const [idEmployee, setUserId] = useState('');
    const email = localStorage.getItem('email');

    useEffect(() => {
        console.log(email);
        let isMounted = true;

        const getUserId = async () => {
            if (!email) {
                toast.error('You need to log in to view your timesheet.');
                navigate('/');
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/user/findbyemail/${email}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (isMounted) {
                    setUserId(response.data._id);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        getUserId();
        return () => {
            isMounted = false;
        };
    }, [email, navigate]);

    useEffect(() => {
        const fetchTimeSheet = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/timesheets/employee/${idEmployee}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTimeSheet(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching timesheet:', error);
                toast.error('Failed to load your timesheet. Please try again.');
            }
        };

        if (idEmployee) {
            fetchTimeSheet();
        }
    }, [idEmployee]);

    // Function to determine the CSS class for the status paragraph
    const getStatusClass = (status) => {
        switch (status) {
            case 'accepter':
                return 'status-accepted';
            case 'refuser':
                return 'status-refused';
            case 'attend':
                return 'status-pending';
            default:
                return '';
        }
    };

    // Handle navigation to EditTimeSheet page
    const handleEditClick = () => {
        navigate(`/EditTimeSheet/${timeSheet._id}`);
    };

    // Handle navigation to AddTimeSheet page
    const handleAddTimeSheet = () => {
        navigate('/addTS'); // Redirect to AddTimesheet route
    };

    return (
        <div className="timesheet-page">
            <Header />
            <div className="my-timesheet-container">
                <h2>My Timesheet</h2>
                {timeSheet ? (
                    <div className="timesheet-details">
                        <div className="employee-info">
                            {/* Apply conditional class to the status paragraph */}
                            <p className={getStatusClass(timeSheet.etat)}>
                                <strong>Status:</strong> {timeSheet.etat}
                            </p>
                            <p>
                                <strong>Manager:</strong> {timeSheet.idManager && timeSheet.idManager.username ? timeSheet.idManager.username : 'Not assigned'}
                            </p>
                            <p>
                                <strong>Description:</strong> {timeSheet.description}
                            </p>
                        </div>
                        <h3>Weekly Schedule</h3>
                        <div className="week-schedule">
                            {timeSheet.jours.map((day, index) => (
                                <div key={index} className="day-schedule">
                                    <h4>{day.jour.charAt(0).toUpperCase() + day.jour.slice(1)}</h4>
                                    <p>
                                        <strong>Morning:</strong> {day.periodes.matin ? 'Yes' : 'No'}
                                    </p>
                                    <p>
                                        <strong>Evening:</strong> {day.periodes.soir ? 'Yes' : 'No'}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleEditClick} className="edit-button">
                            Edit Timesheet
                        </button>
                    </div>
                ) : (
                    <div className="no-timesheet">
                        <p>You don't have a timesheet yet.</p>
                        <button onClick={handleAddTimeSheet} className="add-timesheet-button">
                            Add Timesheet
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MyTimeSheet;
