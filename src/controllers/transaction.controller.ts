import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Transaction from '../models/transaction.model';
import { TransactionFilters } from '../types';
import { TransactionService } from '../services/transaction.service';
import { handleError } from '../utils/error.utils';

const transactionService = new TransactionService();

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
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

export const getTransactionsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await transactionService.getTransactionsByUserId(
            req.params.userId,
            {
                status: req.query.status as 'success' | 'pending' | 'failed' | undefined,
                type: req.query.type as 'debit' | 'credit' | undefined,
                startDate: req.query.startDate as string,
                endDate: req.query.endDate as string,
                page: Number(req.query.page),
                limit: Number(req.query.limit)
            }
        );
        
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
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
    
    if (status) query.status = status as 'success' | 'pending' | 'failed';
    if (type) query.type = type as 'debit' | 'credit';
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
  } catch (error) {
    next(error);
  }
};
