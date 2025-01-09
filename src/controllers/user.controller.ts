import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { AppError } from '../utils/error.utils';

const userService = new UserService();

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};
