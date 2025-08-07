// src/tests/project.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { config } from '../configs/app.config.js';
import app from '../app.js';
import ProjectModel from '../models/project.model.js';

const generateToken = (user) => {
  return jwt.sign(user, config.ACCESS_TOKEN || 'secret', {
    expiresIn: '1h',
  });
};

describe('PUT /api/projects/:id', () => {
  let token;
  let project;

  beforeAll(async () => {
    await mongoose.connect(config.MONGO_URI);
    token = generateToken({ id: 'admin-id', role: 'admin' });

    project = await ProjectModel.create({
      title: 'Old Project',
      description: 'Old Desc',
      clientId: '123456Client',
      status: 'pending',
    });
  });

  afterAll(async () => {
    await ProjectModel.deleteMany();
    await mongoose.connection.close();
  });

  it('should update the project', async () => {
    const res = await request(app)
      .put(`/api/projects/${project._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Project',
        description: 'Updated Desc',
        status: 'completed',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.project).toHaveProperty('title', 'Updated Project');
  });

  it('should return 400 for invalid input', async () => {
    const res = await request(app)
      .put(`/api/projects/${project._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '',
        status: 'not-valid',
      });

    expect(res.statusCode).toBe(400);
  });
});
