import ClientModel from '../models/client.model.js';

export const createClientService = async (body) => {
  const { name, email, phone } = body;
  try {
    const client = new ClientModel({
      name,
      email,
      phone,
    });

    await client.save();

    return client;
  } catch (error) {
    throw error;
  }
};
