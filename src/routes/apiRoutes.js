import express from 'express';
import authRouter from './v1/authRoutes.js';
import userRouter from './v1/userRoutes.js';
import jobRouter from './v1/jobRoutes.js';

const router = express.Router();

router.use('/auth', authRouter);

router.use('/user', userRouter);

router.use('/job', jobRouter);

export default router;