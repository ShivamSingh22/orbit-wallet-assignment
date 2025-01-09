import Transaction from '../models/transaction.model';
import { BaseService } from './base.service';
import { TransactionFilters, ITransaction } from '../types';

export class TransactionService extends BaseService {
    constructor() {
        super(Transaction);
    }

    async createTransaction(data: Partial<ITransaction>) {
        return await Transaction.create(data);
    }

    async getTransactionsByUserId(userId: string, filters: TransactionFilters) {
        const { status, type, startDate, endDate, page = 1, limit = 10 } = filters;
        const query: any = { userId };

        if (status) query.status = status;
        if (type) query.type = type;
        if (startDate || endDate) {
            query.transactionDate = {};
            if (startDate) query.transactionDate.$gte = new Date(startDate);
            if (endDate) query.transactionDate.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;
        const transactions = await Transaction.find(query)
            .sort({ transactionDate: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Transaction.countDocuments(query);

        return {
            transactions,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        };
    }

    async getAllTransactions(filters: TransactionFilters) {
        const { status, type, startDate, endDate, page = 1, limit = 10 } = filters;
        const query: any = {};
        
        if (status) query.status = status;
        if (type) query.type = type;
        if (startDate || endDate) {
            query.transactionDate = {};
            if (startDate) query.transactionDate.$gte = new Date(startDate);
            if (endDate) query.transactionDate.$lte = new Date(endDate);
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

        return {
            transactions,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit))
            }
        };
    }
}