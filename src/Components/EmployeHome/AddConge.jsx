import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import './AddConge.css'; // Import your CSS file for styling
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS
import { useNavigate } from 'react-router-dom'; // Import useNavigate
const AddConge = () => {
    const [formData, setFormData] = useState({
        idemployee: '', // Employee ID will be set after fetching user data
        date_debut: '',
        date_fin: '',
        description: ''
    });
    const navigate = useNavigate(); // Initialize useNavigate
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email'); // Fetching email from localStorage
    const [iduser, setUserId] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    useEffect(() => {
        // Fetch employee details based on email when component loads
        const getUserId = async () => {
            if (!email) {
                console.error('Email is not set in localStorage.');
                return;
            }
            try {
                const response = await axios.get(`http://localhost:5000/user/findbyemail/${email}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUserId(response.data._id); // Set user ID based on response
                setFormData((prevState) => ({
                    ...prevState,
                    idemployee: response.data._id // Update formData with the employee ID
                }));
            } catch (error) {
                toast.error('Error fetching user details:', error); // Show error toast
              
            }
        };

        getUserId();
    }, [email, token]);

    // Validation for start and end dates
    const validateDates = () => {
        const currentDate = new Date();
        const startDate = new Date(formData.date_debut);
        const endDate = new Date(formData.date_fin);

        // Check if the start date is not before the current date
        if (startDate < currentDate) {
            return "Start date cannot be earlier than today's date.";
        }

        // Check if the difference between start and end date is more than 1 month
        const oneMonthLater = new Date(startDate);
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

        if (endDate > oneMonthLater) {
            return "End date cannot be more than one month after the start date.";
        }

        return ''; // Return empty string if no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate dates before submitting
        const validationError = validateDates();
        if (validationError) {
            setError(validationError);
            return; // Stop the form submission if validation fails
        }

        // Submit the form data if validation passes
        const dataToSubmit = {
            ...formData,
            idemployee: iduser // Ensure employee ID is included
        };

        try {
            const response = await axios.post('http://localhost:5000/conge', dataToSubmit, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Leave request submitted successfully!'); // Show success toast
            setError(''); // Reset error message
            
            navigate(`/myconge/${iduser}`);
            // Reset form after submission
            setFormData({
                idemployee: '',
                date_debut: '',
                date_fin: '',
                description: ''
            });
        } catch (error) {
            console.error('Error submitting leave request:', error);
            toast.error('Leave request submitted successfully!'); // Show success toast
        }
    };

    return (
        <div>
            <Header />
            <br />
            <div className="add-conge">
                <h2>Request Leave</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="date_debut">Start Date</label>
                        <input
                            type="date"
                            id="date_debut"
                            name="date_debut"
                            value={formData.date_debut}
                            onChange={handleChange}
                            required
                            min={new Date().toISOString().split('T')[0]} // Disallow dates earlier than today
                        />
                    </div>
                    <div>
                        <label htmlFor="date_fin">End Date</label>
                        <input
                            type="date"
                            id="date_fin"
                            name="date_fin"
                            value={formData.date_fin}
                            onChange={handleChange}
                            required
                            min={formData.date_debut} // End date should not be earlier than start date
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <button type="submit">Submit Leave Request</button>
                </form>
            </div>
            {/* Toast container to display toasts */}
            <ToastContainer />
        </div>
    );
};

export default AddConge;
