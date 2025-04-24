import express from 'express';
import { createBoard, getBoards , updateBoard , deleteBoard } from '../controllers/boardController';

const router = express.Router();

router.post('/', createBoard);
router.get('/', getBoards);
router.put('/:id', updateBoard);
router.delete('/:id', deleteBoard);



export default router;
