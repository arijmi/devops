import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Using toast for notifications

const AddTimeSheet = () => {
    const navigate = useNavigate();
    const [email] = useState(localStorage.getItem('email'));
    const [idEmployee, setUserId] = useState('');
    useEffect(() => {
      const getUserId = async () => {
        if (!email) {
            console.error('Email is not set in localStorage.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/user/findbyemail/${email}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUserId(response.data._id);
        } catch (error) {
            console.error('Error fetching user details:', error);
            
        }
        };
        getUserId();
    }, [idEmployee]);
    // Fetch the user ID from local storage or context
    const [description, setDescription] = useState('');
    const [jours, setJours] = useState([
        { jour: 'lundi', matin: false, soir: false },
        { jour: 'mardi', matin: false, soir: false },
        { jour: 'mercredi', matin: false, soir: false },
        { jour: 'jeudi', matin: false, soir: false },
        { jour: 'vendredi', matin: false, soir: false },
        { jour: 'samedi', matin: false, soir: false },
        { jour: 'dimanche', matin: false, soir: false }
    ]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare the timesheet data
        const timesheetData = {
            idEmployee,
            idManager: null, // Manager ID is set to null
            etat: 'attend', // Default state
            description,
            jours: jours.map(day => ({
                jour: day.jour,
                periodes: {
                    matin: day.matin,
                    soir: day.soir
                }
            }))
        };

        try {
            const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
            await axios.post('http://localhost:5000/timesheets', timesheetData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Timesheet created successfully!');
            navigate('/employeHome'); // Redirect to timesheet list or dashboard
        } catch (error) {
            console.error('Error creating timesheet:', error);
            toast.error('Failed to create timesheet. Please try again.');
        }
    };

    // Handle change for description input
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    // Handle checkbox change for days and periods (morning/evening)
    const handleCheckboxChange = (dayIndex, period) => {
        setJours(prevJours =>
            prevJours.map((day, index) =>
                index === dayIndex ? { ...day, [period]: !day[period] } : day
            )
        );
    };

    return (
        <div className="add-timesheet-container">
            <h2>Create New Timesheet</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Description:</label>
                    <input 
                        type="text" 
                        value={description} 
                        onChange={handleDescriptionChange} 
                        required
                    />
                </div>

                <h3>Select Working Days and Periods</h3>
                {jours.map((day, index) => (
                    <div key={day.jour} className="day-selection">
                        <h4>{day.jour}</h4>
                        <label>
                            <input
                                type="checkbox"
                                checked={day.matin}
                                onChange={() => handleCheckboxChange(index, 'matin')}
                            />
                            Morning
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={day.soir}
                                onChange={() => handleCheckboxChange(index, 'soir')}
                            />
                            Evening
                        </label>
                    </div>
                ))}

                <button type="submit">Create Timesheet</button>
            </form>
        </div>
    );
};

export default AddTimeSheet;
