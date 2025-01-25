import React from 'react';
import {
    FaBell,
    FaBookmark,
    FaEnvelope,
    FaGlobe,
    FaHome,
    FaUsers,
} from 'react-icons/fa';
import { MdRssFeed } from 'react-icons/md';
import { Link } from 'react-router-dom';

const LeftSidebar = () => {
    return (
        <>
            <aside className="hidden lg:block w-1/4 bg-white rounded-lg shadow py-2 h-[calc(100vh-60px)] sticky top-[60px]">
                <ul className="space-y-1 text-lg">
                    <li>
                        <Link
                            to="/feeds"
                            className="flex items-center text-gray-700 px-4 py-3 hover:bg-gray-100 hover:text-teal-600"
                        >
                            <FaHome className="mr-1  text-xl text-green-600" />{' '}
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/feeds"
                            className="flex items-center text-gray-600 px-4 py-3 hover:bg-gray-100 hover:text-teal-600"
                        >
                            <FaGlobe className="mr-2  text-xl text-blue-600" />{' '}
                            Explore
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/feeds"
                            className="flex items-center text-gray-600 px-4 py-3 hover:bg-gray-100 hover:text-teal-600"
                        >
                            <FaUsers className="mr-2  text-xl text-pink-600" />{' '}
                            Follower
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/feeds"
                            className="flex items-center text-gray-600 px-4 py-3 hover:bg-gray-100 hover:text-teal-600"
                        >
                            <MdRssFeed className="mr-2  text-xl text-indigo-600" />{' '}
                            Feeds
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/feeds"
                            className="flex items-center text-gray-600 px-4 py-3 hover:bg-gray-100 hover:text-teal-600"
                        >
                            <FaBell className="mr-2  text-xl text-gray-600" />{' '}
                            Notifications
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/feeds"
                            className="flex items-center text-gray-600 px-4 py-3 hover:bg-gray-100 hover:text-teal-600"
                        >
                            <FaEnvelope className="mr-2  text-xl text-orange-600" />{' '}
                            Messages
                        </Link>
                    </li>

                    <li>
                        <a
                            href="#"
                            className="flex items-center text-gray-600 px-4 py-3 hover:bg-gray-100 hover:text-teal-600"
                        >
                            <FaBookmark className="mr-2  text-xl text-violet-600" />{' '}
                            Bookmark
                        </a>
                    </li>
                </ul>
            </aside>
        </>
    );
};

export default LeftSidebar;
