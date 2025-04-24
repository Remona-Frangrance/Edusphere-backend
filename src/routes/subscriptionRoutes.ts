import express from 'express';
import { subscribeUser } from '../controllers/subscriptionController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protect, subscribeUser);

export default router;
