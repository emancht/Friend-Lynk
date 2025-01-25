import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';

export const register = async (req, res) => {
    const { username, fullname, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ success: false, msg: 'Username already taken' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ username, fullname, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ success: true, msg: 'User created' });
    } catch (err) {
        res.status(500).json({ success: false, msg: `Error creating user: ${err.message}` });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, msg: 'User not found' });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ success: false, msg: 'Invalid password' });

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('Authorization', token, { httpOnly: false }).json({ success: true, msg: "Login success!" });
    } catch (err) {
        res.status(500).json({ success: false, msg: `Error during login: ${err.message}` });
    }
};

export const logout = (req, res) => {
    res.clearCookie('Authorization', { httpOnly: false, secure: true, sameSite: 'strict' });
    res.status(200).json({ success: true, msg: 'Logged out successfully' });
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ success: false, msg: 'User not found' });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Error fetching profile', error: err.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { username, fullname, email, bio, profileImage, coverImage } = req.body;

        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ success: false, msg: 'User not found' });

        // Update fields only if provided
        user.username = username || user.username;
        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.profileImage = profileImage || user.profileImage;
        user.coverImage = coverImage || user.coverImage;

        await user.save();
        res.json({ success: true, msg: 'Profile updated successfully', user });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Error updating profile', error: err.message });
    }
};

export const followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        if (!userToFollow) return res.status(404).json({ success: false, msg: 'User not found' });

        const currentUser = await User.findById(req.user._id);
        if (!currentUser) return res.status(404).json({ success: false, msg: 'Authenticated user not found' });

        if (userToFollow._id.equals(currentUser._id)) {
            return res.status(400).json({ success: false, msg: "You can't follow yourself" });
        }

        const isFollowing = currentUser.following.includes(userToFollow._id);

        if (isFollowing) {
            // Unfollow
            currentUser.following = currentUser.following.filter(f => !f.equals(userToFollow._id));
            userToFollow.followers = userToFollow.followers.filter(f => !f.equals(currentUser._id));
        } else {
            // Follow
            currentUser.following.push(userToFollow._id);
            userToFollow.followers.push(currentUser._id);
        }

        // Save only if changes occurred
        await Promise.all([currentUser.save(), userToFollow.save()]);

        res.json({ success: true, msg: isFollowing ? 'Unfollowed user' : 'Followed user' });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Error following/unfollowing user', error: err.message });
    }
};

export const followers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('followers', 'username fullname profileImage');
        if (!user) return res.status(404).json({ success: false, msg: 'User not found' });

        res.json({ success: true, followers: user.followers });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Error fetching followers', error: err.message });
    }
};

export const following = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('following', 'username fullname profileImage');
        if (!user) return res.status(404).json({ success: false, msg: 'User not found' });

        res.json({ success: true, following: user.following });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Error fetching following users', error: err.message });
    }
};

export const allUser = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Pagination params
        const users = await User.find()
            .select('username fullname profileImage')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Error fetching users', error: err.message });
    }
}

export const suggestUsers = async (req, res) => {
    try {
        // Fetch the authenticated user
        const currentUserId = req.user._id;

        // Find all users excluding the logged-in user
        const suggestedUsers = await User.find({
            _id: { $ne: currentUserId }, // Exclude the authenticated user
        })
            .select('username fullname profileImage followers') // Select specific fields
            .sort({ followers: -1 }) // Optionally sort by number of followers
            .limit(10); // Limit the suggestions to 10 users

        res.json({ success: true, suggestedUsers });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Error fetching suggested users', error: err.message });
    }
}

export const bookmarkPost = async (req, res) => {
    try {
        const postID = req.params.id;

        // Check if the post exists
        const post = await Post.findById(postID);
        if (!post) return res.status(404).json({ success: false, msg: 'Post not found' });

        // Find the authenticated user
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, msg: 'User not found' });

        // Check if the post is already bookmarked
        const isBookmarked = user.bookmarks.includes(postID);

        if (isBookmarked) {
            // Remove the bookmark
            user.bookmarks = user.bookmarks.filter(bookmark => !bookmark.equals(postID));
        } else {
            // Add the bookmark
            user.bookmarks.push(postID);
        }

        await user.save();

        res.json({
            success: true,
            msg: isBookmarked ? 'Post removed from bookmarks' : 'Post bookmarked',
            bookmarks: user.bookmarks
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Error toggling bookmark', error: err.message });
    }
}



export const getBookmarkedPost = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('bookmarks', 'content contentImage userID');
        if (!user) return res.status(404).json({ success: false, msg: 'User not found' });

        res.json({ success: true, bookmarks: user.bookmarks });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Error fetching bookmarks', error: err.message });
    }
}








