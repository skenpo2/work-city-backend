import express from 'express';
import {
  loginUserController,
  signUpController,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/sign-up', signUpController);
router.post('/login', loginUserController);

export default router;
