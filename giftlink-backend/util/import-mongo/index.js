// require('dotenv').config();
// const MongoClient = require('mongodb').MongoClient;
// const fs = require('fs');

// // MongoDB connection URL with authentication options
// let url = `${process.env.MONGO_URL}`;
// let filename = `${__dirname}/gifts.json`;
// const dbName = 'giftdb';
// const collectionName = 'gifts';

// // notice you have to load the array of gifts into the data object
// const data = JSON.parse(fs.readFileSync(filename, 'utf8')).docs;

// // connect to database and insert data into the collection
// async function loadData() {
//     const client = new MongoClient(url);

//     try {
//         // Connect to the MongoDB client
//         await client.connect();
//         console.log("Connected successfully to server");

//         // database will be created if it does not exist
//         const db = client.db(dbName);

//         // collection will be created if it does not exist
//         const collection = db.collection(collectionName);
//         let cursor = await collection.find({});
//         let documents = await cursor.toArray();

//         if(documents.length == 0) {
//             // Insert data into the collection
//             const insertResult = await collection.insertMany(data);
//             console.log('Inserted documents:', insertResult.insertedCount);
//         } else {
//             console.log("Gifts already exists in DB")
//         }
//     } catch (err) {
//         console.error(err);
//     } finally {
//         // Close the connection
//         await client.close();
//     }
// }

// loadData();

// module.exports = {
//     loadData,
//   };

require("dotenv").config();
const { MongoClient } = require("mongodb");
const fs = require("fs");

const url = process.env.MONGO_URL;
const filename = `${__dirname}/gifts.json`;
const dbName = "giftdb";
const collectionName = "gifts";

// Load gifts data from JSON file
const data = JSON.parse(fs.readFileSync(filename, "utf8")).docs;

async function loadData() {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB Atlas");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    let cursor = await collection.find({});
    let documents = await cursor.toArray();

    if (documents.length === 0) {
      const insertResult = await collection.insertMany(data);
      console.log(`Inserted ${insertResult.insertedCount} documents`);
    } else {
      console.log("Gifts already exist in the database");
    }
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  } finally {
    await client.close();
  }
}

loadData();

module.exports = { loadData };
