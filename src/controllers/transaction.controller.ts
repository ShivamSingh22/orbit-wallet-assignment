import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Transaction from '../models/transaction.model';
import { TransactionFilters } from '../types';

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Error creating transaction' });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId });
    res.json(transactions);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Error fetching transactions' });
  }
};

export const getTransactionsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const { 
      status, 
      type, 
      startDate, 
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    // Build query object
    const query: any = { userId };
    
    // Add filters if they exist
    if (status) query.status = status;
    if (type) query.type = type;
    if (startDate || endDate) {
      query.transactionDate = {};
      if (startDate) query.transactionDate.$gte = new Date(startDate as string);
      if (endDate) query.transactionDate.$lte = new Date(endDate as string);
    }

    console.log('Query:', query); // Debug log

    const transactions = await Transaction.aggregate([
      { $match: query },
      { $sort: { transactionDate: -1 } },
      { 
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' }
    ]);

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error: any) {
    console.error('Error:', error);
    res.status(400).json({ 
      error: error.message,
      message: 'Invalid user ID or other error occurred'
    });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const { 
      status, 
      type, 
      startDate, 
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    const query: any = {};
    
    if (status) query.status = status;
    if (type) query.type = type;
    if (startDate || endDate) {
      query.transactionDate = {};
      if (startDate) query.transactionDate.$gte = new Date(startDate as string);
      if (endDate) query.transactionDate.$lte = new Date(endDate as string);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const transactions = await Transaction.aggregate([
      { $match: query },
      { $sort: { transactionDate: -1 } },
      { $skip: skip },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' }
    ]);

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
