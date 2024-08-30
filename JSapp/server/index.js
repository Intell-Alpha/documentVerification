const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Define the prediction route
app.post('/predict', async (req, res) => {
    const data = req.body;
    console.log('Data received:', data);

    try {
        // Call the Streamlit service for prediction
        const response = await axios.post('http://localhost:8501/predict', data);
        const prediction = response.data.prediction;

        // Send the prediction as response
        res.json({ prediction });
    } catch (error) {
        console.error('Error calling Streamlit service:', error);
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});


