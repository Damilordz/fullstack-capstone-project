require('dotenv').config();
const express = require('express');
const axios = require('axios');
const logger = require('./logger');
const expressPino = require('express-pino-logger')({ logger });
const natural = require('natural')

// Initialize the express server
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(expressPino);

app.post('/sentiment', async (req, res) => {
    try {
        const { sentence } = req.body;

        if (!sentence) {
            logger.error('No sentence provided');
            return res.status(400).json({ error: 'No sentence provided' });
        }

        // Initialize the sentiment analyzer with Natural's PorterStemmer and "English" language
        const Analyzer = natural.SentimentAnalyzer;
        const stemmer = natural.PorterStemmer;
        const analyzer = new Analyzer("English", stemmer, "afinn");

        // Perform sentiment analysis
        const analysisResult = analyzer.getSentiment(sentence.split(' '));

        let sentiment = "neutral";

        // Set sentiment to negative or positive based on score rules
        if (analysisResult < 0) {
            sentiment = "negative";
        } else if (analysisResult >= 0.33) {
            sentiment = "positive";
        }

        // Logging the result
        logger.info(`Sentiment analysis result: ${analysisResult}, Sentiment: ${sentiment}`);

        // Send a status code of 200 with both sentiment score and the sentiment text
        res.status(200).json({ sentimentScore: analysisResult, sentiment: sentiment });

    } catch (error) {
        logger.error(`Error performing sentiment analysis: ${error}`);

        // If there is an error, return a 500 status and JSON error message
        res.status(500).json({ message: 'Error performing sentiment analysis' });
    }
});

app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});
