const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(express.json()); // To handle JSON data
app.use(cors());

// Create an API route
app.post('/validate-documents', async (req, res) => {
    const { list1, list2, list3 } = req.body;

    try {
        const result = await getValidationResponse(list1, list2, list3);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// Your getValidationResponse function
const getValidationResponse = (list1, list2, list3) => {
    return new Promise((resolve, reject) => {
        let result = null;
        const inputData = JSON.stringify({ list1, list2, list3 });

        // Call Python script using child_process
        const getMain = spawn('py', ['C:\\Users\\srile\\OneDrive\\Desktop\\documentVerification\\App\\Main.py', inputData]);

        getMain.stdout.on('data', (data) => {
            try {
                result = JSON.parse(data.toString());
                resolve(result);
            } catch (error) {
                reject(`Error parsing JSON: ${error}`);
            }
        });

        getMain.stderr.on('data', (data) => {
            reject(`Error from Python script: ${data}`);
        });

        getMain.on('close', (code) => {
            if (code !== 0) {
                reject(`Python process exited with code ${code}`);
            }
        });
    });
};

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
