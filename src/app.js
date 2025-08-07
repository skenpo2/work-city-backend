// app.js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.middleware.js';

const app = express();

// Security Headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// JSON and Cookies
app.use(express.json());
app.use(cookieParser());

// Rate Limiter (100 reqs per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, slow down.' },
});

app.use(limiter);

// Routes
app.use('/api', routes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "This page doesn't exist",
  });
});

// Error Handler
app.use(errorHandler);

export default app;
