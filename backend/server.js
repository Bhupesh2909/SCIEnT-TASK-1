import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRoutes from './routes/user.js';
import projectRoutes from './routes/project.js';
import applicationRoutes from './routes/application.js';
import authRoutes from './routes/auth.js';

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;


const corsOptions = {
  origin: 'http://localhost:5173', 
};


app.use(cors(corsOptions));

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});

