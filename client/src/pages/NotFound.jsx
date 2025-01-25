import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/feeds');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-xl mb-6">
                Oops! The page you're looking for doesn't exist.
            </p>
            <button
                onClick={handleGoHome}
                className="px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
            >
                Go Home
            </button>
        </div>
    );
};

export default NotFound;
