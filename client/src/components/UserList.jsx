import React, { useEffect, useState } from 'react';
import authStore from '../store/authStore.js';
import FollowButton from './FollowButton';

const UserList = () => {
    const { fetchAllUsers, users } = authStore();
    const [currentUserFollowing, setCurrentUserFollowing] = useState([]);

    useEffect(() => {
        // Fetch all users on mount
        (async () => {
            await fetchAllUsers();
        })();
    }, [fetchAllUsers]);

    return (
        <div>
            {users.map((user) => (
                <div key={user._id} style={{ marginBottom: '15px' }}>
                    <p>
                        {user.fullname} (@{user.username})
                    </p>
                    <FollowButton
                        userId={user._id}
                        isFollowing={currentUserFollowing.includes(user._id)}
                    />
                </div>
            ))}
        </div>
    );
};

export default UserList;
