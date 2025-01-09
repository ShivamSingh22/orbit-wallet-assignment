import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.model';
import Transaction from '../models/transaction.model';

dotenv.config();

const generateRandomTransaction = (userId: string) => ({
  status: ['success', 'pending', 'failed'][Math.floor(Math.random() * 3)],
  type: ['debit', 'credit'][Math.floor(Math.random() * 2)],
  transactionDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
  amount: Math.floor(Math.random() * 10000),
  userId
});

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    
    // Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});

    // Create 10 users
    const users = await User.insertMany(
      Array.from({ length: 10 }, (_, i) => ({
        name: `User ${i + 1}`,
        phoneNumber: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`
      }))
    );

    console.log('Created users:', users.map(u => ({ id: u._id, name: u.name })));

    // Create 5 transactions for each user
    for (const user of users) {
      const transactions = Array.from({ length: 5 }, () => 
        generateRandomTransaction(user._id)
      );
      const createdTransactions = await Transaction.insertMany(transactions);
      console.log(`Created ${createdTransactions.length} transactions for user ${user.name}`);
    }

    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
