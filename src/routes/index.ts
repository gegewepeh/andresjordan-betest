import express from 'express';
const router = express.Router();
import userRouter from './user'
import adminRouter from './admin'

router.use('/users', userRouter)

router.use('/admin', adminRouter)

export default router;