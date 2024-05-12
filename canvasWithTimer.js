// Define an array to hold words with initial positions
let words = [];

// Add words with their initial positions to the array
words.push({ word: "I", x: 50, y: 50 });
words.push({ word: "like", x: 70, y: 50 });
words.push({ word: "javascript", x: 120, y: 50 });

// Define an object for a moving string with its initial properties
let movingString = {
  word: "MOVING WORD",
  x: 100,
  y: 100,
  xDirection: 1,
  yDirection: 1,
  stringWidth: 50,
  stringHeight: 24
};

// Define an object for a moving box with its initial properties
let movingBox = {
  x: 50,
  y: 50,
  width: 100,
  height: 100
};

let timer; // Timer variable

const canvas = document.getElementById('canvas1'); // Get the canvas element

// Function to assign random integer coordinates to an object within a canvas
function assignRandomIntCoords(object, maxX, maxY) {
  const MARGIN = 50;
  object.x = MARGIN + Math.floor(Math.random() * (maxX - 2 * MARGIN));
  object.y = MARGIN + Math.floor(Math.random() * (maxY - MARGIN));
}

// Randomize the initial positions of words within the canvas
randomizeWordArrayLocations(words);

// Function to randomize the positions of words in an array within the canvas
function randomizeWordArrayLocations(wordsArray) {
  for (word of wordsArray) {
    assignRandomIntCoords(word, canvas.width, canvas.height);
  }
}

// Function to get the word at a specific location on the canvas
function getWordAtLocation(aCanvasX, aCanvasY) {
  var context = canvas.getContext('2d');
  context.font = '20pt Arial';
  const TOLERANCE = 20;

  for (var i = 0; i < words.length; i++) {
    var wordWidth = context.measureText(words[i].word).width;
    if (
      (aCanvasX > words[i].x && aCanvasX < words[i].x + wordWidth) &&
      Math.abs(words[i].y - aCanvasY) < TOLERANCE
    ) {
      return words[i];
    }
  }
  return null;
}

// Function to draw the canvas with words and their positions
function drawCanvas() {
  const context = canvas.getContext('2d');

  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.font = '20pt Arial';
  context.fillStyle = 'cornflowerblue';
  context.strokeStyle = 'blue';

  for (let i = 0; i < words.length; i++) {
    let data = words[i];
    context.fillText(data.word, data.x, data.y);
    context.strokeText(data.word, data.x, data.y);
  }
  context.stroke();
}
