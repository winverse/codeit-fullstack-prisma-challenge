import express from 'express';
import { authRouter } from './auth.js';
// 다른 라우터들도 필요에 따라 import 할 수 있습니다.

const router = express.Router();

router.use('/auth', authRouter);

export { router as indexRouter };