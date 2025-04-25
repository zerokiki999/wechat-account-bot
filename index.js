const { Wechaty } = require('wechaty');
const QRCode = require('qrcode');
const { readResults, saveResults } = require('./storage');  // Import storage.js

// Store the accumulated total
let total = 0;

// Initialize the WeChat bot
const bot = new Wechaty();

bot.on('message', async (message) => {
    const contact = message.from();
    const text = message.text();
    const room = message.room();

    // If it's a private message
    if (!room) {
        if (text.includes('*')) {
            // Match "number * number"
            const match = text.match(/(\d+)\s*\*\s*(\d+)/);

            if (match) {
                const num1 = parseInt(match[1]);
                const num2 = parseInt(match[2]);
                const result = num1 * num2;

                // Accumulate the result
                total += result;

                // Save the results
                const results = readResults();  // Read the accumulated results
                results.push({ num1, num2, result, total, time: new Date() });
                saveResults(results);  // Save the results

                await contact.say(`Calculation result: ${num1} * ${num2} = ${result}\nCurrent total: ${total}`);
            } else {
                await contact.say('Please use the format: number * number, e.g., 10 * 5');
            }
        } else if (text === 'Show accumulated results') {
            // Show all calculation records
            const results = readResults();  // Read all results
            if (results.length === 0) {
                await contact.say('No calculation records available');
            } else {
                let resultText = 'Calculation records:\n';
                results.forEach((item, index) => {
                    resultText += `${index + 1}. ${item.num1} * ${item.num2} = ${item.result}, Total: ${item.total}, Time: ${item.time}\n`;
                });
                await contact.say(resultText);
            }
        } else {
            await contact.say('Please enter a valid command. Available commands:\n1. number * number\n2. Show accumulated results');
        }
    }
});

bot.on('scan', (url, status) => {
    if (status === 0) {
        console.log('Scan the QR code to log into WeChat');
        QRCode.toString(url, { type: 'terminal' }, (err, qrCode) => {
            if (err) throw err;
            console.log(qrCode);
        });
    }
});

bot.on('login', user => {
    console.log(`${user} logged in successfully`);
});

bot.on('logout', user => {
    console.log(`${user} logged out`);
});

bot.start().then(() => console.log('Bot started successfully!'));
