import express from 'express';
const router = express.Router();

import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { createUser, getUsers, getUserById, updateUser, deleteUser, } from '../controllers/userController.js';


router.post('/', restrictTo('admin'), createUser);
router.get('/', protect, restrictTo('admin'), getUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, restrictTo('admin'), deleteUser);

export default router;
