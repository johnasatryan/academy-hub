import express from 'express';
import {
  getAllSyllabuses,
  getSyllabusById,
  createSyllabus,
  updateSyllabus,
  deleteSyllabus,
} from '../controllers/syllabus.js';

const router = express.Router();

router.get('/', getAllSyllabuses);
router.get('/:id', getSyllabusById);
router.post('/', createSyllabus);
router.put('/:id', updateSyllabus);
router.delete('/:id', deleteSyllabus);

export default router;
