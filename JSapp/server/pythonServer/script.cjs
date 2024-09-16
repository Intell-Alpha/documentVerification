const {spawn} = require('child_process');


const list1 = ['identity']

const list2 = ["https://firebasestorage.googleapis.com/v0/b/documentverification-b99ee.appspot.com/o/H7bw9v6nB9eUMHQiXJSbw98zsaF2%2Fpassport?alt=media&token=8bec62a2-6f8c-4a0e-a9e1-0ee4e91fc2fe"]
const list3 = ["https://firebasestorage.googleapis.com/v0/b/documentverification-b99ee.appspot.com/o/H7bw9v6nB9eUMHQiXJSbw98zsaF2%2Flicense?alt=media&token=2efcdf08-9d63-4360-80bb-7ee1d0be6bec"]


const getValidationResponse = (list1, list2, list3) => {
    return new Promise((resolve, reject) => {
        let result = null;
        const inputData = JSON.stringify({ list1, list2, list3 });

        const getMain = spawn('py', ['Main.py', inputData]);

        getMain.stdout.on('data', (data) => {
            try {
                // console.log(data)
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
