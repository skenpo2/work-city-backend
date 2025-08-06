import express from 'express';
import {
  createClient,
  deleteClient,
  getClient,
  getClientById,
  updateClientById,
} from '../controllers/client.controller.js';

const router = express.Router();

router.post('/', createClient);

router.get('/', getClient);
router.get('/:id', getClientById);

router.put('/:id', updateClientById);
router.delete('/:id', deleteClient);

export default router;
