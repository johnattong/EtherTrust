const { MongoClient } = require('mongodb');
require('dotenv').config();

console.log("hello world");

// MongoDB connection URL and database name
const url = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

let client;
let database;

// Function to connect to MongoDB and export the client and database object
const connectDB = async () => {
    if (!client) {
        try {
            client = new MongoClient(url);
            await client.connect();
            console.log('Connected to MongoDB');
            database = client.db(dbName);
        } catch (err) {
            console.error('Failed to connect to MongoDB', err);
            process.exit(1);
        }
    }
};

// Export the client after the connection
const getClient = () => client;
const getDatabase = () => database;

// Export the database name and client
exports.getClient = getClient;
exports.getDatabase = getDatabase;
exports.connectDB = connectDB;