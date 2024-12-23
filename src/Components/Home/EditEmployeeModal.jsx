import React, { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditEmployeeModal.css';
import Header from './Header'; 
import { FaUser, FaLock, FaBriefcase, FaMoneyBillWave, FaCalendarAlt, FaBuilding } from 'react-icons/fa';

const EditEmployeeModal = () => {
    const { id } = useParams();
    const [user, setUser] = useState({ username: '', email: '' });
    const [details, setDetails] = useState({
        department: '',
        poste: '',
        salaire: '',
        nombre_jours_conge: '',
        date_debut_travail: ''
    });
    const [hasDetails, setHasDetails] = useState(false);
    const navigate = useNavigate();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    useEffect(() => {
        if (!token || role === 'employee') {
            navigate('/'); 
        } else {
            fetchUser();
            fetchEmployeeDetails();
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/user/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const fetchEmployeeDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/detailuser/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data) {
                const formattedDate = new Date(response.data.date_debut_travail).toISOString().split('T')[0];
                setDetails({ ...response.data, date_debut_travail: formattedDate });
                setHasDetails(true);
            } else {
                setHasDetails(false);
            }
        } catch (error) {
            console.error('Error fetching employee details:', error);
            setHasDetails(false);
        }
    };

    const handleUserChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
    const handleDetailsChange = (e) => setDetails({ ...details, [e.target.name]: e.target.value });

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/user/${id}`, user, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('User updated successfully');
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Failed to update user');
        }
    };

    const handleDetailsSubmit = async (e) => {
        e.preventDefault();
        try {
            if (hasDetails) {
                await axios.put(`http://localhost:5000/detailuser/${id}`, details, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:5000/detailuser', { ...details, userId: id }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            toast.success('Details updated successfully');
        } catch (error) {
            console.error('Error updating employee details:', error);
            toast.error('Failed to update employee details');
        }
    };

    const handlePasswordUpdate = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        try {
            await axios.put(`http://localhost:5000/user/${id}/update-password`, { password: newPassword }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Password updated successfully');
            setShowPasswordModal(false); 
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error('Failed to update password');
        }
    };

    return (
        <div>
            <Header />
            <div className="edit-employee-page">
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

                <h2 className="page-title">Edit Employee Information</h2>

                {/* User Info Form */}
                <div className="form-container">
                    <form onSubmit={handleUserSubmit} className="form-section">
                        <h3><FaUser /> User Information</h3>
                        <div className="input-group">
                            <label>Name:</label>
                            <input type="text" name="username" value={user.username} onChange={handleUserChange} required />
                        </div>
                        <div className="input-group">
                            <label>Email:</label>
                            <input type="email" name="email" value={user.email} onChange={handleUserChange} required />
                        </div>
                        <button type="submit" className="action-btn primary-btn">Update User Info</button>
                    </form>
                </div>

                <div className="password-section">
                    <button type="button" onClick={() => setShowPasswordModal(true)} className="action-btn">
                        <FaLock /> Change Password
                    </button>
                </div>

                {/* Password Modal */}
                {showPasswordModal && (
                    <div className="password-modal-backdrop">
                        <div className="password-modal">
                            <h3><FaLock /> Change Password</h3>
                            <div className="input-group">
                                <label>New Password:</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Confirm Password:</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button onClick={handlePasswordUpdate} className="action-btn primary-btn">Update Password</button>
                            <button onClick={() => setShowPasswordModal(false)} className="action-btn cancel-btn">Cancel</button>
                        </div>
                    </div>
                )}

                {/* Employee Details Form */}
                <div className="form-container">
                    <form onSubmit={handleDetailsSubmit} className="form-section">
                        <h3><FaBriefcase /> {hasDetails ? 'Edit' : 'Add'} Employee Details</h3>
                        <div className="input-group">
                            <label>Department:</label>
                            <input type="text" name="department" value={details.department} onChange={handleDetailsChange} required />
                        </div>
                        <div className="input-group">
                            <label>Poste:</label>
                            <input type="text" name="poste" value={details.poste} onChange={handleDetailsChange} required />
                        </div>
                        <div className="input-group">
                            <label>Salaire:</label>
                            <input type="number" name="salaire" value={details.salaire} onChange={handleDetailsChange} required />
                        </div>
                        <div className="input-group">
                            <label>Congé:</label>
                            <input type="number" name="nombre_jours_conge" value={details.nombre_jours_conge} onChange={handleDetailsChange} required />
                        </div>
                        <div className="input-group">
                            <label>Date de début de travail:</label>
                            <input type="date" name="date_debut_travail" value={details.date_debut_travail} onChange={handleDetailsChange} required />
                        </div>
                        <button type="submit" className="action-btn primary-btn">
                            {hasDetails ? 'Update' : 'Add'} Details
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditEmployeeModal;
