import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './PostDetail.css';

const PostDetail = ({ postId }) => {  
    const navigate = useNavigate(); 
    const [post, setPost] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [email] = useState(localStorage.getItem('email'));
    const [role] = useState(localStorage.getItem('role'));
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedContent, setUpdatedContent] = useState('');

    const fetchPostDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/posts/${postId}`);
            setPost(response.data);
            setUpdatedTitle(response.data.title);
            setUpdatedContent(response.data.content);
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:5000/posts/${postId}/comment/${commentId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 200) {
                alert("Comment deleted successfully");
                fetchPostDetails(); 
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleEditComment = (commentId, text) => {
        setEditingComment(commentId);
        setCommentText(text);
    };

    const handleSaveComment = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/posts/${postId}/comment/${editingComment}`, {
                text: commentText
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert("Comment updated successfully");
            setEditingComment(null);
            setCommentText('');
            fetchPostDetails();
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    const handleUpdatePost = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/posts/${postId}`, {
                title: updatedTitle,
                content: updatedContent
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert("Post updated successfully");
            setIsEditingPost(false);
            fetchPostDetails();
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    useEffect(() => {
        fetchPostDetails();
    }, [postId]);

    if (!post) return <p>Loading post details...</p>;

    return (
        <div className="post-detail-card">
            {isEditingPost ? (
                <div className="card">
                    <h2>
                        <input 
                            type="text" 
                            value={updatedTitle} 
                            onChange={(e) => setUpdatedTitle(e.target.value)} 
                        />
                    </h2>
                    <textarea 
                        value={updatedContent} 
                        onChange={(e) => setUpdatedContent(e.target.value)} 
                    ></textarea>
                    <div className="action-buttons">
                        <button onClick={handleUpdatePost} className="icon-button save">
                            <i className="fas fa-save"></i> Save
                        </button>
                        <button onClick={() => setIsEditingPost(false)} className="icon-button cancel">
                            <i className="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="card">
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    {role === 'admin' && (
                        <button onClick={() => setIsEditingPost(true)} className="icon-button edit">
                            <i className="fas fa-edit"></i> Edit Post
                        </button>
                    )}
                </div>
            )}

            <h3>Comments</h3>
            <ul>
                {post.comments.map((comment) => (
                    <li key={comment._id} className="comment-card">
                        <div className="comment-header">
                            <strong>{comment.idUser.username}</strong> 
                            {role === 'admin' || comment.idUser.email === email ? (
                                <div className="comment-actions">
                                    <button onClick={() => handleEditComment(comment._id, comment.text)} className="icon-button edit">
                                        <i className="fas fa-edit"></i> Edit
                                    </button>
                                    <button onClick={() => handleDeleteComment(comment._id)} className="icon-button delete">
                                        <i className="fas fa-trash"></i> Delete
                                    </button>
                                </div>
                            ) : null}
                        </div>
                        <p>{comment.text}</p>

                        {editingComment === comment._id && (
                            <div className="edit-comment">
                                <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                ></textarea>
                                <div className="action-buttons">
                                    <button onClick={handleSaveComment} className="icon-button save">
                                        <i className="fas fa-save"></i> Save
                                    </button>
                                    <button onClick={() => setEditingComment(null)} className="icon-button cancel">
                                        <i className="fas fa-times"></i> Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <button onClick={() => navigate(-1)} className="icon-button back">
                <i className="fas fa-arrow-left"></i> Back
            </button>
        </div>
    );
};

export default PostDetail;
