// src/components/LoginSignup/LoginSignup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css';

const LoginSignup = () => {
    const [action, setAction] = useState("Login");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (action === "Login") {
                // Send login request
                const response = await axios.post('http://localhost:5000/auth/login', { email, password });
                const token = response.data.token;
                const role = response.data.role;
                
              
                // const {role ,email} = response.data; // Assume role is sent back
                console.log('Logged in successfully. Token:', token);
                console.log('Logged in successfully. role:', role);
                localStorage.setItem('email',email);
                localStorage.setItem('token', token);
                localStorage.setItem('role', role); // Store the role
            
              
                // Conditional navigation based on role
                if (role == 'employee') {
                    navigate('/employeHome');
                } else if (role == 'manager') {
                    navigate('/dashboard');
                } else if (role == 'admin') {
                    navigate('/DashboardAdmin');
                }
            } else {
                // Send signup request
                const response = await axios.post('http://localhost:5000/auth/register', { username, password, email });
                console.log('Signed up successfully', response.data);
                
                setAction("Login"); // Change action to login after signup
            }
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Backend responded with error:", error.response.data);
                setError(error.response.data); // Show the backend error message
            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response from backend:", error.request);
                setError('No response from server. Please try again later.');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error in setting up request:", error.message);
                setError('Error occurred. Please try again.');
            }
        }
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>{action}</h1>
                <div className="input-box">
                    {action === "Sign Up" && (
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                {error && <div className="error">{error}</div>}

                <div className='submit-container'>
                    <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => setAction("Sign Up")}>
                        <button type="submit" className="submit gray">Sign Up</button> 
                    </div>
                    <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => setAction("Login")}>
                       <button type="submit" className="submit gray">Login</button> 
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoginSignup;
