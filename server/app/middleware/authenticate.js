import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authenticate = (req, res, next) => {
    const token = req.cookies.Authorization || req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, msg: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, msg: 'Token Expired' });
        }
        res.status(400).json({ success: false, msg: 'Invalid Token' });
    }
};

export default authenticate;
