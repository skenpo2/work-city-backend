import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  clientId: z.string(),
});

export const updateProjectSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'completed']).optional(),
});
