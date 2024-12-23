import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast styling
const AddUser = () => {
    // Basic employee information state
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Employee details state
    const [showDetailsForm, setShowDetailsForm] = useState(false);
    const [employeeId, setEmployeeId] = useState(null); // To store the created employee's ID
    const [department, setDepartment] = useState('');
    const [poste, setPoste] = useState('');
    const [dateDebutTravail, setDateDebutTravail] = useState('');
    const [salaire, setSalaire] = useState('');
    const [nombreJoursConge, setNombreJoursConge] = useState(21); // Default leave days

    const navigate = useNavigate();

    // Handle form submission for basic employee information
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('http://localhost:5000/user/', {
                username,
                email,
                password,
                role,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Employee added successfully.'); // Success toast
            setEmployeeId(response.data._id); // Store employee ID for details
            setShowDetailsForm(true); // Show details form
        } catch (error) {
            console.error('Error creating employee:', error);
            toast.error('Failed to create employee. Please try again.'); // Error toast
        }
    };

    // Handle form submission for employee details
    const handleDetailsSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            await axios.post('http://localhost:5000/detailuser/', {
                userId: employeeId, // Reference to the created employee
                department,
                poste,
                date_debut_travail: dateDebutTravail,
                salaire,
                nombre_jours_conge: nombreJoursConge
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Employee details added successfully.'); // Success toast
            navigate('/home'); // Redirect to the home page after success
        } catch (error) {
            console.error('Error creating employee details:', error);
            toast.error('Failed to create employee details. Please try again.'); // Error toast
        }
    };

    return (
       <div>
        <br /><br />
        <div className="add-employee-container">
            <h2>{showDetailsForm ? "Add Employee Details" : "Add New Employee"}</h2>
            {/* Toast container for displaying notifications */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
            
            {!showDetailsForm ? (
                // Basic employee information form
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Name:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role:</label>
                        <select id="role" name="role"  onChange={(e) => setRole(e.target.value)} required>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="employee">Employee</option>
                        </select>
                     
                    </div>
                    <button type="submit" className="submit-btn">Add Employee</button>
                </form>
            ) : (
                // Employee details form
                <form onSubmit={handleDetailsSubmit}>
                    <div className="form-group">
                        <label htmlFor="department">Department:</label>
                        <input
                            type="text"
                            id="department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="poste">Poste:</label>
                        <input
                            type="text"
                            id="poste"
                            value={poste}
                            onChange={(e) => setPoste(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dateDebutTravail">Start Date:</label>
                        <input
                            type="date"
                            id="dateDebutTravail"
                            value={dateDebutTravail}
                            onChange={(e) => setDateDebutTravail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="salaire">Salary:</label>
                        <input
                            type="number"
                            id="salaire"
                            value={salaire}
                            onChange={(e) => setSalaire(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombreJoursConge">Leave Days:</label>
                        <input
                            type="number"
                            id="nombreJoursConge"
                            value={nombreJoursConge}
                            onChange={(e) => setNombreJoursConge(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="submit-btn">Save Details</button>
                </form>
            )}
        </div>
       </div>
    );
};

export default AddUser;