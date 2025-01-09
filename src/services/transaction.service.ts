import Transaction from '../models/transaction.model';
import { BaseService } from './base.service';
import { TransactionFilters } from '../types';
import { buildTransactionQuery, buildPaginationResponse } from '../utils/query.utils';
import { validateTransactionFilters } from '../utils/validation.utils';
import { AppError } from '../utils/error.utils';

export class TransactionService extends BaseService {
    constructor() {
        super(Transaction);
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
}