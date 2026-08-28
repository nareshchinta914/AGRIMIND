const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const env = require('./env');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

const pool = new Pool({
  connectionString: env.DATABASE_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

prisma.pool = pool;
prisma.query = (text, params) => pool.query(text, params);

module.exports = prisma;

