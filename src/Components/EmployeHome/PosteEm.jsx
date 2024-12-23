import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PosteEm.css'; // Assuming you'll add some CSS styles for cards
import { Header } from './Header';
import { Footer } from './Footer';

import Postes from '../posts/Postes';

const PosteEm = () => {

    return (
        <div>
            <Header></Header>
            <Postes></Postes>
            <Footer></Footer>
        </div>
    );
};

export default PosteEm;
