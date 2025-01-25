import React from 'react';
import SuggestUsers from '../components/SuggestedUsers.jsx';

const RightSidebar = () => {
    return (
        <>
            <aside
                className="hidden lg:block w-1/4 p-4 h-full"
                aria-label="Sidebar"
            >
                {/* Suggestions Section */}
                    <SuggestUsers />

            </aside>
        </>
    );
};

export default RightSidebar;
