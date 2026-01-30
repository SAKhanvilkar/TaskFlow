import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import connectDB from "./config/db";
import userRoutes from './routes/user.route';
import taskRoutes from './routes/task.route';

dotenv.config();
connectDB()

export const app = express()

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    if (req.body) {
        req.body = mongoSanitize.sanitize(req.body);
    }
    if (req.params) {
        req.params = mongoSanitize.sanitize(req.params);
    }
   
    next();
});



// Routes
app.use('/api/users', userRoutes); 
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server on ${PORT}`));

