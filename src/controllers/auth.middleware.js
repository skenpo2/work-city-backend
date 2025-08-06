import jwt from 'jsonwebtoken';
import { HTTPSTATUS } from '../configs/http.config.js';
import { UnauthorizedException } from '../utils/appError.js';
import UserModel from '../models/user.model.js';
import { config } from '../configs/app.config.js';

//middleware to verify jwt and authenticate user
const Authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedException('Unauthorized');
  }

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], config.ACCESS_TOKEN);
    req.user = await UserModel.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: 'Token failed' });
  }
};

export default Authenticate;
