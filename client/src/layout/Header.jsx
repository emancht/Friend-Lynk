import React, { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import {
    FaBell,
    FaCog,
    FaCommentAlt,
    FaEnvelope,
    FaHome,
    FaQuestionCircle,
    FaSearch,
    FaSignOutAlt,
    FaUserCircle,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import authStore from '../store/authStore';

const Header = () => {
    const { user, logout, isLoading, error } = authStore();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login'); // Redirect to login if user is not logged in
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout(); // Call the logout function to clear user data
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-8 py-2 flex justify-between items-center">
                {/* Logo */}
                <div className="text-2xl font-bold text-white">
                    <Link to="/feeds">
                        <span>
                            Friend
                            <strong className="text-green-400">Lynk</strong>
                        </span>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="hidden md:flex w-1/3 text-red-100 items-center relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 text-white bg-transparent border border-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-50 placeholder:text-white"
                    />
                    <FaSearch className="absolute left-3 text-white" />
                </div>

                {/* Navigation */}
                <nav className="flex items-center space-x-8">
                    <Link
                        to="/feeds"
                        className="flex items-center text-2xl text-cyan-400 hover:text-teal-200"
                    >
                        <FaHome className="mr-1" />
                    </Link>
                    <Link
                        to="/notifications"
                        className="flex items-center text-2xl text-yellow-400 hover:text-teal-200"
                    >
                        <FaBell className="mr-1" />
                    </Link>
                    <Link
                        to="/messages"
                        className="flex items-center text-2xl text-purple-300 hover:text-teal-200"
                    >
                        <FaEnvelope className="mr-1" />
                    </Link>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <Avatar
                            size="30"
                            round={true}
                            src={
                                user?.profileImage ||
                                'https://via.placeholder.com/150'
                            }
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="cursor-pointer"
                        />
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-60 text-lg bg-white border border-gray-200 rounded-lg shadow-lg">
                                <Link
                                    to="/profile"
                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    <FaUserCircle className="mr-2 text-blue-500" />
                                    Profile
                                </Link>
                                <Link
                                    to="/settings"
                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    <FaCog className="mr-2 text-gray-500" />
                                    Settings
                                </Link>
                                <Link
                                    to="/feed-back"
                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    <FaCommentAlt className="mr-2 text-green-500" />
                                    Send Feedback
                                </Link>
                                <Link
                                    to="/help"
                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    <FaQuestionCircle className="mr-2 text-purple-500" />
                                    Help
                                </Link>
                                <button
                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                                    onClick={handleLogout}
                                >
                                    <FaSignOutAlt className="mr-2 text-red-500" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
