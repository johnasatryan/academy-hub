import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import syllabusRoutes from './routes/syllabuses.js';

dotenv.config();
const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());

app.use('/api/syllabuses', syllabusRoutes);

app.get('/', (req, res) => res.send('API is running ✅'));

export default app;
