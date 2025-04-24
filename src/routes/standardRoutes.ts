import express from 'express';
import {
  createStandard,
  getStandardsByBoard,
  updateStandard,
  deleteStandard,
} from '../controllers/standardController';
import { getAllStandardsWithBoard } from '../controllers/standardController';

const router = express.Router();

router.post('/', createStandard);
router.get('/:boardId', getStandardsByBoard);

router.get('/admin/all', getAllStandardsWithBoard);
router.put('/:id', updateStandard);

router.delete('/:id', deleteStandard);

export default router;
