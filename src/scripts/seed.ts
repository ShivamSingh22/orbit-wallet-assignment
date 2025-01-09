import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.model';
import Transaction from '../models/transaction.model';
import { connectDB } from '../config/database';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();
        
        // Clear existing data
        await User.deleteMany({});
        await Transaction.deleteMany({});

        // Create 10 users
        const users = await User.insertMany(
            Array.from({ length: 10 }, (_, i) => ({
                name: `User ${i + 1}`,
                phoneNumber: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`
            }))
        );

        // Create 5 transactions per user
        const transactions = [];
        for (const user of users) {
            for (let i = 0; i < 5; i++) {
                transactions.push({
                    userId: user._id,
                    status: ['success', 'pending', 'failed'][Math.floor(Math.random() * 3)],
                    type: ['debit', 'credit'][Math.floor(Math.random() * 2)],
                    amount: Math.floor(100 + Math.random() * 9900),
                    transactionDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
                });
            }
        }
        await Transaction.insertMany(transactions);

        console.log('Data seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
