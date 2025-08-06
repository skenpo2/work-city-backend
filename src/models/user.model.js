import mongoose, { Schema } from 'mongoose';

import { comparePassword } from '../../../utils/argonPassword.js';
import { UserRoleEnum } from '../enums/user-role.enum.js';
import { hashPassword } from '../utils/argonPassword.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(UserRoleEnum),
      default: 'USER',
      required: true,
    },
  },
  { timestamps: true }
);

//hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = hashPassword(this.password);
  next();
});

//method to verify password
userSchema.methods.verifyPassword = async function (candidatePassword) {
  return comparePassword(this.password, candidatePassword);
};

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
