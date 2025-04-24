import { Request, Response } from 'express';
import { Board } from '../models/Boards';

export const createBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const existing = await Board.findOne({ name });
    if (existing) {
      res.status(400).json({ message: 'Board already exists' });
      return;
    }

    const board = new Board({ name });
    await board.save();
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

export const getBoards = async (req: Request, res: Response): Promise<void> => {
  try {
    const boards = await Board.find();
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

export const updateBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const board = await Board.findByIdAndUpdate(id, { name }, { new: true });

    if (!board) {
      res.status(404).json({ message: 'Board not found' });
      return;
    }

    res.json(board);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

export const deleteBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const board = await Board.findByIdAndDelete(id);

    if (!board) {
      res.status(404).json({ message: 'Board not found' });
      return;
    }

    res.json({ message: 'Board deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};
