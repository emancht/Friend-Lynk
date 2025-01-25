import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { create } from 'zustand';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL || 'https://friend-lynk.vercel.app/api';
console.log('API_URL:', API_URL);

const authStore = create((set) => ({

    user: null,
    error: null,
    isLoading: false,
    users: [],
    followers: [],
    following: [],
    suggestedUsers: [],
    bookmarks: [],

    isLogin: () => {
        return !!Cookies.get('Authorization');
    },
    // isLoggedIn: () => !!get().user,

    register: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/register`, data);
            toast.success(response.data.msg); // Success notification
        } catch (error) {
            const errorMsg = error.response?.data?.msg || 'Registration failed';
            set({ error: errorMsg });
            toast.error(errorMsg); // Error notification
        } finally {
            set({ isLoading: false });
        }
    },

    login: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/login`, data, {
                withCredentials: true,
            });
            set({ user: response.data.user }); // Update the user state
            toast.success(response.data.msg); // Notify on success
        } catch (error) {
            const errorMsg = error.response?.data?.msg || 'Login failed';
            set({ error: errorMsg });
            toast.error(errorMsg); // Notify on error
        } finally {
            set({ isLoading: false });
        }
    },

    fetchProfile: async () => {
        try {
            const response = await axios.get(`${API_URL}/profile`, { withCredentials: true });
            set({ user: response.data.user });

        } catch (error) {
            set({ error: error }); // Use error.message
            toast.error('Failed to fetch profile');
        }
    },


    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.get(`${API_URL}/logout`, { withCredentials: true });
            set({ user: null, isLoading: false, error: null });
            toast.success('Logged out successfully');
        } catch (error) {
            set({ error: error.response?.data?.msg || 'Logout failed' });

        } finally {
            set({ isLoading: false });
        }
    },

    updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.put(`${API_URL}/profile`, data, { withCredentials: true });
            set({ user: response.data.user });
            toast.success(response.data.msg);
        } catch (error) {
            set({ error: error.response?.data?.msg || 'Profile update failed' });

        } finally {
            set({ isLoading: false });
        }
    },

    fetchAllUsers: async (page = 1, limit = 10) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/users`, {
                params: { page, limit },
                withCredentials: true,
            });
            set({ users: response.data.users });
        } catch (error) {
            set({ error: error.response?.data?.msg || 'Failed to fetch users' });
        } finally {
            set({ isLoading: false });
        }
    },

    // Toggle follow/unfollow user
    toggleFollowUser: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/follow/${userId}`, {}, { withCredentials: true });
            toast.success(response.data.msg); // Notify dynamically
            // Refetch the suggested users to ensure we have the latest data
            await set({ suggestedUsers: await fetchSuggestedUsers() });
        } catch (error) {
            return error.response?.data?.msg || 'Failed to toggle follow';
            // set({ error: errorMsg });
            // toast.error(errorMsg); // Error notification
        } finally {
            set({ isLoading: false });
        }
    },

    fetchFollowers: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/user/${userId}/followers`, { withCredentials: true });
            set({ followers: response.data.followers });
        } catch (error) {
            set({ error: error.response?.data?.msg || 'Failed to fetch followers' });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchFollowing: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/user/${userId}/following`, { withCredentials: true });
            set({ following: response.data.following });
        } catch (error) {
            set({ error: error.response?.data?.msg || 'Failed to fetch following' });
        } finally {
            set({ isLoading: false });
        }
    },

    // Fetch suggested users to follow
    fetchSuggestedUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/suggest-users`, { withCredentials: true });
            set({ suggestedUsers: response.data.suggestedUsers });
        } catch (error) {
            set({ error: error.response?.data?.msg || 'Failed to fetch suggested users' });
        } finally {
            set({ isLoading: false });
        }
    },


    // Toggle Bookmark
    toggleBookmark: async (postId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/posts/${postId}/bookmark`, {}, { withCredentials: true });
            set((state) => ({
                bookmarks: response.data.bookmarks,
                user: { ...state.user, bookmarks: response.data.bookmarks },
            }));
            toast.success(response.data.msg); // Notify dynamically
        } catch (error) {
            const errorMsg = error.response?.data?.msg || 'Failed to toggle bookmark';
            set({ error: errorMsg });
            toast.error(errorMsg); // Notify on error
        } finally {
            set({ isLoading: false });
        }
    },

    // Fetch Bookmarked Posts
    fetchBookmarkedPosts: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/bookmarks`, { withCredentials: true });
            set({ bookmarks: response.data.bookmarks });
        } catch (error) {
            const errorMsg = error.response?.data?.msg || 'Failed to fetch bookmarks';
            set({ error: errorMsg });
            toast.error(errorMsg); // Notify on error
        } finally {
            set({ isLoading: false });
        }
    },

}));

export default authStore;
