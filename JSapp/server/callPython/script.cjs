const {spawn} = require('child_process');


const list1 = ['identity']
const list2 = ['https://firebasestorage.googleapis.com/v0/b/documentverification-b99ee.appspot.com/o/A58z2z9qSETixNDNzmC5LRzvrg42application-documents%2FeducationApplication.png?alt=media&token=9f383bac-c24c-45d2-b201-5bb55e1080b8']
const list3 = ['https://firebasestorage.googleapis.com/v0/b/documentverification-b99ee.appspot.com/o/nla0LKeWGSNmXWm1U2W5jG7YYwL2%2FCBIT%20ID%20card?alt=media&token=ace4435e-f8a8-4390-a27a-866714f05c58', 'https://firebasestorage.googleapis.com/v0/b/documentverification-b99ee.appspot.com/o/nla0LKeWGSNmXWm1U2W5jG7YYwL2%2FMarks%20memo%20sem%203?alt=media&token=17ff67e9-7f06-4af2-a01d-c87ae9a77380']


const getValidationResponse = (list1, list2, list3) => {
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

getValidationResponse(list1, list2, list3)
    .then((result) => {
        console.log("Validation result:", result);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
