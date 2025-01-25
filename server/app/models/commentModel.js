import mongoose from 'mongoose';


const CommentSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
}, { timestamps: true, versionKey: false });


const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;