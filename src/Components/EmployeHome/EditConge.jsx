import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditConge = () => {
    const { id } = useParams(); // Leave request ID from the URL
    const navigate = useNavigate();
    const [conge, setConge] = useState(null);
    const [description, setDescription] = useState('');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [email] = useState(localStorage.getItem('email'));
    const [userId, setUserId] = useState('');
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    console.log(token);
    useEffect(() => {
        const fetchConge = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/conge/${id}`, {
                    headers: { Authorization: `Bearer ${token}` } // Add token to headers
                });
                const data = response.data;
                setConge(data);
                setDescription(data.description);
                setDateDebut(data.date_debut);
                setDateFin(data.date_fin);
                setCreatedAt(data.createdAt);
            } catch (error) {
                console.error('Error fetching conge:', error);
            }
        };
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
        fetchConge();
    }, [id, token,userId]);

    const handleSave = async () => {
        try {
            // Update leave request
            await axios.put(`http://localhost:5000/conge/congedetail/${conge.idemployee._id}/${createdAt}`, {
                description,
                date_debut: dateDebut,
                date_fin: dateFin,
                etat: 'attend',
            }, {
                headers: { Authorization: `Bearer ${token}` } // Add token to headers
            });

            alert('Conge updated successfully');

            // Send notifications to all managers
            const managers = await axios.get('http://localhost:5000/user/managers', {
                headers: { Authorization: `Bearer ${token}` } // Add token to headers
            });

            await Promise.all(managers.data.map(async (manager) => {
                console.log(manager._id);
                console.log(userId);
                await axios.post('http://localhost:5000/notifications/leave-decision', {
                    recipientId: manager._id,
                    actorId: userId,
                    message: `A leave request has been updated to "attend" and requires your review.`,
                   
                }, {
                    headers: { Authorization: `Bearer ${token}` } // Add token to headers
                });
            }));

            alert('Conge updated successfully');
            navigate(`/MyConge/${userId}`);
        } catch (error) {
            console.error('Error updating conge:', error);
        }
    };

    if (!conge) return <div>Loading...</div>;

    return (
        <div>
            <h2>Edit Conge</h2>
            <label>Description:</label>
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <label>Start Date:{dateDebut}</label>
            <input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
            />
            <label>End Date:{dateFin}</label>
            <input
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
            />
            <button onClick={handleSave}>Save</button>
        </div>
    );
};

export default EditConge;
