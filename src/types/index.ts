export interface IUser {
  _id: string;
  name: string;
  phoneNumber: string;
}

export interface ITransaction {
  _id: string;
  status: 'success' | 'pending' | 'failed';
  type: 'debit' | 'credit';
  transactionDate: Date;
  amount: number;
  userId: string;
}

export interface TransactionFilters {
  status?: 'success' | 'pending' | 'failed';
  type?: 'debit' | 'credit';
  startDate?: string | Date;
  endDate?: string | Date;
  page?: number;
  limit?: number;
}
