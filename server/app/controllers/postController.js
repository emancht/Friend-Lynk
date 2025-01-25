import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import Comment from '../models/commentModel.js';

export const createPost =  async (req, res) => {
    try {
        const { content, contentImage } = req.body;
        if (!content) return res.status(400).json({ success: false, msg: 'Content is required' });

        const post = new Post({
            userID: req.user._id,
            content,
            contentImage,
        });

        await post.save();

        // Populate the userID field before sending the response
        const populatedPost = await Post.findById(post._id).populate('userID', 'username fullname profileImage');

        res.status(201).json({ success: true, msg: 'Post created', post: populatedPost });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Error creating post', error: err.message });
    }
}

export const getAllPost =  async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 }) // Sort by creation date, descending
            .populate('userID', 'username fullname profileImage')
            .populate({
                path: 'comments',
                populate: { path: 'userID', select: 'username fullname profileImage' }
            });

        res.json({ success: true, posts });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Error fetching posts', error: err.message });
    }
};

export const myPost =  async (req, res) => {
    try {

        const posts = await Post.find({ userID: req.user._id })
            .sort({ createdAt: -1 }) // Sort by creation date, descending
            .populate('userID', 'username fullname profileImage')
            .populate({
                path: 'comments',
                populate: { path: 'userID', select: 'username fullname profileImage' },
            })

        res.json({ success: true, posts });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Error fetching user posts', error: err.message });
    }
};

export const postLike =  async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, msg: 'Post not found' });

        const hasLiked = post.likes.includes(req.user._id);

        if (hasLiked) {
            post.likes = post.likes.filter(userID => !userID.equals(req.user._id));
        } else {
            post.likes.push(req.user._id);
        }

        await post.save();
        res.json({ success: true, msg: hasLiked ? 'Post unliked' : 'Post liked', likes: post.likes.length });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Error liking/unliking post', error: err.message });
    }
};

export const updatePost =  async (req, res) => {
    try {
        const { content, contentImage } = req.body;

        // Find the post by ID
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, msg: 'Post not found' });

        // Check if the authenticated user is the owner of the post
        if (!post.userID.equals(req.user._id)) {
            return res.status(403).json({ success: false, msg: 'You can only edit your own posts' });
        }

        // Update fields if provided
        if (content) post.content = content;
        if (contentImage) post.contentImage = contentImage;

        // Save the updated post
        await post.save();

        // Populate the userID field
        const populatedPost = await Post.findById(post._id).populate('userID', 'username profileImage');

        res.json({ success: true, msg: 'Post updated successfully', post: populatedPost });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Error updating post', error: err.message });
    }
};

export const deletePost =   async (req, res) => {
    try {
        // Find the post by ID
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, msg: 'Post not found' });

        // Check if the authenticated user is the owner of the post
        if (!post.userID.equals(req.user._id)) {
            return res.status(403).json({ success: false, msg: 'You can only delete your own posts' });
        }

        // Remove associated comments
        await Comment.deleteMany({ post: post._id });

        // Delete the post
        await Post.deleteOne({ _id: post._id });

        res.json({ success: true, msg: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Error deleting post', error: err.message });
    }
}

export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ success: false, msg: 'Comment text is required' });

        // Find the post by ID
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, msg: 'Post not found' });

        // Create a new comment
        const comment = new Comment({
            userID: req.user._id,
            text,
            post: post._id,
        });

        // Save the comment
        await comment.save();

        // Add the comment to the post
        post.comments.push(comment._id);
        await post.save();

        // Populate the userID field of the comment
        const populatedComment = await Comment.findById(comment._id).populate('userID', 'username profileImage _id');

        // Send the response
        res.status(201).json({ success: true, msg: 'Comment added', comment: populatedComment });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Error adding comment', error: err.message });
    }
};

export const deleteComment =  async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ success: false, msg: 'Comment not found' });

        if (!comment.userID.equals(req.user._id)) {
            return res.status(403).json({ success: false, msg: 'You can only delete your own comments' });
        }

        await Comment.findByIdAndDelete(req.params.id);

        const post = await Post.findById(comment.post);
        post.comments = post.comments.filter(c => !c.equals(comment._id));
        await post.save();

        res.json({ success: true, msg: 'Comment deleted' });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Error deleting comment', error: err.message });
    }
};


export const search =  async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ success: false, msg: 'Search query is required' });

        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { fullname: { $regex: query, $options: 'i' } },
            ],
        }).select('username fullname profileImage');

        const posts = await Post.find({
            content: { $regex: query, $options: 'i' },
        }).populate('userID', 'username fullname profileImage');

        res.json({ success: true, users, posts });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Error searching', error: err.message });
    }
}




















































