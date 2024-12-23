import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CongeUser.css';
import { Header } from './Header';
import { Footer } from './Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

const CongeUser = () => {
    const { actorId } = useParams();
    const [conges, setConges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [email] = useState(localStorage.getItem('email'));
    const [userId, setUserId] = useState('');
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
        const fetchUserConges = async () => {
            try {
                const response = await fetch(`http://localhost:5000/conge/congeuser/${actorId}`);
                const data = await response.json();
                if (response.ok) {
                    setConges(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                } else {
                    setError(data.message || 'Failed to fetch congés');
                }
            } catch (err) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserConges();
        getUserId();
    }, [actorId]);

    const handleSearch = (event) => setSearchTerm(event.target.value);

    const parseSearchInput = (input) => {
        const datePattern = /\d{4}-\d{2}-\d{2}/;
        const dateMatch = input.match(datePattern);
        const keywords = input.replace(datePattern, '').trim().toLowerCase();
        return { dateMatch, keywords };
    };

    const filteredConges = conges.filter((conge) => {
        const { dateMatch, keywords } = parseSearchInput(searchTerm);

        const congeDate = new Date(conge.createdAt).toISOString().slice(0, 10);
        const matchesKeywords =
            conge.description.toLowerCase().includes(keywords) ||
            conge.etat.toLowerCase().includes(keywords);

        const matchesDate = dateMatch ? congeDate.includes(dateMatch[0]) : true;
        return matchesKeywords && matchesDate;
    });

    const handleApprove = async (id) => await updateCongeStatus(id, 'accepter');

    const handleReject = async (id) => await updateCongeStatus(id, 'refuser');

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:5000/conge/${id}`, { method: 'DELETE' });

            setConges(conges.filter((conge) => conge._id !== id));
            alert('Conge deleted successfully');
        } catch (error) {
            console.error('Error deleting conge:', error);
        }
    };

    const updateCongeStatus = async (id, newStatus) => {
      try {
          const response = await fetch(`http://localhost:5000/conge/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ etat: newStatus, idmanager: userId }),
          });
  
          if (response.ok) {
              setConges((prevConges) =>
                  prevConges.map((conge) =>
                      conge._id === id ? { ...conge, etat: newStatus } : conge
                  )
              );
              alert(`Conge ${newStatus === 'accepter' ? 'approved' : 'rejected'} successfully`);
  
              // Notify the employee about the decision
              const message = `Your leave request has been ${newStatus === 'accepter' ? 'accepted' : 'rejected'} by the manager.`;
              await fetch(`http://localhost:5000/notifications/leave-decision`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                      recipientId: actorId,  // recipientId is the employee
                      actorId: userId,       // userId of the manager approving/rejecting the leave
                      message,
                      type: 'leave'
                  }),
              });
          }
      } catch (error) {
          console.error('Error updating conge:', error);
      }
  };
  

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <Header />
            <div className="conge-user">
                <h2>Employee Congés</h2>

                <div className="search-filters">
                    <input
                        type="text"
                        placeholder="Search by description, status, or date (YYYY-MM-DD)..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-input"
                    />
                </div>

                {filteredConges.length === 0 ? (
                    <p>No congés found for this user.</p>
                ) : (
                    <table className="conge-table">
                        <thead>
                            <tr>
                                <th>Employer</th>
                                <th>Description</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Created Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                          {filteredConges.map((conge) => (
                              <tr key={conge._id}>
                                  <td>{conge.idemployee.username}</td>
                                  <td>{conge.description}</td>
                                  <td>{new Date(conge.date_debut).toLocaleDateString()}</td>
                                  <td>{new Date(conge.date_fin).toLocaleDateString()}</td>
                                  <td>{new Date(conge.createdAt).toLocaleDateString()}</td>
                                  <td className={`status-${conge.etat.toLowerCase()}`}>{conge.etat}</td>
                                  <td className="action-icons">
                                      <FontAwesomeIcon
                                          icon={faCheck}
                                          onClick={() => handleApprove(conge._id)}
                                          title="Approve"
                                          className="icon-approve"
                                      />
                                      <FontAwesomeIcon
                                          icon={faTimes}
                                          onClick={() => handleReject(conge._id)}
                                          title="Reject"
                                          className="icon-reject"
                                      />
                                      <FontAwesomeIcon
                                          icon={faTrash}
                                          onClick={() => handleDelete(conge._id)}
                                          title="Delete"
                                          className="icon-delete"
                                      />
                                  </td>
                              </tr>
                          ))}
                      </tbody>

                    </table>
                )}

         
            </div>
            <Footer />
        </div>
    );
};

export default CongeUser;
