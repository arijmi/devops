import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import React Toastify
import './ListeEmp.css';
import { Header } from './Header';
import { Footer } from './Footer';

// Import Font Awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus, faSearch, faInfoCircle, faStar } from '@fortawesome/free-solid-svg-icons';

const ListeEmp = () => {
    const [employees, setEmployees] = useState([]);  // Store employees
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleuser = localStorage.getItem('role');

        if (!token || roleuser === 'employee') {
            navigate('/home');
        } else {
            fetchEmployees();
        }
    }, []);

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/user/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const employees = response.data.filter(user => user.role === 'employee');
            setEmployees(employees);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
        if (confirmDelete) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/user/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setEmployees(employees.filter(employee => employee._id !== id));
                toast.success('Employee deleted successfully.');
            } catch (error) {
                console.error('Error deleting employee:', error);
                toast.error('An error occurred while deleting the employee.');
            }
        }
    };

    const handleEvaluations = async (employeeId) => {
        try {
            console.log(`Fetching evaluations for employee ID: ${employeeId}`); // Debugging log
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/evaluation/${employeeId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const evaluations = response.data;
            console.log('Evaluations:', evaluations);  // Debugging log

            if (evaluations.length === 0) {
                toast.info("No evaluations found for this employee.", { position: "top-center" });
            } else {
                displayEvaluationsToast(evaluations);
            }
        } catch (error) {
            console.error('Error fetching evaluations:', error);
            toast.error('An error occurred while fetching evaluations.', { position: "top-center" });
        }
    };

    // Reusable function to display the toast for evaluations
    const displayEvaluationsToast = (evaluations) => {
        toast(
            <div>
                <h5>Evaluations for Employee</h5>
                <ol> 
                    {evaluations.map((evaluation) => (
                        
                        <li key={evaluation._id}>
                            <strong>By :</strong> {evaluation.evaluatorId.username} <br />
                            <strong>Score:</strong> {evaluation.score} <br />
                            <strong>Feedback:</strong> {evaluation.feedback} <br />
                            
                        </li>
                    ))}
                </ol>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
                className: "custom-toast"
            }
        );
    };

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    const handleAddEmployee = () => {
        navigate('/AddUser');
    };

    const handleInfo = (id) => {
        navigate(`/conges/user/${id}`); // Navigate to the employee info page (create it if needed)
    };

    // Filter employees based on search term
    const filteredEmployees = employees.filter(employee =>
        employee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Header />
            <br />
            <div className="employee-list-container">
                <h1>List of Employees</h1>

                {/* Search bar */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                </div>

                {/* Add Employee Button */}
                <button className="add-employee-btn" onClick={handleAddEmployee}>
                    <FontAwesomeIcon icon={faPlus} /> Add Employee
                </button>

                {/* Employee Table */}
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map(employee => (
                            <tr key={employee._id}>
                                <td>{employee.username}</td>
                                <td>{employee.email}</td>
                                <td>
                                    {/* Action Icons */}
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                        className="action-icon edit-icon"
                                        onClick={() => handleEdit(employee._id)}
                                    />
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        className="action-icon delete-icon"
                                        onClick={() => handleDelete(employee._id)}
                                    />
                                    {/* Info Icon */}
                                    <FontAwesomeIcon
                                        icon={faInfoCircle}
                                        className="action-icon info-icon"
                                        onClick={() => handleInfo(employee._id)}
                                    />

                                    {/* Star Icon for Evaluations */}
                                    <FontAwesomeIcon
                                        icon={faStar}
                                        className="bx bx-chart"
                                        onClick={() => handleEvaluations(employee._id)}
                                        title="View Evaluations"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Toast Container for displaying notifications */}
            <ToastContainer />
        </div>
    );
};

export default ListeEmp;
