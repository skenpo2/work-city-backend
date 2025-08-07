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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || 'createdAt';
  const order = req.query.order === 'desc' ? -1 : 1;

  const skip = (page - 1) * limit;

  const [clients, totalClients] = await Promise.all([
    ClientModel.find()
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit),
    ClientModel.countDocuments(),
  ]);

  return res.status(HTTPSTATUS.OK).json({
    success: true,
    page,
    limit,
    totalPages: Math.ceil(totalClients / limit),
    totalClients,
    clients,
  });
});

export const getClientById = AsyncHandler(async (req, res, next) => {
  const client = await ClientModel.findById(req.params.id);
  if (!client) {
    throw new NotFoundException("Client not found'");
  }

  return res.status(HTTPSTATUS.OK).json({
    success: true,
    client,
  });
});

export const updateClientById = AsyncHandler(async (req, res, next) => {
  const body = updateClientSchema({ ...req.body });
  const client = await ClientModel.findByIdAndUpdate(req.params.id, body, {
    new: true,
  });
  if (!client) {
    throw new NotFoundException('Client not found');
  }
  return res.status(HTTPSTATUS.OK).json({
    success: true,
    message: 'Client updated successfully',
    client,
  });
});

export const deleteClient = AsyncHandler(async (req, res, next) => {
  const client = await ClientModel.findByIdAndDelete(req.params.id);
  if (!client) {
    throw new NotFoundException('Client not found');
  }

  return res.status(HTTPSTATUS.OK).json({
    success: true,
    message: 'Client deleted successfully',
    client,
  });
});
