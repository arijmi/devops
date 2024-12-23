import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Header } from './Header';
import { Footer } from './Footer';
import './MyEvaluation.css'
// Function to get color based on score
const getColorForScore = (score) => {
    if (score < 30) {
        return 'red';  // red for score < 30
    } else if (score >= 30 && score < 50) {
        return 'orange';  // orange for score between 30 and 50
    } else if (score >= 50 && score < 80) {
        return 'blue';  // blue for score between 50 and 80
    } else {
        return 'green';  // green for score > 80
    }
};

const MyEvaluation = () => {
    const [userId, setUserId] = useState(null); // Store user ID
    const [evaluations, setEvaluations] = useState([]); // Store evaluations
    const [loading, setLoading] = useState(true); // For loading state
    const email = localStorage.getItem('email'); // Get email from localStorage
    const token = localStorage.getItem('token'); // Get token from localStorage

    // Function to fetch user ID by email
    const getUserId = async () => {
        if (!email) {
            console.error('Email is not set in localStorage.');
            return;
        }
        try {
            const response = await axios.get(`http://localhost:5000/user/findbyemail/${email}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setUserId(response.data._id); // Set user ID
            console.log("User ID:", userId);
        } catch (error) {
            toast.error('Error fetching user details:', error); // Show error toast
        }
    };

    // Function to fetch evaluations by employee ID
    const getEvaluations = async () => {
        if (!userId) {
            console.error('User ID is not set.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/evaluation/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setEvaluations(response.data); // Set evaluations data
            setLoading(false); // Set loading to false after data is fetched
        } catch (error) {
            toast.error('Error fetching evaluations:', error); // Show error toast
            setLoading(false); // Set loading to false in case of error
        }
    };

    useEffect(() => {
        // Fetch user ID and evaluations when the component mounts
        getUserId();
    }, [email, token]);

    useEffect(() => {
        if (userId) {
            // Fetch evaluations when userId is available
            getEvaluations();
        }
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>; // Display loading message while fetching data
    }

    return (
        <div className="my-evaluation-container">
            <Header />
            <h2>My Performance Evaluations</h2>

            {evaluations.length === 0 ? (
                <p>No evaluations found.</p>
            ) : (
                <div className="evaluation-cards">
                    {evaluations.map((evaluation) => (
                        <div
                            className="evaluation-card"
                            key={evaluation._id}
                            style={{ backgroundColor: getColorForScore(evaluation.score) }}
                        >
                            <h3>Evaluator: {evaluation.evaluatorId.username}</h3>
                            <p><strong>Score:</strong> {evaluation.score}</p>
                            <p><strong>Feedback:</strong> {evaluation.feedback}</p>
                        </div>
                    ))}
                </div>
            )}
            <Footer />
        </div>
    );
};

export default MyEvaluation;
