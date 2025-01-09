import { TransactionFilters } from '../types';
import { AppError } from './error.utils';

export const validateTransactionFilters = (filters: Partial<TransactionFilters>) => {
    if (filters.status && !['success', 'pending', 'failed'].includes(filters.status)) {
        throw new AppError('Invalid status value');
    }

    if (filters.type && !['debit', 'credit'].includes(filters.type)) {
        throw new AppError('Invalid type value');
    }

    if (filters.startDate && isNaN(Date.parse(filters.startDate.toString()))) {
        throw new AppError('Invalid startDate format');
    }

    if (filters.endDate && isNaN(Date.parse(filters.endDate.toString()))) {
        throw new AppError('Invalid endDate format');
    }
}; 