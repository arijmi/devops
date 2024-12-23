import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import PostDetail from '../posts/PostDetail'; // Adjust the path as needed
import { useParams } from 'react-router-dom'; // Import useParams to get the postId from URL

const EditPoste = () => {
    const { postId } = useParams(); // Get the postId from URL params

    return (
        <div>
            <Header />
            <PostDetail postId={postId} /> {/* Pass the postId to PostDetail */}
            <Footer />
        </div>
    );
};

export default EditPoste;
