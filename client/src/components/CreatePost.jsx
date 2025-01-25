import React, { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import { toast } from 'react-hot-toast';
import { FaCamera } from 'react-icons/fa6';
import authStore from '../store/authStore.js';
import postStore from '../store/postStore.js';

const CreatePost = () => {
    const [content, setContent] = useState('');
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [modalImage, setModalImage] = useState('');
    const { createPost, isLoading, error } = postStore();
    const {
        user,
        fetchProfile,
        isLoading: userLoading,
        error: userError,
    } = authStore();

    useEffect(() => {
        (async () => {
            if (!user) {
                await fetchProfile();
            }
        })();
    }, [user, fetchProfile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const msg = await createPost(content, modalImage);
            if (msg) {
                toast.success(msg); // Success notification
                setContent('');
                setModalContent('');
                setModalImage('');
                setImageModalOpen(false); // Close modal after posting
            }
        } catch (err) {
            toast.error('Failed to create post'); // Error notification
        }
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        try {
            const msg = await createPost(modalContent, modalImage);
            if (msg) {
                toast.success(msg); // Success notification
                setModalContent('');
                setModalImage('');
                setImageModalOpen(false); // Close modal after posting
            }
        } catch (err) {
            toast.error('Failed to create post'); // Error notification
        }
    };

    return (
        <div className="w-full bg-white rounded-lg shadow p-4 mb-6 flex flex-col items-start mx-auto">
            <h2 className="text-xl font-semibold mx-auto mb-3 text-gray-500">
                Feeds
            </h2>
            <div className="flex items-center w-full mb-4">
                {userLoading ? (
                    <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse mr-3"></div>
                ) : (
                    <Avatar
                        src={user?.profileImage || ''}
                        name={user?.username || 'User'}
                        size="48"
                        round={true}
                        className="mr-3"
                    />
                )}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="flex-1 bg-transparent text-gray-800 border border-gray-300 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    rows="1"
                    required
                />
            </div>
            <div className="flex justify-between items-center mt-3 w-11/12 ms-auto">
                <button
                    className="flex items-center text-teal-600 font-semibold"
                    onClick={() => setImageModalOpen(true)}
                >
                    <FaCamera className="mr-1 text-xl text-red-400" />
                    Photo
                </button>

                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`bg-blue-500 text-white px-4 py-1.5 rounded-lg ${
                        isLoading ? 'opacity-50' : 'hover:bg-blue-600'
                    }`}
                >
                    {isLoading ? 'Posting...' : 'Post'}
                </button>
            </div>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            {userError && (
                <p className="text-red-500 text-center mt-4">{userError}</p>
            )}

            {/* Image Modal */}
            {imageModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 lg:w-5/12">
                        <h3 className="text-xl font-semibold mb-4">
                            Create a Post with Image
                        </h3>
                        <form onSubmit={handleModalSubmit}>
                            <textarea
                                value={modalContent}
                                onChange={(e) =>
                                    setModalContent(e.target.value)
                                }
                                placeholder="What's on your mind?"
                                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                                rows="2"
                                required
                            />
                            <input
                                type="text"
                                value={modalImage}
                                onChange={(e) => setModalImage(e.target.value)}
                                placeholder="Enter Image URL"
                                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                                required
                            />
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`px-4 py-2 rounded-md text-white ${
                                        isLoading
                                            ? 'bg-gray-500'
                                            : 'bg-teal-600 hover:bg-teal-700 mr-4'
                                    }`}
                                >
                                    {isLoading ? 'Posting...' : 'Post'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImageModalOpen(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-teal-700"
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

export default CreatePost;
