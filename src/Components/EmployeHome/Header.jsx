import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Header.css';

export const Header = () => {
    const [searchActive, setSearchActive] = useState(false);
    const [notificationActive, setNotificationActive] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [email] = useState(localStorage.getItem('email'));
    const [iduser, setUserId] = useState('');

    const navigate = useNavigate();

    const toggleSearch = () => {
        setSearchActive(!searchActive);
    };

    const logout = () => {
        localStorage.setItem('email', '');
        localStorage.setItem('token', '');
        localStorage.setItem('role', '');
        navigate(`/`);
    };

    const toggleNotifications = () => {
        setNotificationActive(!notificationActive);
    };

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

        if (notificationActive) {
            const token = localStorage.getItem('token');
            fetch('http://localhost:5000/notifications', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then(data => setNotifications(data))
                .catch(error => console.error('Error fetching notifications:', error));
        }
    }, [notificationActive, email]);

    const handleNotificationClick = (actorId) => {
        navigate(`/MyConge/${actorId._id}`);
    };

    return (
        <header className="app-header">
            <nav>
                <div className="nav-bar">
                    <i className='bx bx-menu sidebarOpen'></i>
                    <span className="logo navLogo"><a href="#">CodingLab</a></span>
                    <div className="menu">
                        <ul className="nav-links">
                            <li><Link to="/employeHome"><i className='bx bx-home'></i></Link></li>
                            <li><Link to="/posteEmploye"><i className='bx bx-edit'></i></Link></li>
                            
                            {/* New icons for Conge and Timesheet with dynamic URL for MyConge */}
                            <li><Link to={`/MyConge/${iduser}`}><i className='bx bx-calendar'></i></Link></li>
                            <li><Link to="/MyTimeSheet"><i className='bx bx-time-five'></i></Link></li>
                             {/* Add My Evaluation link here */}
                             <li><Link to="/MyEvaluation"><i className='bx bx-chart'></i></Link></li>
                            <li 
                                className="notification-menu"
                                onMouseEnter={() => setNotificationActive(true)}
                                onMouseLeave={() => setNotificationActive(false)}
                            >
                                <a href="#">
                                    <i className='bx bx-bell'></i> 
                                </a>
                                {notificationActive && (
                                    <ul className="notification-dropdown">
                                        {notifications.length > 0 ? (
                                            notifications.map((notification, index) => (
                                                <li key={index} onClick={() => handleNotificationClick(notification.actorId)}>
                                                    {notification.recipientId.email === email && (
                                                        <div className="notification-item">
                                                            <p><strong>{notification.actorId.username}</strong> {notification.type} - {notification.message}</p>
                                                            <hr />
                                                        </div>
                                                    )}
                                                </li>
                                            ))
                                        ) : (
                                            <li><a href="#">No notifications</a></li>
                                        )}
                                    </ul>
                                )}
                            </li>

                            <li className="profile-menu">
                                <a href="#"><i className='bx bx-user'></i></a>
                                <ul className="dropdown">
                                    <li><Link to="/ProfileEm"><i className='bx bx-user'></i> Profile</Link></li>
                                    <li><Link to="/employeHome"><i className='bx bx-cog'></i> Settings</Link></li>
                                    <li><a onClick={logout}><i className='bx bx-power-off'></i> Logout</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div className="darkLight-searchBox">
                        <div className="searchBox">
                            <div className="searchToggle" onClick={toggleSearch}>
                                <i className={`bx ${searchActive ? 'bx-x' : 'bx-search'} search`}></i>
                            </div>
                            <div className={`search-field ${searchActive ? 'active' : ''}`}>
                                <input type="text" placeholder="Search..." />
                                <i className='bx bx-search'></i>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
