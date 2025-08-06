import AsyncHandler from '../middlewares/asyncHandler.js';
import UserModel from '../models/user.model.js';
import {
  registerUserService,
  validateUserCredentials,
} from '../services/auth.service.js';
import { BadRequestException } from '../utils/appError.js';
import generateJwtToken from '../utils/generateJwt.js';
import { loginSchema, signupSchema } from '../validations/auth.validation.js';

export const signUpController = AsyncHandler(async (req, res, next) => {
  //validate user inputs using zod schema
  const body = signupSchema.parse({ ...req.body });

  const { email } = body;

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new BadRequestException('Email already in use');
  }

  //create a new user
  await registerUserService(body);

  return res.status(HTTPSTATUS.OK).json({
    success: true,
    message: 'User registered Successfully',
  });
});

//login a user
export const loginUserController = AsyncHandler(async (req, res, next) => {
  const body = loginSchema.parse({ ...req.body });

  const { email, password } = body;

  //verify user credentials
  const user = await validateUserCredentials(email, password);

  //generate a JWT access token and refresh token for logged user
  const { accessToken, refreshToken } = await generateJwtToken(user);

  return res
    .status(HTTPSTATUS.OK)
    .cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })
    .json({
      success: true,
      message: 'login successful',
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
        role: user.role,
      },
      token: accessToken,
    });
});
