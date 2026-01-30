import express from 'express';
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask } from '../controllers/task.controller';
import { auth } from '../middleware/auth';

const router = express.Router();


router.post('/', auth, createTask);
router.get('/', auth, getAllTasks);
router.get('/:id', auth, getTaskById);
router.put("/:id",auth,updateTask)
router.delete('/:id',auth, deleteTask);

export default router;