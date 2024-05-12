// Import the required Node.js built-in modules
const http = require('http'); // For creating an HTTP server
const fs = require('fs'); // For reading static files
const url = require('url'); // For parsing URL strings

// Define the root directory for serving static files
const ROOT_DIR = 'html';

// Define MIME types for various file extensions
const MIME_TYPES = {
  'css': 'text/css',
  'gif': 'image/gif',
  'htm': 'text/html',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'js': 'application/javascript',
  'json': 'application/json',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'txt': 'text/plain'
};

// Function to determine the MIME type of a file based on its extension
function get_mime(filename) {
  for (let ext in MIME_TYPES) {
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return MIME_TYPES[ext];
    }
  }
  return MIME_TYPES['txt']; // Default to text/plain if not found
}

// Function to check if a user's solution matches the correct order
function isSolutionCorrect(solution, correctOrder) {
  // Remove spaces and compare sanitized solution with sanitized correct order
  const sanitizedSolution = solution.filter(word => word !== ' ').join('');
  const sanitizedCorrectOrder = correctOrder.filter(word => word !== ' ').join('');
  return sanitizedSolution === sanitizedCorrectOrder;
}

// Create an HTTP server and define its request handling logic
http.createServer(function (request, response) {
  let urlObj = url.parse(request.url, true, false);
  console.log('\n============================');
  console.log('PATHNAME: ' + urlObj.pathname);
  console.log('REQUEST: ' + ROOT_DIR + urlObj.pathname);
  console.log('METHOD: ' + request.method);

  if (urlObj.pathname.startsWith('/getPuzzle/')) {
    // Handle requests for puzzles
    const puzzleId = urlObj.pathname.replace('/getPuzzle/', '');

    if (puzzles[puzzleId]) {
      response.writeHead(200, { 'Content-Type': MIME_TYPES['txt'] });
      response.end(puzzles[puzzleId]);
    } else {
      response.writeHead(404);
      response.end('Puzzle not found');
    }
    return;
  }

  let receivedData = '';

  // Attach event handlers to collect message data
  request.on('data', function (chunk) {
    receivedData += chunk;
  });

  let dataObj = undefined; // Object representing client data
  let returnObj = {}; // Object to be returned to the client

  // Event handler for the end of the message
  request.on('end', function () {
    console.log('received data: ', receivedData);
    console.log('type: ', typeof receivedData);

    if (request.method === 'POST') {
      // Handle POST requests
      dataObj = JSON.parse(receivedData);
      console.log('received data object: ', dataObj);
      console.log('type: ', typeof dataObj);
      console.log('USER REQUEST: ' + dataObj.text);
      returnObj.text = 'NOT FOUND: ' + dataObj.text;
    }

    if (request.method === 'POST' && urlObj.pathname === '/checkSolution') {
      // Handle checking a user's solution
      const clientData = JSON.parse(receivedData);
      const userSolution = clientData.solution;
      const selectedPuzzleFile = clientData.puzzleFile;

      const puzzleFilePath = `puzzles/${selectedPuzzleFile}`;
      const correctOrder = fs.readFileSync(puzzleFilePath, 'utf8')
        .split('\n')
        .map(line => line.trim())
        .join(' ')
        .split(' ');

      const isCorrect = isSolutionCorrect(userSolution, correctOrder);

      response.writeHead(200, { 'Content-Type': MIME_TYPES['json'] });
      response.end(JSON.stringify({ correct: isCorrect }));
    }

    if (request.method === 'POST' && urlObj.pathname === '/userText') {
      // Handle user text input
      let puzzleFile = `puzzles/${dataObj.text.trim()}.txt`;
      console.log('Looking for puzzle file: ' + puzzleFile);
      fs.exists(puzzleFile, (exists) => {
        if (exists) {
          console.log(puzzleFile + '<--EXISTS');

          fs.readFile(puzzleFile, function (err, data) {
            if (err) {
              returnObj.text = 'FILE READ ERROR';
              response.writeHead(200, {
                'Content-Type': MIME_TYPES['json'],
              });
              response.end(JSON.stringify(returnObj));
            } else {
              var fileLines = data.toString().split('\n');
              for (i in fileLines) fileLines[i] = fileLines[i].replace(/(\r\n|\n|\r)/gm, '');
              returnObj.text = puzzleFile;
              returnObj.puzzleLines = fileLines;
              returnObj.filePath = puzzleFile;
              response.writeHead(200, {
                'Content-Type': MIME_TYPES['json'],
              });
              response.end(JSON.stringify(returnObj));
            }
          });
        } else {
          console.log(puzzleFile + '<--DOES NOT EXIST');
          response.writeHead(200, {
            'Content-Type': MIME_TYPES['json'],
          });
          response.end(JSON.stringify(returnObj));
        }
      });
    }

    if (request.method === 'GET') {
      // Handle GET requests as static file requests
      let filePath = ROOT_DIR + urlObj.pathname;
      if (urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html';

      fs.readFile(filePath, function (err, data) {
        if (err) {
          // Report error to the console
          console.log('ERROR: ' + JSON.stringify(err));
          // Respond with not found 404 to the client
          response.writeHead(404);
          response.end(JSON.stringify(err));
          return;
        }
        response.writeHead(200, {
          'Content-Type': get_mime(filePath),
        });
        response.end(data);
      });
    }
  });
}).listen(3000);

// Server listening message
console.log('Server Running at http://127.0.0.1:3000  CNTL-C to quit');
console.log('To Test');
console.log('http://localhost:3000/index.html');
