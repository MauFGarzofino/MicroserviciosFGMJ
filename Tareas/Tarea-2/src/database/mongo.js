const mongoose = require('mongoose');

async function connectMongo(uri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
}

module.exports = { connectMongo };
