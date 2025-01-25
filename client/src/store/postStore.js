import axios from 'axios';
import { create } from 'zustand';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL || 'https://friend-lynk.vercel.app/api';


const postStore = create((set, get) => ({
    posts: [],
    isLoading: false,
    error: null,

    // Fetch all posts
    fetchPosts: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/posts`, { withCredentials: true });
            set({ posts: response.data.posts });
        } catch (error) {
            set({ error: error.response?.data?.msg || 'Failed to fetch posts' });
        } finally {
            set({ isLoading: false });
        }
    },


    // Fetch Authenticated User's Posts with Comments Controller
    fetchUserPosts: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/my-posts`, { withCredentials: true });
            set({ posts: response.data.posts });
        } catch (error) {
            set({ error: error.response?.data?.msg || 'Failed to fetch posts' });
        } finally {
            set({ isLoading: false });
        }
    },


    // Search for users and posts
    search: async (query) => {
        if (!query) {
            set({ users: [], posts: [], error: 'Search query cannot be empty' });
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/search`, {
                params: { query },
                withCredentials: true,
            });
            const { users, posts } = response.data;
            set({ users, posts });
        } catch (error) {
            set({ error: error.response?.data?.msg || 'Search failed' });
        } finally {
            set({ isLoading: false });
        }
    },

    // Create a new post
    createPost: async (content, contentImage) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(
                `${API_URL}/posts`,
                { content, contentImage },
                { withCredentials: true }
            );

            // Add the newly created and populated post to the posts list
            set({ posts: [response.data.post, ...get().posts] });
            return response.data.msg;
        } catch (error) {
            set({ error: error.response?.data?.msg || 'Failed to create post' });
        } finally {
            set({ isLoading: false });
        }
    },

    // Like or Unlike a Post
    likePost: async (postId) => {
        set({ error: null });

        // Optimistic update
        const currentPosts = get().posts;
        const updatedPosts = currentPosts.map((post) =>
            post._id === postId
                ? {
                    ...post, likes: post.likes.includes('currentUserId')
                        ? post.likes.filter((id) => id !== 'currentUserId') // Unlike
                        : [...post.likes, 'currentUserId']
                } // Like
                : post
        );
        set({ posts: updatedPosts });

        try {
            await axios.post(`${API_URL}/posts/${postId}/like`, {}, { withCredentials: true });
        } catch (error) {
            set({ error: error.response?.data?.msg || 'Failed to like/unlike post' });

            // Revert the optimistic update if API fails
            set({ posts: currentPosts });
        }
    },

    // Edit a Post
    editPost: async (postId, updatedContent, updatedContentImage) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.put(
                `${API_URL}/posts/${postId}`,
                { content: updatedContent, contentImage: updatedContentImage },
                { withCredentials: true }
            );

            // Update the edited post in the store
            const updatedPosts = get().posts.map((post) =>
                post._id === postId ? response.data.post : post
            );
            set({ posts: updatedPosts });
            return response.data.msg;
        } catch (error) {
            set({ error: error.response?.data?.msg || 'Failed to edit post' });
        } finally {
            set({ isLoading: false });
        }
    },

    // Delete a Post
    deletePost: async (postId) => {
        set({ isLoading: true, error: null });
        try {
            await axios.delete(`${API_URL}/posts/${postId}`, { withCredentials: true });

            // Remove the deleted post from the store
            const updatedPosts = get().posts.filter((post) => post._id !== postId);
            set({ posts: updatedPosts });
            return 'Post deleted successfully';
        } catch (error) {
            set({ error: error.response?.data?.msg || 'Failed to delete post' });
        } finally {
            set({ isLoading: false });
        }
    },

    // Add a Comment
    addComment: async (postId, text) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(
                `${API_URL}/posts/${postId}/comments`,
                { text },
                { withCredentials: true }
            );

            // Update the post's comments with the new comment
            const updatedPosts = get().posts.map((post) =>
                post._id === postId
                    ? { ...post, comments: [...post.comments, response.data.comment] }
                    : post
            );
            set({ posts: updatedPosts });
            return response.data.msg;
        } catch (error) {
            set({ error: error.response?.data?.msg || 'Failed to add comment' });
        } finally {
            set({ isLoading: false });
        }
    },

    // Delete a Comment
    deleteComment: async (commentId, postId) => {
        set({ isLoading: true, error: null });
        try {
            await axios.delete(`${API_URL}/comments/${commentId}`, { withCredentials: true });

            // Remove the deleted comment from the post's comments
            const updatedPosts = get().posts.map((post) =>
                post._id === postId
                    ? { ...post, comments: post.comments.filter((comment) => comment._id !== commentId) }
                    : post
            );
            set({ posts: updatedPosts });
            return 'Comment deleted successfully';
        } catch (error) {
            set({ error: error.response?.data?.msg || 'Failed to delete comment' });
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default postStore;
