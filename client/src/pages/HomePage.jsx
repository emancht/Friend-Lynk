import React from 'react';
import SocialNetworkImg from '../assets/image/SocialNetworkImg.avif'; // Replace with your actual image path
import Navbar from './Navbar'; // Adjust path as necessary

const HomePage = () => {
    return (
        <div className="h-screen w-full overflow-hidden bg-white">
            <Navbar />
            <div className="h-[85%] flex items-center justify-center">
                <img
                    src={SocialNetworkImg}
                    alt="Social Network"
                    className="w-[50%] object-cover"
                />
            </div>
            <div className="h-[10%] bg-gray-800 text-center">
                <p className="text-white py-4">
                    &copy; 2025 FriendLynk. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default HomePage;
