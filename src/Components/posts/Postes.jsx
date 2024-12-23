import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Postes.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Postes = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [email] = useState(localStorage.getItem('email'));
    const [role] = useState(localStorage.getItem('role'));
    const [userId, setUserId] = useState('');
    const [commentTexts, setCommentTexts] = useState({});
    const [activeCommentForm, setActiveCommentForm] = useState(null);
    const [showAddPostForm, setShowAddPostForm] = useState(false);

    const navigate = useNavigate(); // Initialize useNavigate

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

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            console.error('User ID is not available.');
            return;
        }
        try {
            await axios.post('http://localhost:5000/posts', {
                title,
                content,
                idUser: userId,
            });
            setTitle('');
            setContent('');
            fetchPosts();
            setShowAddPostForm(false);
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post. Please try again.');
        }
    };

    const handleLike = async (postId) => {
        if (!userId) {
            console.error('User ID is not available for liking a post.');
            return;
        }
        try {
            const response = await axios.post(`http://localhost:5000/posts/${postId}/like`, {
                userId: userId,
            });
            if (response.status === 200) {
                fetchPosts();
            }
        } catch (error) {
            console.error('Error liking post:', error);
            alert('Failed to like the post. Please try again.');
        }
    };

    const handleAddComment = async (postId) => {
        const commentText = commentTexts[postId];
        if (!commentText?.trim()) {
            alert("Comment cannot be empty");
            return;
        }
        if (!userId) {
            console.error('User ID is not available for adding a comment.');
            return;
        }
        try {
            const response = await axios.post(`http://localhost:5000/posts/${postId}/comment`, {
                text: commentText,
                idUser: userId,
            });
            if (response.status === 200) {
                setCommentTexts({ ...commentTexts, [postId]: '' });
                fetchPosts();
                setActiveCommentForm(null);
            } else {
                alert('Failed to add comment. Please try again.');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment. Please try again.');
        }
    };

    const handleDeletePost = async (postId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;
    
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:5000/posts/${postId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.status === 200) {
                alert(response.data.message);
                fetchPosts();
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete the post. Please try again.');
        }
    };

    const handleCommentChange = (postId, text) => {
        setCommentTexts({ ...commentTexts, [postId]: text });
    };

    const handleNavigateToEdit = (postId) => {
        // Navigate to the EditPoste route with the post ID
        navigate(`/editpost/${postId}`);
    };

    useEffect(() => {
        getUserId();
        fetchPosts();
    }, []);

    return (
        <div>
            <h1>Posts</h1>

            <button onClick={() => setShowAddPostForm(!showAddPostForm)}>
                {showAddPostForm ? <i className="fas fa-times"></i> : <i className="fas fa-plus"></i>} Add Post
            </button>

            {showAddPostForm && (
                <form onSubmit={handleSubmit} className="add-post-form">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                    <button type="submit"><i className="fas fa-paper-plane"></i> Submit Post</button>
                </form>
            )}

          
            <div className="posts-container">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post._id} className="post-card">
                            <h3>{post.idUser?.username || 'Unknown'}</h3>
                            <p><strong>Title:</strong> {post.title}</p>
                            <p>{post.content}</p>
                            {/* <p><strong>Likes:</strong> </p> */}

                            <div className="post-actions">
                                <button className="small-button" onClick={() => handleLike(post._id)}>
                                    <i className="fas fa-thumbs-up"></i> Like {post.user_like.length}
                                </button>

                                <button
                                    className="small-button"
                                    onClick={() => setActiveCommentForm(activeCommentForm === post._id ? null : post._id)}
                                >
                                    {activeCommentForm === post._id ? (
                                        <>
                                            <i className="fas fa-times"></i> Hide Comment
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-comment"></i> Comment
                                        </>
                                    )}
                                </button>

                                {(role === 'admin' || post.idUser?._id === userId) && (
                                    <button className="small-button" onClick={() => handleDeletePost(post._id)}>
                                        <i className="fas fa-trash"></i> Delete
                                    </button>
                                )}

                              
                            </div>

                            {/* "Details" Icon at the top-right of the post */}
                            <div className="details-icon" onClick={() => handleNavigateToEdit(post._id)}>
                                <i className="fas fa-info-circle"></i> {/* You can replace with any icon */}
                            </div>

                            {activeCommentForm === post._id && (
                                <div className="comment-section">
                                    <input
                                        type="text"
                                        placeholder="Add a comment"
                                        value={commentTexts[post._id] || ''}
                                        onChange={(e) => handleCommentChange(post._id, e.target.value)}
                                    />
                                    <button onClick={() => handleAddComment(post._id)}>
                                        <i className="fas fa-paper-plane"></i>
                                    </button>
                                </div>
                            )}

                            {post.comments && post.comments.length > 0 && (
                                <div className="comments-list">
                                    <h4>Comments:</h4>
                                    <ul>
                                        {post.comments.map((comment, index) => (
                                            <li key={index}>
                                                <strong>{comment.idUser.username}:</strong> {comment.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No posts available.</p>
                )}
            </div>
        </div>
    );
};

export default Postes;
