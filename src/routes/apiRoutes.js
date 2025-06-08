import express from 'express';
import authRouter from './v1/authRoutes.js';
import userRouter from './v1/userRoutes.js';

const router = express.Router();

router.use('/auth', authRouter);

router.use('/user', userRouter);

export default router;