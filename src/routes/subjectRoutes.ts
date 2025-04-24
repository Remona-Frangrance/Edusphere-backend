import express from 'express';
import { createSubject, getAllSubjects, getSubjectsByStandard, updateSubject, deleteSubject } from '../controllers/subjectController';

const router = express.Router();

router.get('/', getAllSubjects);
router.post('/', createSubject);
router.get('/:standardId', getSubjectsByStandard);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

export default router;
