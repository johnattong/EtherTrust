const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

const cleanup = async () => {
  const client = new MongoClient(url);
  await client.connect();

  const db = client.db(dbName);
  console.log("Connected to MongoDB");

  // Drop the collection
  await db.collection('users').drop();

  console.log("User collection dropped");
  await client.close();
};

cleanup().catch(console.error);
