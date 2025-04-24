import express from 'express';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/private', protect, (req, res) => {
  res.json({ message: 'This is a protected route!', user: req.user });
});

export default router;
