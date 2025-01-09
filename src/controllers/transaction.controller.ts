import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services/transaction.service';

const transactionService = new TransactionService();

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = await transactionService.createTransaction(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
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
    const result = await transactionService.getAllTransactions({
      status: req.query.status as 'success' | 'pending' | 'failed' | undefined,
      type: req.query.type as 'debit' | 'credit' | undefined,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};
