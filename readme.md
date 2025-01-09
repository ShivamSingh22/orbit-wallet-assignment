# Wallet Transaction API

A Node.js REST API for managing wallet transactions and users, built with Express, TypeScript, and MongoDB.

## Features

- Get user details by ID
- Get transactions by user ID with filters
- Get all transactions with user details and filters
- Pagination support
- MongoDB aggregation for efficient queries
- TypeScript for type safety
- Error handling middleware
- Data seeding script

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-repo/wallet-transaction-api.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
    - Create a `.env` file in the root directory and add the following variables:
    ```bash
    MONGODB_URI=your_mongodb_uri
    PORT=3000
    ```

4. Seed data:
```bash
npm run seed
```    

5. Run the server:
```bash
npm run build(build the project)
npm start(start the server)
```

 
