import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate here
import './Header.css';

export const Header = () => {
    const [searchActive, setSearchActive] = useState(false);
    const [notificationActive, setNotificationActive] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [email] = useState(localStorage.getItem('email'));
    const navigate = useNavigate(); // Initialize useNavigate hook

    const toggleSearch = () => {
        setSearchActive(!searchActive);
    };
    const logout=()=>{
        localStorage.setItem('email','');
        localStorage.setItem('token', '');
        localStorage.setItem('role', '');
        navigate(`/`);
    }
    const toggleNotifications = () => {
        setNotificationActive(!notificationActive);
    };

    // Fetch notifications for the logged-in user when the notification menu is opened
    useEffect(() => {
        if (notificationActive) {
            // Make sure the logged-in user is fetching notifications (assuming JWT is stored in localStorage)
            const token = localStorage.getItem('token');
            fetch('http://localhost:5000/notifications', {
                headers: {
                    'Authorization': `Bearer ${token}` // Attach the token for authorization
                }
            })
                .then(response => response.json())
                .then(data => setNotifications(data))
                .catch(error => console.error('Error fetching notifications:', error));
        }
    }, [notificationActive]);

    // Handle notification click to navigate to the leave details page
    const handleNotificationClick = (actorId,createdAt) => {
        // Use navigate to go to the CongeDetail page
        console.log(actorId)
        navigate(`/conges/user/${actorId._id}`); // This assumes the Conge details route accepts actorId or notificationId
    };

    return (
        <header className="app-header">
            <nav>
                <div className="nav-bar">
                    <i className='bx bx-menu sidebarOpen'></i>
                    <span className="logo navLogo"><a href="#">CodingLab</a></span>
                    <div className="menu">
                        <ul className="nav-links">
                            <li><Link to="/DashboardAdmin"><i className='bx bx-home'></i></Link></li>
                            <li><Link to="/PosteAdmin"><i className='bx bx-edit'></i> </Link></li>
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
                                                <li key={index} onClick={() => handleNotificationClick(notification.actorId,notification.createdAt)}>
                                                    { notification.recipientId.email === email && (

                                                        <div className="notification-item">
                                                            <p><strong>{notification.actorId.username}</strong> {notification.type} - {notification.message}</p>
                                                            {/* <span>{new Date(notification.createdAt).toLocaleString()}</span> */}
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
                            <li><Link to="/ListeEmp"><i className='bx bx-briefcase'></i></Link></li>
                            <li><a href="/ListeManager"><i className="bx bx-user-circle"></i></a></li>
                            <li className="profile-menu">
                                <a href="#"><i className='bx bx-user'></i></a>
                                <ul className="dropdown">
                                    <li><Link to="/ProfileAdmin"><i className='bx bx-user'></i> Profile</Link></li>
                                    <li><Link to="/Settings"><i className='bx bx-cog'></i> Settings</Link></li>
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
