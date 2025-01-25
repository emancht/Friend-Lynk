import React from 'react';
import CreatePost from "./CreatePost.jsx";
import PostList from "./PostList.jsx";

const Feeds = () => {
    return (
        <div className="lg:w-1/2 mx-auto px-4">
            <CreatePost/>
            <PostList />
        </div>
    );
};

export default Feeds;