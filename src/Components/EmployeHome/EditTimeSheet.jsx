import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Header } from './Header';
import { Footer } from './Footer';

const EditTimeSheet = () => {
    const navigate = useNavigate();
    const { IdTimeSheet } = useParams(); // Get IdTimeSheet from URL params
    console.log(IdTimeSheet);
    const [timeSheet, setTimeSheet] = useState(null);

    // Fetch the timesheet data when the component mounts
    useEffect(() => {
        const fetchTimeSheet = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from localStorage
                const response = await axios.get(`http://localhost:5000/timesheets/${IdTimeSheet}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTimeSheet(response.data); // Set the timesheet data
            } catch (error) {
                console.error('Error fetching timesheet:', error);
                toast.error('Failed to load your timesheet. Please try again.');
            }
        };

        fetchTimeSheet();
    }, [IdTimeSheet]); // Dependency on IdTimeSheet

    // Handle form submit to update the timesheet (you can extend this as needed)
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Make sure the 'etat' is always set to 'attend' on submit
        const updatedTimeSheet = {
            ...timeSheet,
            etat: 'attend' // Set the status to 'attend' on submission
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:5000/timesheets/${IdTimeSheet}`, updatedTimeSheet, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Timesheet updated successfully!');
            navigate('/mytimesheet'); // Redirect to MyTimesheet page after successful update
        } catch (error) {
            console.error('Error updating timesheet:', error);
            toast.error('Failed to update your timesheet. Please try again.');
        }
    };

    return (
        <div className="edit-timesheet-container">
            <Header />
            <h2>Edit Timesheet</h2>
            {timeSheet ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="etat">Status:</label>
                        <input
                            type="text"
                            id="etat"
                            value={timeSheet.etat}
                            readOnly // Make this field read-only so the employee cannot modify it
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            value={timeSheet.description}
                            onChange={(e) => setTimeSheet({ ...timeSheet, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <h3>Weekly Schedule</h3>
                        {timeSheet.jours.map((day, index) => (
                            <div key={index}>
                                <h4>{day.jour.charAt(0).toUpperCase() + day.jour.slice(1)}</h4>
                                <label>
                                    Morning:
                                    <input
                                        type="checkbox"
                                        checked={day.periodes.matin}
                                        onChange={() => {
                                            const updatedJours = [...timeSheet.jours];
                                            updatedJours[index].periodes.matin = !updatedJours[index].periodes.matin;
                                            setTimeSheet({ ...timeSheet, jours: updatedJours });
                                        }}
                                    />
                                </label>
                                <label>
                                    Evening:
                                    <input
                                        type="checkbox"
                                        checked={day.periodes.soir}
                                        onChange={() => {
                                            const updatedJours = [...timeSheet.jours];
                                            updatedJours[index].periodes.soir = !updatedJours[index].periodes.soir;
                                            setTimeSheet({ ...timeSheet, jours: updatedJours });
                                        }}
                                    />
                                </label>
                            </div>
                        ))}
                    </div>
                    <button type="submit">Save Changes</button>
                </form>
            ) : (
                <p>Timesheet not found.</p>
            )}
     
        </div>
    );
};

export default EditTimeSheet;
