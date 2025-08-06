/ =================== routes/auth.routes.js ===================
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { JWT_SECRET } from '../config.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

// =================== routes/client.routes.js ===================
import express from 'express';
import Client from '../models/Client.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', admin, async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  const clients = await Client.find();
  res.json(clients);
});

router.get('/:id', async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) return res.status(404).json({ message: 'Client not found' });
  res.json(client);
});

router.put('/:id', admin, async (req, res) => {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!client) return res.status(404).json({ message: 'Client not found' });
  res.json(client);
});

router.delete('/:id', admin, async (req, res) => {
  const client = await Client.findByIdAndDelete(req.params.id);
  if (!client) return res.status(404).json({ message: 'Client not found' });
  res.json({ message: 'Client deleted' });
});

export default router;

// =================== routes/project.routes.js ===================
import express from 'express';
import Project from '../models/Project.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  const projects = await Project.find().populate('client');
  res.json(projects);
});

router.get('/client/:clientId', async (req, res) => {
  const projects = await Project.find({ client: req.params.clientId });
  res.json(projects);
});

router.get('/:id', async (req, res) => {
  const project = await Project.findById(req.params.id).populate('client');
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
});

router.put('/:id', async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
});

router.delete('/:id', async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json({ message: 'Project deleted' });
});

export default router;

// =================== tests/client.test.js ===================
// You can use Jest and Supertest
import request from 'supertest';
import app from '../app.js';

describe('Client API', () => {
  it('should create a client', async () => {
    const res = await request(app)
      .post('/api/clients')
      .send({ name: 'Test Client' })
      .set('Authorization', `Bearer ADMIN_TOKEN`); // replace with real token
    expect(res.statusCode).toBe(201);
  });
});

// =================== tests/project.test.js ===================
describe('Project API', () => {
  it('should update a project', async () => {
    const res = await request(app)
      .put('/api/projects/PROJECT_ID')
      .send({ title: 'Updated Project' })
      .set('Authorization', `Bearer USER_TOKEN`); // replace with real token
    expect(res.statusCode).toBe(200);
  });
});
