import { HTTPSTATUS } from '../configs/http.config.js';
import {
  BadRequestException,
  UnauthorizedException,
} from '../utils/appError.js';

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    throw new BadRequestException('authenticated');
  }

  if (req.user.role !== 'admin') {
    throw new UnauthorizedException('Access denied: Admins only');
  }

  next();
};
