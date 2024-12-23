import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import { Header } from './Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faClipboardCheck, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
    const [employees, setEmployees] = useState([]);
    const [idManager, setIdManager] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [evaluationData, setEvaluationData] = useState({
        score: 0,
        feedback: 'good feedback'
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleuser = localStorage.getItem('role');

        if (!token || roleuser === 'employee') {
            navigate('/');
        } else {
            fetchEmployees();
        }

        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const email = localStorage.getItem('email');
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

    const handleAddEvaluation = (employee) => {
        fetchEvaluationForEmployee(employee._id); // Fetch evaluation if available
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEvaluationData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmitEvaluation = async (employeeId) => {
        try {
            const token = localStorage.getItem('token');
            const payload = {
                employeeId: employeeId, // Use the passed employeeId
                evaluatorId: idManager, // Adjust based on your auth logic
                ...evaluationData
            };
            console.log(payload);
            await axios.post('http://localhost:5000/evaluation', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            toast.dismiss(); // Close the toast after submission
            alert('Evaluation submitted successfully.');
        } catch (error) {
            console.error('Error submitting evaluation:', error);
            alert('Failed to submit evaluation.');
        }
    };

    const fetchEvaluationForEmployee = async (employeeId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/evaluation/${employeeId}/${idManager}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const evaluation = response.data;

            if (evaluation && evaluation.evaluatorId === idManager) {
                // If evaluation exists from this manager, show it and allow editing
                setEvaluationData({
                    score: evaluation.score,
                    feedback: evaluation.feedback
                });
                displayToast(employeeId, true,evaluation._id); // Pass true to indicate it's for updating
            } else {
                // Otherwise show the form for adding a new evaluation
                setEvaluationData({
                    score: '',
                    feedback: ''
                });
                displayToast(employeeId, false); // Pass false to indicate it's for adding
            }
        } catch (error) {
            console.error('Error fetching evaluation:', error);
            toast.error('Failed to fetch evaluation');
        }
    };

    const displayToast = (employeeId, isEdit,idEvaluation='') => {
        const handleLocalFormChange = (e) => {
            const { name, value } = e.target;
            setEvaluationData(prev => ({
                ...prev,
                [name]: value
            }));
        };

        const handleLocalSubmitEvaluation = async () => {
            try {
                const token = localStorage.getItem('token');
                const payload = {
                    employeeId: employeeId,
                    evaluatorId: idManager,
                    ...evaluationData
                };

                if (isEdit) {
                    // Update the existing evaluation
                    await axios.put(`http://localhost:5000/evaluation/${idEvaluation}`, payload, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } else {
                    // Add a new evaluation
                    console.log(payload);
                    await axios.post('http://localhost:5000/evaluation', payload, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                }

                toast.dismiss(); // Close the toast after submission
                alert(isEdit ? 'Evaluation updated successfully.' : 'Evaluation submitted successfully.');
            } catch (error) {
                console.error('Error submitting evaluation:', error);
                alert('Failed to submit evaluation.');
            }
        };

        const handleCancel = () => {
            toast.dismiss(); // Close the toast when cancel is clicked
        };

        toast(
            <div>
                <h5>{isEdit ? 'Edit Performance Evaluation' : 'Add Performance Evaluation'}</h5>
                <form>
                    <div className="form-group">
                        <label>Score (1-100)</label>
                        <input
                            type="number"
                            name="score"
                            placeholder="Enter score "
                            className="form-control"
                            value={evaluationData.score}
                            onChange={handleLocalFormChange}
                            min="1"
                            max="100"
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Feedback</label>
                        <textarea
                            name="feedback"
                            className="form-control"
                            placeholder="Enter feedback"
                            value={evaluationData.feedback }
                            onChange={handleLocalFormChange}
                            rows="3"
                        />
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary mt-3"
                        onClick={handleLocalSubmitEvaluation}
                    >
                        {isEdit ? 'Update' : 'Submit'}
                    </button>
                    <button
                        type="button"
                        className="delete-btn"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </form>
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
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                        className="action-icon"
                                        title="Edit"
                                        onClick={() => handleEdit(employee._id)}
                                    />
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        className="action-icon delete-icon"
                                        title="Delete"
                                        onClick={() => handleDelete(employee._id)}
                                    />
                                    <FontAwesomeIcon
                                        icon={faClipboardCheck}
                                        className="action-icon evaluate-icon"
                                        title="Evaluate"
                                        onClick={() => handleAddEvaluation(employee)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
};

export default Home;
