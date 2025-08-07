import express from 'express';
import {
  createClient,
  deleteClient,
  getClient,
  getClientById,
  updateClientById,
} from '../controllers/client.controller.js';
import Authenticate from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/admin.middleware.js';

const router = express.Router();

router.post('/', isAdmin, createClient);

router.get('/', getClient);
router.get('/:id', getClientById);

router.put('/:id', isAdmin, updateClientById);
router.delete('/:id', isAdmin, deleteClient);

export default router;
