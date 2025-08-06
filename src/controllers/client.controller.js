import { HTTPSTATUS } from '../configs/http.config.js';
import AsyncHandler from '../middlewares/asyncHandler.js';
import ClientModel from '../models/client.model.js';
import { createClientService } from '../services/client.service.js';
import { BadRequestException, NotFoundException } from '../utils/appError.js';
import {
  createClientSchema,
  updateClientSchema,
} from '../validations/client.validation.js';

export const createClient = AsyncHandler(async (req, res, next) => {
  const body = createClientSchema.parse({ ...req.body });

  //check if there is existing client with provided email
  const existingClient = ClientModel.findOne({ email: body.email });

  if (existingClient) {
    throw new BadRequestException('Client already exist for this email');
  }

  const client = await createClientService(body);

  return res.status(HTTPSTATUS.CREATED).json({
    success: true,
    message: 'Client created successfully',
    client,
  });
});

export const getClient = AsyncHandler(async (req, res, next) => {
  const clients = await ClientModel.find();
});
export const getClientById = AsyncHandler(async (req, res, next) => {
  const client = await Client.findById(req.params.id);
  if (!client) return res.status(404).json({ message: 'Client not found' });
});

export const updateClientById = AsyncHandler(async (req, res, next) => {
  const body = updateClientSchema({ ...req.body });
  const client = await ClientModel.findByIdAndUpdate(req.params.id, body, {
    new: true,
  });
  if (!client) {
    throw new NotFoundException('Client not found');
  }
  return res.status(HTTPSTATUS.CREATED).json({
    success: true,
    message: 'Client updated successfully',
    client,
  });
});

export const deleteClient = AsyncHandler(async (req, res, next) => {
  const client = await Client.findByIdAndDelete(req.params.id);
  if (!client) return res.status(404).json({ message: 'Client not found' });
});
