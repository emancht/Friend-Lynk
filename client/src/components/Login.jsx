import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginImg from '../assets/image/HomeImg.jpg';
import Navbar from '../pages/Navbar';
import authStore from '../store/authStore';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const { login, error, isLoading, fetchProfile, user } = authStore();
    const navigate = useNavigate();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleCheckboxChange = (e) =>
        setFormData({ ...formData, rememberMe: e.target.checked });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData);
        await fetchProfile();
    };

    // Redirect to the profile page if the user is logged in
    useEffect(() => {
        if (user) {
            navigate('/profile');
        }
    }, [user, navigate]);

    return (
        <div className="h-screen flex flex-col gap-8">
            <Navbar />
            <div className="h-full flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-5xl flex items-center justify-center space-x-8 bg-white rounded-lg shadow-md">
                    <div className="hidden md:block w-1/2">
                        <img
                            src={LoginImg}
                            alt="SwiftTalk"
                            className="w-full h-full object-cover rounded-l-lg"
                        />
                    </div>
                    <div className="w-full md:w-1/2 p-8 space-y-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-teal-700">
                                Welcome to FriendLynk
                            </h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Please login to your account
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Email address"
                                    required
                                    className="w-full px-4 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    required
                                    className="w-full px-4 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleCheckboxChange}
                                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                                        Remember Me
                                    </span>
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-teal-600 hover:underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition duration-200"
                                >
                                    {isLoading ? 'Logging in...' : 'Login'}
                                </button>
                            </div>
                            {error && (
                                <p className="text-red-500 mt-2">{error}</p>
                            )}
                        </form>
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link
                                    to="/register"
                                    className="text-teal-600 font-semibold hover:underline"
                                >
                                    Register
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
