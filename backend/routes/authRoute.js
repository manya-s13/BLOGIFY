import express from 'express';
import {checkAuth, signin, signout, signup} from '../controllers/authController.js'
import { isAuthenticated } from '../authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', signout);
router.get('/checkAuth', isAuthenticated, checkAuth);

export default router;