import mongoose from 'mongoose';

export abstract class BaseService {
    protected model: mongoose.Model<any>;

    constructor(model: mongoose.Model<any>) {
        this.model = model;
    }

    async findById(id: string) {
        return this.model.findById(id);
    }

    async create(data: any) {
        return this.model.create(data);
    }

    async update(id: string, data: any) {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }
} 