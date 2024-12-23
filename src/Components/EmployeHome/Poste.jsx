import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Poste.css'; // Assuming you'll add some CSS styles for cards
import { Header } from './Header';
import { Footer } from './Footer';

import Postes from '../posts/Postes';

const Poste = () => {
    // const [posts, setPosts] = useState([]);
    // const [title, setTitle] = useState('');
    // const [content, setContent] = useState('');
    // const [email, setEmail] = useState(localStorage.getItem('email'));
    // const [userId, setUserId] = useState('');
    // const [commentTexts, setCommentTexts] = useState({}); // New state for handling comment text per post

    // const getUserId = async () => {
    //     if (!email) {
    //         console.error('Email is not set in localStorage.');
    //         return;
    //     }

    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await axios.get(`http://localhost:5000/user/findbyemail/${email}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });
    //         setUserId(response.data._id);
    //     } catch (error) {
    //         console.error('Error fetching user details:', error);
    //         alert('Failed to fetch user details. Please try again.');
    //     }
    // };


    // const fetchPosts = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:5000/posts');
    //         setPosts(response.data);
    //     } catch (error) {
    //         console.error('Error fetching posts:', error);
    //     }
    // };


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (!userId) {
    //         console.error('User ID is not available.');
    //         return;
    //     }

    //     try {
    //         await axios.post('http://localhost:5000/posts', {
    //             title,
    //             content,
    //             idUser: userId,
    //         });
    //         setTitle('');
    //         setContent('');
    //         fetchPosts(); // Refresh the list of posts
    //     } catch (error) {
    //         console.error('Error creating post:', error);
    //         alert('Failed to create post. Please try again.');
    //     }
    // };


    // const handleLike = async (postId) => {
    //     if (!userId) {
    //         console.error('User ID is not available for liking a post.');
    //         return;
    //     }

    //     try {
    //         const response = await axios.post(`http://localhost:5000/posts/${postId}/like`, {
    //             userId: userId,
    //         });

    //         if (response.status === 200) {
    //             alert(response.data.message); // Display success message
    //             fetchPosts(); // Refresh the list of posts
    //         } else {
    //             alert(response.data.message); // Display already liked message
    //         }
    //     } catch (error) {
    //         console.error('Error liking post:', error);
    //         alert('Failed to like the post. Please try again.');
    //     }
    // };

    // // Add a comment to a post
    // const handleAddComment = async (postId) => {
    //     const commentText = commentTexts[postId]; // Get the comment text for this specific post
    //     if (!commentText?.trim()) {
    //         alert("Comment cannot be empty");
    //         return;
    //     }

    //     if (!userId) {
    //         console.error('User ID is not available for adding a comment.');
    //         return;
    //     }

    //     try {
    //         const response = await axios.post(`http://localhost:5000/posts/${postId}/comment`, {
    //             text: commentText,
    //             idUser: userId,
    //         });

    //         if (response.status === 200) {
    //             setCommentTexts({ ...commentTexts, [postId]: '' }); // Clear the comment text for this post
    //             fetchPosts(); // Refresh the list of posts to show the new comment
    //         } else {
    //             alert('Failed to add comment. Please try again.');
    //         }
    //     } catch (error) {
    //         console.error('Error adding comment:', error);
    //         alert('Failed to add comment. Please try again.');
    //     }
    // };

    // // Handle comment text change for each post
    // const handleCommentChange = (postId, text) => {
    //     setCommentTexts({ ...commentTexts, [postId]: text }); // Update the comment text for this specific post
    // };

    // useEffect(() => {
    //     getUserId(); // Get user ID on component mount
    //     fetchPosts(); // Fetch posts on component mount
    // }, []); // Empty dependency array means this runs once

    return (
        <div>
            <Header></Header>
            <Postes></Postes>
            {/* <h1>Create a Post</h1>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Create Post</button>
            </form>

            <h2>All Posts</h2>
            <div className="posts-container">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post._id} className="post-card">
                            <h3>{post.idUser?.username || 'Unknown'}</h3>
                            <p><strong>Title:</strong> {post.title}</p>
                            <p>{post.content}</p>
                            <p><strong>Likes:</strong> {post.user_like.length}</p>

                            <button onClick={() => handleLike(post._id)}>Like</button>

                            
                            <div className="comment-section">
                                <input
                                    type="text"
                                    placeholder="Add a comment"
                                    value={commentTexts[post._id] || ''} // Get the comment text for this post
                                    onChange={(e) => handleCommentChange(post._id, e.target.value)}
                                />
                                <button onClick={() => handleAddComment(post._id)}>Comment</button>
                            </div>

                            
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
            </div> */}
            <Footer></Footer>
        </div>
    );
};

export default Poste;
