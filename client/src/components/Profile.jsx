import React, { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import { FaEdit } from 'react-icons/fa';
import authStore from '../store/authStore';

const Profile = () => {
    const { user, fetchProfile, updateProfile, isLoading, error } = authStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        bio: '',
        profileImage: '',
        coverImage: '',
    });

    useEffect(() => {
        (async () => {
            await fetchProfile();
        })();
    }, [fetchProfile]);

    useEffect(() => {
        if (user) {
            setFormData({
                fullname: user.fullname || '',
                username: user.username || '',
                bio: user.bio || '',
                profileImage: user.profileImage || '',
                coverImage: user.coverImage || '',
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await updateProfile(formData);
        setIsModalOpen(false);
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            {user ? (
                <div className="w-full mx-auto px-4 mt-2 p-6 bg-white shadow-md rounded-md">
                    <h2 className="text-xl font-semibold text-center text-gray-600">
                        Profile
                    </h2>
                    <div className="mt-4 relative">
                        <div className="h-52 overflow-hidden mb-12">
                            <img
                                src={user.coverImage}
                                className="w-full"
                                alt="Cover Image"
                            />
                        </div>
                        <Avatar
                            size="100"
                            round={true}
                            src={user.profileImage}
                            className="absolute top-20"
                            alt=""
                        />
                        <div className="flex flex-col w-full gap-1">
                            <div className="ms-auto">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center justify-end bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
                                >
                                    <FaEdit />
                                    <span>Edit Profile</span>
                                </button>
                            </div>
                            <p className="text-2xl font-bold">
                                {user.fullname}
                            </p>
                            <p className="text-gray-600">@{user.username}</p>
                            <p>
                                <strong>Bio:</strong> {user.bio}
                            </p>
                            <span>
                                <strong>Followers:</strong>{' '}
                                {user.followers.length}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <p>No user data available.</p>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">
                            Edit Profile
                        </h3>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullname"
                                    value={formData.fullname}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">
                                    Bio
                                </label>
                                <input
                                    type="text"
                                    zz
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">
                                    Profile Image URL
                                </label>
                                <input
                                    type="text"
                                    name="profileImage"
                                    value={formData.profileImage}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">
                                    Cover Image URL
                                </label>
                                <input
                                    type="text"
                                    name="coverImage"
                                    value={formData.coverImage}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
