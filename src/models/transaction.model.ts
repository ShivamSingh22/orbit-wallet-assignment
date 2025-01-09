import mongoose, { Schema } from 'mongoose';
import { ITransaction } from '../types';

const transactionSchema = new Schema<ITransaction>({
  status: {
    type: String,
    enum: ['success', 'pending', 'failed'],
    required: true,
  },
  type: {
    type: String,
    enum: ['debit', 'credit'],
    required: true,
  },
  transactionDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
