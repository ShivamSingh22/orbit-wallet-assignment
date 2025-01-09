import express, { Router, RequestHandler } from 'express';
import { getUser, createUser, updateUser } from '../controllers/user.controller';

const router: Router = express.Router();

router.get('/:id', getUser as RequestHandler);
router.post('/', createUser as RequestHandler);
router.put('/:id', updateUser as RequestHandler);

export default router;
