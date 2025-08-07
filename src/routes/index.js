import { Router } from 'express';

import authRoutes from './auth.route.js';
import clientRoutes from './client.route.js';
import projectRoute from './project.route.js';
import Authenticate from '../middlewares/auth.middleware.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/clients', Authenticate, clientRoutes);
router.use('/projects', Authenticate, projectRoute);

export default router;
