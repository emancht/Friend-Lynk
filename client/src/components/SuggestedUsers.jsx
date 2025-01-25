import React, { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import authStore from '../store/authStore';

const SuggestUsers = () => {
    const {
        suggestedUsers,
        fetchSuggestedUsers,
        toggleFollowUser,
        isLoading,
        error: globalError,
        user,
    } = authStore();

    const [localError, setLocalError] = useState(null); // For follow/unfollow errors
    const [isProcessing, setIsProcessing] = useState(false); // To prevent multiple clicks

    const currentUserId = user?._id;

    useEffect(() => {
        (async () => {
            await fetchSuggestedUsers();
        })();
    }, [fetchSuggestedUsers]);

    const handleFollowToggle = async (userId) => {
        if (isProcessing) return; // Prevent spamming the button
        setIsProcessing(true);

        try {
            // Call backend to toggle follow/unfollow
            await toggleFollowUser(userId);

            // Refetch updated data to ensure consistency
            await fetchSuggestedUsers();

            // Clear any previous error
            setLocalError(null);
        } catch (error) {
            // Set error only if the operation fails
            setLocalError('Failed to toggle follow. Please try again.');
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-xl font-semibold mb-4">
                Suggested Users to Follow
            </h2>

            {isLoading ? (
                <div>Loading...</div>
            ) : globalError ? (
                <div className="text-red-500">No users suggested found</div>
            ) : (
                <>
                    {localError && (
                        <div className="text-red-500 mb-4">{localError}</div>
                    )}
                    <ul>
                        {suggestedUsers.map((user) => (
                            <li
                                key={user._id}
                                className="flex items-center justify-between p-4 border-b"
                            >
                                <div className="flex items-center space-x-4">
                                    <Avatar
                                        src={
                                            user.profileImage ||
                                            'https://via.placeholder.com/50'
                                        }
                                        alt={user.username}
                                        size="40"
                                        round={true}
                                    />
                                    <div>
                                        <p className="font-semibold">
                                            {user.username}
                                        </p>
                                        <p className="text-gray-500">
                                            {user.fullname}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleFollowToggle(user._id)}
                                    className={`px-3 py-1 text-sm ${
                                        user.followers.includes(currentUserId)
                                            ? 'bg-red-500'
                                            : 'bg-blue-500'
                                    } text-white rounded-md ${
                                        isProcessing ? 'opacity-50' : ''
                                    }`}
                                    disabled={isProcessing}
                                >
                                    {user.followers.includes(currentUserId)
                                        ? 'Unfollow'
                                        : 'Follow'}
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default SuggestUsers;
