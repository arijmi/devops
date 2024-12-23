import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS
import './Profile.css'; // Import your custom CSS

const Profile = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        role: ''
    });
    const [detailUser, setDetailUser] = useState({
        department: '',
        poste: '',
        date_debut_travail: '',
        salaire: '',
        nombre_jours_conge: ''
    });
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        
        if (!token) {
            navigate('/');
        } else {
            fetchUserDetails(email);
            fetchDetailUser(email);
        }
    }, []);

    const fetchUserDetails = async (email) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/user/findbyemail/${email}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
            toast.error('Failed to fetch user details'); // Show error toast
        }
    };

    const fetchDetailUser = async (email) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/detailuser/finddetailbyemail/${email}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setDetailUser(response.data);
        } catch (error) {
            console.error('Error fetching detail user data:', error);
            toast.error('Failed to fetch employment details'); // Show error toast
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('email');
            await axios.put(`http://localhost:5000/user/UpdateByEmail/${email}`, user, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Profile updated successfully'); // Show success toast
            setEditMode(false);
        } catch (error) {
            console.error('Error updating user details:', error);
            toast.error('Error updating profile'); // Show error toast
        }
    };

    return (
        <div>
            <Header />
            <div className="profile-container">
                <h2></h2>
                <div className="profile-card">
                    <h3>My Profile</h3>
                    {editMode ? (
                        <div className="profile-edit">
                            <label>
                                Username:
                                <input 
                                    type="text" 
                                    name="username" 
                                    value={user.username} 
                                    onChange={handleInputChange}
                                />
                            </label>
                           
                            <button className="btn-save" onClick={handleSubmit}>Save</button>
                            <button className="btn-cancel" onClick={() => setEditMode(false)}>Cancel</button>
                        </div>
                    ) : (
                        <div>
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Role:</strong> {user.role}</p>
                            <button className="btn-edit" onClick={() => setEditMode(true)}>Edit name</button>
                        </div>
                    )}
                </div>

                <div className="profile-card">
                    <h3>My Details</h3>
                    <p><strong>Department:</strong> {detailUser.department}</p>
                    <p><strong>Position:</strong> {detailUser.poste}</p>
                    <p><strong>Start Date:</strong> {new Date(detailUser.date_debut_travail).toLocaleDateString()}</p>
                    <p><strong>Salary:</strong> {detailUser.salaire} USD</p>
                    <p><strong>Leave Days:</strong> {detailUser.nombre_jours_conge} days</p>
                </div>
            </div>
            <Footer />

            {/* Toast container to show notifications */}
            <ToastContainer />
        </div>
    );
};

export default Profile;
