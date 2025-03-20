require('dotenv').config({ path: '../../.env' });
const db = require('../../server');
const bcrypt = require('bcryptjs');


// add user to database
const addUser = async (name, email, password, walletAddress) => {
  try{
    const userData = await populateUser(name, email, password, walletAddress);
    // Connect to the database and then insert into user table
    await db.connectDB();
    const userCollection = db.getDatabase().collection('users');
    const result = await userCollection.insertOne(userData);
    console.log("User created in database", result);
    return result;
  } catch (error) {
    console.log(error);
  }
};

// create user to be added into
const populateUser = async (name, email, password, walletAddress) => {
  try{
    const hashed_password = await bcrypt.hash(password, 10);
    //const hashed_walletAddress = await bcrypt.hash(walletAddress, 10);  // No need to hash this -- wallet addys are public on the blockchain
    const userData = {
      name: name,
      email: email,
      password: hashed_password,
      walletAddress: walletAddress, 
      createdAt: Date.now(),
    };
    console.log("User fields populated successfully.");
    return userData;
  } catch (err) {
      console.error("Error populating user fields\n", err);
  }
};

module.exports = addUser;