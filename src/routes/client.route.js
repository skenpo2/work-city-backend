import express from 'express';

const router = express.Router();

router.post('/');

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
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!client) return res.status(404).json({ message: 'Client not found' });
  res.json(client);
});

export default router;
