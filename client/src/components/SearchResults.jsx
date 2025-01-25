import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import postStore from '../store/postStore';

const SearchResults = () => {
    const [searchQuery, setSearchQuery] = useState('');

    // Memoize selectors to avoid unnecessary re-renders
    const search = postStore((state) => state.search);
    const { users, posts } = postStore((state) => ({
        users: state.users,
        posts: state.posts,
    }));
    const isLoading = postStore((state) => state.isLoading);
    const error = postStore((state) => state.error);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            await search(searchQuery);
        }
    };

    return (
        <div className="p-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center w-full mb-4">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search for users or posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-200"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
                <button
                    type="submit"
                    className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    Search
                </button>
            </form>

            {/* Error Message */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Loading Spinner */}
            {isLoading && <p className="text-center text-gray-500">Searching...</p>}

            {/* Search Results */}
            <div>
                {/* User Results */}
                {users.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Users</h3>
                        {users.map((user) => (
                            <Link
                                key={user._id}
                                to={`/profile/${user.username}`}
                                className="flex items-center p-2 mb-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
                            >
                                <img
                                    src={user.profileImage || '/default-profile.png'}
                                    alt={user.username}
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <div>
                                    <p className="font-bold text-gray-800">{user.username}</p>
                                    <p className="text-sm text-gray-500">{user.fullname}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Post Results */}
                {posts.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Posts</h3>
                        {posts.map((post) => (
                            <Link
                                key={post._id}
                                to={`/post/${post._id}`}
                                className="block p-3 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
                            >
                                <p className="text-gray-800">{post.content}</p>
                                <span className="text-sm text-gray-500">
                                    by {post.userID?.username}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}

                {/* No Results Found */}
                {users.length === 0 && posts.length === 0 && !isLoading && searchQuery && (
                    <p className="text-center text-gray-500">No results found for "{searchQuery}"</p>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
