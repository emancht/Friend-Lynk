import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500  shadow-md px-6">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                <div className="text-3xl text-white">
                    <Link to="/">
                        Friend<strong>Lynk</strong>
                    </Link>
                </div>
                <div className="space-x-4">
                    <Link
                        to="/login"
                        className="px-4 py-2 text-white text-lg rounded-lg hover:bg-purple-500 transition duration-200"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="px-4 py-2 text-white text-lg rounded-lg hover:bg-purple-500 transition duration-200"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
