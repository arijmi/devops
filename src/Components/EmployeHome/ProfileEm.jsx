import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { Footer } from './Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS
import './ProfileEm.css'; // Import your custom CSS

const ProfileEm = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        role: ''
    });
    const [detailUser, setDetailUser] = useState({
        department: "You don't have a department currently",
        poste: "You don't have a poste currently",
        date_debut_travail: "You don't have a start_date_of_work currently",
        salaire: "You don't have a salary currently",
        nombre_jours_conge:0
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
        }
    };

    return (
        <div>
            <Header />
            <div className="profile-container">
                <h2></h2>
                <div className="profile-card">
                    <h3>My Profile</h3>
                    <div>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                    </div>
                </div>

                {/* Conditionally render "My Details" only if detailUser is available */}
                {detailUser && Object.keys(detailUser).length > 0 && (
                    <div className="profile-card">
                        <h3>My Details</h3>
                        <p><strong>Department:</strong> {detailUser.department}</p>
                        <p><strong>Position:</strong> {detailUser.poste}</p>
                        <p><strong>Start Date:</strong> {new Date(detailUser.date_debut_travail).toLocaleDateString()}</p>
                        <p><strong>Salary:</strong> {detailUser.salaire} DT</p>
                        <p><strong>Leave Days:</strong> {detailUser.nombre_jours_conge} days</p>
                    </div>
                )}

            </div>
            <Footer />

            {/* Toast container to show notifications */}
            <ToastContainer />
        </div>
    );
};

export default ProfileEm;
