import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register';
import ProfilePage from './pages/ProfilePage';

import FeedsPage from './pages/FeedsPage';

import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage.jsx';
import NotFound from './pages/NotFound.jsx';

const App = () => {
    return (
        <BrowserRouter>
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
                {/* Public Routes */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<HomePage />} />

                <Route path="/feeds" element={<FeedsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
