import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { config } from '../configs/app.config.js';
import app from '../app.js';

const generateToken = (user) => {
  return jwt.sign(user, config.ACCESS_TOKEN || 'secret', {
    expiresIn: '1h',
  });
};

describe('POST /api/clients', () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect(config.MONGO_URI); // Ensure connection
    token = generateToken({ id: 'admin-id', role: 'admin' });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a client successfully', async () => {
    const res = await request(app)
      .post('/api/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Client',
        email: 'client@example.com',
        phone: '1234567890',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('client');
    expect(res.body.client).toHaveProperty('name', 'Test Client');
  });

  it('should return 400 if input is invalid', async () => {
    const res = await request(app)
      .post('/api/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
  });
});
