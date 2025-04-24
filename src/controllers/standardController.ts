import { Request, Response } from 'express';
import { Standard } from '../models/Standard';
import { Board } from '../models/Boards';

// Create Standard
export const createStandard = async (req: Request, res: Response) => {
  try {
    const { name, boardId } = req.body;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const standard = new Standard({ name, board });
    await standard.save();
    res.status(201).json(standard);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

// Get Standards by Board
export const getStandardsByBoard = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;

    const standards = await Standard.find({ board: boardId }).populate('board');
    res.json(standards);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

export const updateStandard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, boardId } = req.body;

    const standard = await Standard.findById(id);
    if (!standard) {
      return res.status(404).json({ message: 'Standard not found' });
    }

    // Update name and boardId
    if (name) standard.name = name;
    if (boardId) standard.board = boardId; // Directly set boardId

    // Save the updated standard
    await standard.save();
    res.json(standard);  // Return updated standard
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};



// Delete Standard
export const deleteStandard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const standard = await Standard.findByIdAndDelete(id);

    if (!standard) {
      return res.status(404).json({ message: 'Standard not found' });
    }

    res.json({ message: 'Standard deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

// GET: Fetch all standards with board populated (Admin purpose)
export const getAllStandardsWithBoard = async (req: Request, res: Response) => {
  try {
    const standards = await Standard.find().populate('board', 'name'); // Only board name
    res.json(standards);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};
