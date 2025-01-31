// db.js
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

// MongoDB connection URL with authentication options
let url = `${process.env.MONGO_URL}`;

let dbInstance = null;
const dbName = "giftdb";

async function connectToDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  const client = new MongoClient(url);

  try {
    // Task 1: Connect to MongoDB
    const client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    console.log("Connected to MongoDB successfully");

    // Task 2: Connect to database "giftdb" and store in variable dbInstance
    dbInstance = client.db(dbName);

    // Task 3: Return database instance
    return dbInstance;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

module.exports = connectToDatabase;
