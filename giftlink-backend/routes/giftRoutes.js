/*jshint esversion: 8 */
const express = require("express");
const connectToDatabase = require("../models/db");
const logger = require('../logger');

const router = express.Router();

// Get all gifts
router.get("/", async (req, res) => {
    logger.info('/ called');
  try {
    // Connect to MongoDB and store connection to db constant
    const db = await connectToDatabase();

    // Use the collection() method to retrieve the gift collection
    const collection = db.collection("gifts");

    // Fetch all gifts using the collection.find method. Chain with toArray method to convert to JSON array
    const gifts = await collection.find().toArray();

    // Return the gifts using the res.json method
    res.json(gifts);
  } catch (e) {
    console.error("Error fetching gifts:", e);
    res.status(500).send("Error fetching gifts");
  }
});

// Get a single gift by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send("Id is required");
  }

  try {
    // Connect to MongoDB and store connection to db constant
    const db = await connectToDatabase();

    // Use the collection() method to retrieve the gift collection
    const collection = db.collection("gifts");

    // Find a specific gift by ID using the collection.findOne method and store in constant called gift
    const gift = await collection.findOne({ id: id });

    if (!gift) {
      return res.status(404).send("Gift not found");
    }

    res.json(gift);
  } catch (e) {
    console.error("Error fetching gift:", e);
    res.status(500).send("Error fetching gift");
  }
});

// Add a new gift
router.post("/", async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("gifts");
    const gift = await collection.insertOne(req.body);

    res.status(201).json(gift.ops[0]);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
