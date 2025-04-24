// controllers/subjectController.ts

import { Request, Response } from 'express';
import { Subject } from '../models/Subject';
import { Standard } from '../models/Standard';

// Create Subject
export const createSubject = async (req: Request, res: Response) => {
  try {
    const { name, standardId, price } = req.body;

    const standard = await Standard.findById(standardId);
    if (!standard) {
      return res.status(404).json({ message: 'Standard not found' });
    }

    const subject = new Subject({ name, standard, price });
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

// Get all Subjects
export const getAllSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await Subject.find().populate({
      path: 'standard',
      populate: {
        path: 'board'
      }
    });

    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

// Get Subjects by Standard
export const getSubjectsByStandard = async (req: Request, res: Response) => {
  try {
    const { standardId } = req.params;

    const subjects = await Subject.find({ standard: standardId }).populate('standard');
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

// Update Subject
export const updateSubject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, standardId, price } = req.body;

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    if (standardId) {
      const standard = await Standard.findById(standardId);
      if (!standard) {
        return res.status(404).json({ message: 'Standard not found' });
      }
      subject.standard = standard._id;
    }
    

    if (name) subject.name = name;
    if (price !== undefined) subject.price = price;

    await subject.save();

    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

// Delete Subject
export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    await subject.deleteOne();

    res.json({ message: 'Subject deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};
