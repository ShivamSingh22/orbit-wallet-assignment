import express, { Router, RequestHandler } from 'express';
import { 
  createTransaction, 
  getTransactionsByUserId,
  getAllTransactions 
} from '../controllers/transaction.controller';

const router: Router = express.Router();

router.post('/', createTransaction as RequestHandler);
router.get('/user/:userId', getTransactionsByUserId as RequestHandler);
router.get('/', getAllTransactions as RequestHandler);

export default router;
