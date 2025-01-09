import mongoose from 'mongoose';
import { IUser } from '../types';

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IUser>('User', userSchema);
