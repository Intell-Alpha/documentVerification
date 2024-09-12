// const {spawn} = require('child_process');


const list1 = ['identity']
const list2 = ['https://firebasestorage.googleapis.com/v0/b/documentverification-b99ee.appspot.com/o/nla0LKeWGSNmXWm1U2W5jG7YYwL2%2FkaushalIdentity.png?alt=media&token=161c8e21-eaf5-4d8b-a321-01573f98762d']
const list3 = ['https://firebasestorage.googleapis.com/v0/b/documentverification-b99ee.appspot.com/o/nla0LKeWGSNmXWm1U2W5jG7YYwL2%2FWhatsApp%20Image%202024-09-05%20at%2011.31.59%20AM.jpeg?alt=media&token=377fd08e-f96e-4997-b83c-3254bef8da08','https://firebasestorage.googleapis.com/v0/b/documentverification-b99ee.appspot.com/o/nla0LKeWGSNmXWm1U2W5jG7YYwL2%2Frandome1?alt=media&token=341a8ebd-037c-48d3-8ccf-67839fe883ea']


export const getValidationResponse = (list1, list2, list3, spawn) => {
    return new Promise((resolve, reject) => {
        let result = null;
        const inputData = JSON.stringify({ list1, list2, list3 });

        const getMain = spawn('py', ['C:\\Users\\kaush\\Documents\\intelAlpha\\documentVerification\\App\\Main.py', inputData]);

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
}

// getValidationResponse(list1, list2, list3)
//     .then((result) => {
//         console.log("Validation result:", result);
//     })
//     .catch((error) => {
//         console.error("Error:", error);
//     });
