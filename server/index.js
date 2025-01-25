import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import routes from './routes/api.js';

dotenv.config();

if (!process.env.CLIENT_URL || !process.env.MONGO_URI || !process.env.PORT) {
    console.error('Missing required environment variables');
    process.exit(1);
}

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// MongoDB connection with retry logic
const connectWithRetry = () => {
    mongoose.connect(process.env.MONGO_URI, { autoIndex: true })
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => {
            console.error('Error connecting to MongoDB:', err);
            setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
        });
};
connectWithRetry();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await mongoose.connection.close();
    process.exit(0);
});

// Routes
app.use('/api', routes);

// Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
