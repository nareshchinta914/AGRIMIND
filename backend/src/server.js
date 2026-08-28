const app = require('./app');
const env = require('./config/env');
const prisma = require('./config/db');

const PORT = env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`
  🌾 =======================================================
  🌱 AGRIMIND PRODUCTION BACKEND SERVER ACTIVE
  🚀 Listening on: http://localhost:${PORT}
  📡 Environment: ${env.NODE_ENV}
  🔒 Security: Helmet, CORS, RateLimiter, JWT, bcrypt
  🗄️ Database ORM: Prisma (PostgreSQL)
  🌾 =======================================================
  `);

  try {
    await prisma.$connect();
    console.log('  ✅ PostgreSQL Database Connection Established.');
  } catch (err) {
    console.warn('  ⚠️ Note: PostgreSQL database connection pending or offline. (Run prisma db push or docker postgres to sync)');
  }
});

// Graceful Shutdown
const shutdown = async () => {
  console.log('\nStopping AGRIMIND backend server gracefully...');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Database connections closed. Exiting process.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = server;
