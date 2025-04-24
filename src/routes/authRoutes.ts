import express from 'express';
import { loginUser, registerUser,getAllUsers } from '../controllers/authController';
import { User } from '../models/User';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);

router.get('/me', async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password');
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

export default router;
