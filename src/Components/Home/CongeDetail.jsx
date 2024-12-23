import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CongeDetail.css';

const CongeDetail = () => {
    const { actorId, createdAt } = useParams();
    const navigate = useNavigate();
    const [conge, setConge] = useState(null);
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [etat, setEtat] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // New state to handle errors

    // Fetch Conge details
    useEffect(() => {
        const fetchCongeDetails = async () => {
            try {
                // Ensure the date is formatted as ISO 8601 string with '+00:00' offset
                //const formattedCreatedAt = new Date(createdAt).toISOString();
                // console.log("louwel",createdAt) // This will ensure the correct ISO format with 'Z'
                // console.log("theny",formattedCreatedAt) // This will ensure the correct ISO format with 'Z'

                const response = await fetch(`http://localhost:5000/conge/congedetail/${actorId}/${createdAt}`);
                const data = await response.json();
                if (data) {
                    setConge(data);
                    setDateDebut(new Date(data.date_debut).toLocaleDateString());
                    setDateFin(new Date(data.date_fin).toLocaleDateString());
                    setEtat(data.etat);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching Conge details:', error);
                setLoading(false);
            }
        };
    
        fetchCongeDetails();
    }, [actorId, createdAt]);
    // Handle form submission to update Conge
    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedConge = {
            date_debut: dateDebut,
            date_fin: dateFin,
            etat: etat
        };

        try {
            const response = await fetch(`http://localhost:5000/conge/congedetail/${actorId}/${createdAt}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedConge),
            });

            const data = await response.json();
            if (data) {
                alert('Conge updated successfully');
                navigate('/dashboard'); // Redirect after update
            }
        } catch (error) {
            console.error('Error updating Conge:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>; // Display the error message if Conge is not found
    }

    return (
        <div className="conge-detail">
            <h2>Conge Details</h2>
            <div className="conge-info">
           
                <p><strong>Description:</strong> {conge.description}</p>
                <p><strong>Start Date:</strong> {new Date(conge.date_debut).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(conge.date_fin).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {conge.etat}</p>
            </div>

            <h3>Edit Conge</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Start Date:</label>
                    <input
                        type="date"
                        value={dateDebut}
                        onChange={(e) => setDateDebut(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>End Date:</label>
                    <input
                        type="date"
                        value={dateFin}
                        onChange={(e) => setDateFin(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Status:</label>
                    <select
                        value={etat}
                        onChange={(e) => setEtat(e.target.value)}
                    >
                        <option value="attend">Pending</option>
                        <option value="accepter">Accepted</option>
                        <option value="refuser">Rejected</option>
                    </select>
                </div>
                <button type="submit">Update Conge</button>
            </form>
        </div>
    );
};

export default CongeDetail;
