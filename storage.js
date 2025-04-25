const fs = require('fs');
const path = require('path');

// File path to store the accumulated results
const filePath = path.join(__dirname, 'results.json');

// Read the results data
function readResults() {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

// Save the results data
function saveResults(results) {
  fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
}

module.exports = {
  readResults,
  saveResults
};
