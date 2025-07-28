import express from 'express';
import {
  createApplication,
  getApplicationsByStudent,
  getApplicationsByProfessor,
  getAllApplications,
  deleteApplication,
  updateApplicationByAdmin
} from '../controllers/applicationController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/', protect, createApplication);
router.get('/student', protect, getApplicationsByStudent);
router.get('/professor', protect, restrictTo("professor"), getApplicationsByProfessor);
router.get('/', protect, getAllApplications);
router.delete("/:id", protect, restrictTo("admin"), deleteApplication);
router.put("/:id", protect, restrictTo("admin"), updateApplicationByAdmin);


export default router;
