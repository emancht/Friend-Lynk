import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AiFillHeart, AiOutlineComment, AiOutlineHeart } from 'react-icons/ai';
import { FaRegBookmark } from 'react-icons/fa';
import { FiMoreHorizontal } from 'react-icons/fi';
import postStore from '../store/postStore.js';

const FetchUserPosts = () => {
    const {
        posts,
        fetchUserPosts,
        isLoading,
        error,
        likePost,
        editPost,
        deletePost,
        addComment,
    } = postStore();

    const [showMenu, setShowMenu] = useState(null); // Track which post menu is open
    const [isEditing, setIsEditing] = useState(null); // Track which post is being edited
    const [editContent, setEditContent] = useState('');
    const [editImage, setEditImage] = useState('');
    const [showCommentModal, setShowCommentModal] = useState(false); // Modal state
    const [activePostId, setActivePostId] = useState(null); // Track active post for comments
    const [newComment, setNewComment] = useState(''); // New comment text

    useEffect(() => {
        (async () => {
            await fetchUserPosts();
        })();
    }, [fetchUserPosts]);

    const handleLikePost = (postId) => {
        likePost(postId);
    };

    const handleMenuToggle = (postId) => {
        setShowMenu((prev) => (prev === postId ? null : postId));
    };

    const handleEditPost = (e, post) => {
        e.preventDefault();
        setIsEditing(post._id);
        setEditContent(post.content);
        setEditImage(post.contentImage);
    };

    const handleSaveEdit = async (e, postId) => {
        e.preventDefault();

        try {
            const response = await editPost(postId, editContent, editImage);

            if (response?.success) {
                const updatedPost = response.post;
                const updatedPosts = posts.map((post) =>
                    post._id === postId ? updatedPost : post
                );
                postStore.setState({ posts: updatedPosts });
            }

            setIsEditing(null);
        } catch (error) {
            console.error('Failed to save edit:', error);
        }
    };

    const handleDeletePost = async (e, postId) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to delete this post?')) {
            await deletePost(postId);
            const updatedPosts = posts.filter((post) => post._id !== postId);
            postStore.setState({ posts: updatedPosts });
        }
    };

    const handleOpenCommentModal = (postId) => {
        setActivePostId(postId);
        setShowCommentModal(true);
    };

    const handleCloseCommentModal = () => {
        setShowCommentModal(false);
        setActivePostId(null);
        setNewComment('');
    };

    const handleAddComment = async () => {
        if (!newComment) return;

        try {
            const msg = await addComment(activePostId, newComment);
            toast.success(msg);

            setNewComment('');
            handleCloseCommentModal();
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    if (isLoading) return <p>Loading posts...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="post-list w-full mx-auto mt-8 space-y-6">
            {/*Posts*/}
            {posts.length === 0 ? (
                <p className="text-center text-gray-500">No posts available.</p>
            ) : (
                posts.map((post) => (
                    <div
                        key={post._id}
                        className="post bg-white p-4 shadow-md rounded-md relative"
                    >
                        {/* Post Header */}
                        <div className="post-header flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={
                                        post.userID.profileImage ||
                                        'https://via.placeholder.com/40'
                                    }
                                    alt="User"
                                    className="w-10 h-10 rounded-full"
                                />
                                <strong className="text-gray-800 text-lg">
                                    @{post.userID.username}
                                </strong>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => handleMenuToggle(post._id)}
                                >
                                    <FiMoreHorizontal className="text-gray-600 w-6 h-6" />
                                </button>
                                {showMenu === post._id && (
                                    <div className="absolute right-0 bg-white shadow-md rounded-md z-10 p-2">
                                        {/* Edit Post Modal */}
                                        {isEditing === post._id ? (
                                            <div className="modal fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
                                                <div className="modal-content bg-white p-6 rounded-lg w-1/2">
                                                    <h3 className="text-xl font-semibold mb-4">
                                                        Edit Post
                                                    </h3>
                                                    <textarea
                                                        value={editContent}
                                                        onChange={(e) =>
                                                            setEditContent(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Edit your post..."
                                                        className="w-full p-2 border rounded-md mb-4"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editImage}
                                                        onChange={(e) =>
                                                            setEditImage(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full p-2 border rounded-md mb-4"
                                                        placeholder="Image URL..."
                                                    />
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={(e) =>
                                                                handleSaveEdit(
                                                                    e,
                                                                    post._id
                                                                )
                                                            }
                                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setIsEditing(
                                                                    null
                                                                )
                                                            }
                                                            className="bg-gray-500 text-white px-4 py-2 rounded"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={(e) =>
                                                    handleEditPost(e, post)
                                                }
                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                            >
                                                Edit
                                            </button>
                                        )}

                                        <button
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            onClick={(e) =>
                                                handleDeletePost(e, post._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Post Content */}
                        <div className="post-body mt-4">
                            <p className="text-gray-700">{post.content}</p>
                            {post.contentImage && (
                                <img
                                    src={post.contentImage}
                                    alt="Post Content"
                                    className="mt-4 w-full rounded-md"
                                />
                            )}
                        </div>

                        {/* Post Footer */}
                        <div className="post-footer mt-4 flex justify-between items-center text-gray-600">
                            <div
                                className="flex items-center space-x-1 cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLikePost(post._id);
                                }}
                            >
                                {post.likes.includes('currentUserId') ? (
                                    <AiFillHeart className="text-red-500 w-6 h-6" />
                                ) : (
                                    <AiOutlineHeart className="w-6 h-6" />
                                )}
                                <span>{post.likes.length}</span>
                            </div>

                            <div
                                className="flex items-center space-x-1 cursor-pointer"
                                onClick={() => handleOpenCommentModal(post._id)}
                            >
                                <AiOutlineComment className="w-6 h-6" />
                                <span>{post.comments.length}</span>
                            </div>

                            <div className="cursor-pointer">
                                <FaRegBookmark className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                ))
            )}

            {/* Comment Modal */}
            {showCommentModal && (
                <div className="modal fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
                    <div className="modal-content bg-white p-6 rounded-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]">
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            Comments
                        </h3>

                        {/* Comments List */}
                        <div className="comments-list space-y-4 max-h-64 overflow-y-auto">
                            {posts
                                .find((post) => post._id === activePostId)
                                ?.comments.map((comment) => (
                                    <div
                                        key={comment._id}
                                        className="comment p-3 rounded-md flex items-start space-x-3"
                                    >
                                        <div className="flex-shrink-0">
                                            <strong className="text-gray-800">
                                                @{comment.userID.username}
                                            </strong>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-700 break-words">
                                                {comment.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {/* Add New Comment */}
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full p-3 border border-gray-300 rounded-md mt-4 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                            rows="3"
                        />
                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                onClick={handleAddComment}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                            >
                                Post Comment
                            </button>
                            <button
                                onClick={handleCloseCommentModal}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FetchUserPosts;
