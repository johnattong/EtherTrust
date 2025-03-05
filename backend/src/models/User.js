require('dotenv').config({ path: '../../.env' });
const db = require('../../server');


// add user to database
const addUser = async (name, email, password, walletAddress) => {
  try{
    const userData = populateUser(name, email, password, walletAddress);
    // Connect to the database and then insert into user table
    await db.connectDB();
    const userCollection = db.getDatabase().collection('users');
    const result = await userCollection.insertOne(userData);
    console.log("User created in database", result);
  } catch (error) {
    console.log(error);
  }
};

// create user to be added into
const populateUser = (name, email, password, walletAddress) => {
  try{
    const userData = {
      name: name,
      email: email,
      password: password,             // hash this and
      walletAddress: walletAddress,   // this
      createdAt: Date.now(),
    };
    console.log("User fields populated successfully.");
    return userData;
  } catch (err) {
      console.error("Error populating user fields\n", err);
  }
};

module.exports = addUser;