
import express from 'express';
import * as postController from '../app/controllers/postController.js';
import * as userController from '../app/controllers/userController.js';
import authenticate from '../app/middleware/authenticate.js';
const router = express.Router();


// User Registration
router.post('/register', userController.register);

// User Login
router.post('/login', userController.login);

// User Logout
router.get('/logout', authenticate, userController.logout);

// Get Authenticated User Profile
router.get('/profile', authenticate, userController.getProfile);

// Update Authenticated User Profile
router.put('/profile', authenticate, userController.updateProfile);

// Follow or Unfollow a User
router.post('/follow/:id', authenticate, userController.followUser);


// Get Followers of a User
router.get('/user/:id/followers', authenticate, userController.followers);

// Get Following of a User
router.get('/user/:id/following', authenticate, userController.following);

// Get All User List Controller
router.get('/users', authenticate, userController.allUser);


// Suggest Users to Follow
router.get('/suggest-users', authenticate, userController.suggestUsers);



// Bookmark and Unbookmark Post
router.post('/posts/:id/bookmark', authenticate, userController.bookmarkPost);

// Fetch Bookmarked Posts
router.get('/bookmarks', authenticate, userController.getBookmarkedPost);






// Create a Post
router.post('/posts', authenticate, postController.createPost);

// Fetch All Posts with Comments (Latest Post First)
router.get('/posts', authenticate, postController.getAllPost);


// Fetch Authenticated User's Posts with Comments Controller
router.get('/my-posts', authenticate, postController.myPost);

// Like or Unlike a Post
router.post('/posts/:id/like', authenticate, postController.postLike);

// Edit a Post
router.put('/posts/:id', authenticate, postController.updatePost);

// Delete a Post
router.delete('/posts/:id', authenticate, postController.deletePost);




// Add a Comment to a Post
router.post('/posts/:id/comments', authenticate, postController.addComment);

// Delete a Comment
router.delete('/comments/:id', authenticate, postController.deleteComment);



// Search User/Post Controller
router.get('/search', authenticate, postController.search);



export default router;