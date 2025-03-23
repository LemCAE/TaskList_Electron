const fs = require('fs');

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const MAX_LINES = 6144 + 1; // 最大行数

function logToFile(fileName,message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${fileName}| ${message}\n`;
  
    fs.appendFile('app.log', logMessage, (err) => {
      if (err) {
        console.error('Failed to write to log file:', err);
        return;
      }
  
      checkAndTrimLogFile();
    });
  }
  
  function checkAndTrimLogFile() {
    fs.stat('app.log', (err, stats) => {
      if (err) {
        console.error('Failed to get log file stats:', err);
        return;
      }
  
      if (stats.size > MAX_FILE_SIZE || stats.size > MAX_LINES) {
        trimLogFile();
      }
    });
  }
  
  function trimLogFile() {
    fs.readFile('app.log', 'utf8', (err, data) => {
      if (err) {
        console.error('Failed to read log file:', err);
        return;
      }
  
      const lines = data.split('\n');
      if (lines.length > MAX_LINES) {
        const newContent = lines.slice(lines.length - MAX_LINES).join('\n');
        fs.writeFile('app.log', newContent, (err) => {
          if (err) {
            console.error('Failed to trim log file:', err);
          } else {
            console.log('Log file trimmed.');
          }
        });
      }
    });
  }

  
module.exports = { logToFile };