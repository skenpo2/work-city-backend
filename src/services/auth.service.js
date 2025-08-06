import UserModel from '../models/user.model.js';
import { BadRequestException, NotFoundException } from '../utils/appError.js';

export const registerUserService = async (body) => {
  const { name, email, password } = body;
  try {
    const user = await UserModel.create({ name, email, password });
  } catch (error) {
    throw error;
  }
};

export const validateUserCredentials = async (email, password) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Invalid login credentials');
    }

    const isPassword = await user.verifyPassword(password);

    if (!isPassword) {
      throw new BadRequestException('Invalid login credentials');
    }
    return user;
  } catch (error) {
    throw error;
  }
};
