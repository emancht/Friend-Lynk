import React from 'react';
import Layout from "../layout/Layout.jsx";
import Feeds from "../components/Feeds.jsx";
import LeftSidebar from "../layout/LeftSidebar.jsx";
import RightSidebar from "../layout/RightSidebar.jsx";

const FeedsPage = () => {
    return (
        <Layout>
            <div className="w-full flex gap-2">
                <LeftSidebar/>
                <Feeds/>
                <RightSidebar/>
            </div>
        </Layout>
);
};

export default FeedsPage;