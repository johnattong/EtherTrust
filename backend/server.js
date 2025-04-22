const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = require('./app'); // ✅ Use the app you configured

// MongoDB config
const url = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

let client;
let database;

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

const getClient = () => client;
const getDatabase = () => database;

exports.getClient = getClient;
exports.getDatabase = getDatabase;
exports.connectDB = connectDB;

// Start server after DB connects
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
