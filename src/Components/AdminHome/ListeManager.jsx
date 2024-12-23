import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ListeManager.css';
import { Header } from './Header';
import { Footer } from './Footer';

// Import Font Awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

const ListeManager = () => {
    const [employees, setEmployees] = useState([]);
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
            const employees = response.data.filter(user => user.role === 'manager');
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
                alert('Employee deleted successfully.');
            } catch (error) {
                console.error('Error deleting employee:', error);
                alert('An error occurred while deleting the employee.');
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    const handleAddEmployee = () => {
        navigate('/addEmploy');
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
                <h1>List of Maneger</h1>
                
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
                                    <button className="action-btn edit-btn" onClick={() => handleEdit(employee._id)}>
                                        <FontAwesomeIcon icon={faEdit} /> Modify
                                    </button>
                                    <button className="action-btn delete-btn" onClick={() => handleDelete(employee._id)}>
                                        <FontAwesomeIcon icon={faTrashAlt} /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        
        </div>
    );
};

export default ListeManager;
