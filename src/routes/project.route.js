import express from 'express';
import {
  createProject,
  deleteProject,
  getProject,
  getProjectById,
  updateProjectById,
} from '../controllers/project.controller.js';

const router = express.Router();

router.post('/', createProject);

router.get('/', getProject);
router.get('/:id', getProjectById);

router.put('/:id', updateProjectById);
router.delete('/:id', deleteProject);

export default router;
