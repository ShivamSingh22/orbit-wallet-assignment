import User from '../models/user.model';
import { BaseService } from './base.service';
import { IUser } from '../types';

export class UserService extends BaseService {
    constructor() {
        super(User);
    }

    async getUserById(id: string): Promise<IUser | null> {
        return this.findById(id);
    }

    async createUser(userData: Partial<IUser>): Promise<IUser> {
        return this.create(userData);
    }

    async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
        return this.update(id, userData);
    }
} 