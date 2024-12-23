import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Header } from './Header';
import { Footer } from './Footer';

// Reusable component for Weekly Schedule in a table format
const WeeklySchedule = ({ jours, onUpdate }) => {
    return (
        <div className="weekly-schedule">
            <h3>Weekly Schedule</h3>
            <table className="schedule-table">
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Morning</th>
                        <th>Evening</th>
                    </tr>
                </thead>
                <tbody>
                    {jours.map((day, index) => (
                        <tr key={index}>
                            <td>{day.jour.charAt(0).toUpperCase() + day.jour.slice(1)}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={day.periodes.matin}
                                    onChange={() => {
                                        const updatedJours = [...jours];
                                        updatedJours[index].periodes.matin = !updatedJours[index].periodes.matin;
                                        onUpdate(updatedJours);
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={day.periodes.soir}
                                    onChange={() => {
                                        const updatedJours = [...jours];
                                        updatedJours[index].periodes.soir = !updatedJours[index].periodes.soir;
                                        onUpdate(updatedJours);
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const EditTimeSheetManager = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [timeSheet, setTimeSheet] = useState(null);
    const email = localStorage.getItem('email');
    const [idManager, setIdManager] = useState('');

    useEffect(() => {
        const fetchTimeSheet = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/timesheets/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setTimeSheet(response.data);
            } catch (error) {
                console.error('Error fetching timesheet:', error);
                if (error.response?.status === 401) {
                    toast.error('Unauthorized. Please log in again.');
                    navigate('/login');
                } else {
                    toast.error('Failed to load the timesheet. Please try again.');
                }
            }
        };

        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/user/findbyemail/${email}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setIdManager(response.data._id);
            } catch (error) {
                console.error('Error fetching user details:', error);
                toast.error('Failed to fetch user details');
            }
        };

        fetchUserDetails();
        fetchTimeSheet();
    }, [id, navigate, email]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!timeSheet.description || timeSheet.description.trim() === '') {
            toast.error('Description cannot be empty.');
            return;
        }
        timeSheet.idManager = idManager;

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/timesheets/${id}`, timeSheet, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            toast.success('Timesheet updated successfully!');
            navigate('/AllTimeSheetManager');
        } catch (error) {
            console.error('Error updating timesheet:', error);
            toast.error('Failed to update the timesheet. Please try again.');
        }
    };

    return (
        <div className="edit-timesheet-container">
            <Header />
            <h2>Edit Timesheet</h2>
            {timeSheet ? (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="etat">Status:</label>
                        <select
                            id="etat"
                            value={timeSheet.etat}
                            onChange={(e) => setTimeSheet({ ...timeSheet, etat: e.target.value })}
                        >
                            <option value="accepter">Approved</option>
                            <option value="refuser">Rejected</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            value={timeSheet.description}
                            onChange={(e) => setTimeSheet({ ...timeSheet, description: e.target.value })}
                            required
                            disabled
                        />
                    </div>

                    <WeeklySchedule
                        jours={timeSheet.jours}
                        onUpdate={(updatedJours) => setTimeSheet({ ...timeSheet, jours: updatedJours })}
                    />
                    <button className="btn btn-primary" type="submit">
                        Save Changes
                    </button>
                </form>
            ) : (
                <p>Loading timesheet data...</p>
            )}
         
        </div>
    );
};

export default EditTimeSheetManager;
