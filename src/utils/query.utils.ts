import { TransactionFilters } from '../types';
import mongoose from 'mongoose';

export const buildTransactionQuery = (userId: string, filters: TransactionFilters) => {
    const query: any = { 
        userId: new mongoose.Types.ObjectId(userId) 
    };
    
    if (filters.status) query.status = filters.status;
    if (filters.type) query.type = filters.type;
    
    if (filters.startDate || filters.endDate) {
        query.transactionDate = {};
        if (filters.startDate) query.transactionDate.$gte = new Date(filters.startDate);
        if (filters.endDate) query.transactionDate.$lte = new Date(filters.endDate);
    }
    
    return query;
};

export const buildPaginationResponse = (total: number, page: number = 1, limit: number = 10) => {
    return {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
    };
};