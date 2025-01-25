import React from 'react';
import FetchUserPosts from '../components/FetchUserPosts.jsx';
import Profile from '../components/Profile.jsx';
import Layout from '../layout/Layout.jsx';

const ProfilePage = () => {
    return (
        <Layout>
            <div className="lg:w-1/2 mx-auto px-4">
                <Profile />
                <FetchUserPosts />
            </div>
        </Layout>
    );
};

export default ProfilePage;
