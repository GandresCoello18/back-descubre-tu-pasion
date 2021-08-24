import express from 'express';
import { auth } from '../../middlewares/auth';

import { getMe, login } from './controller';

const router = express.Router();
const baseURL = '/users';

router.get(`${baseURL}/me`, auth, getMe);
router.post(`${baseURL}/login`, login);

export default router;
