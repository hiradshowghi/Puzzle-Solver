// Define key codes for arrow keys and enter key
const ENTER = 13;
const RIGHT_ARROW = 39;
const LEFT_ARROW = 37;
const UP_ARROW = 38;
const DOWN_ARROW = 40;

// Handle keydown event
function handleKeyDown(e) {
  let dXY = 5; // Amount to move in both X and Y direction
  if (e.which == UP_ARROW && movingBox.y >= dXY)
    movingBox.y -= dXY; // Move up (up arrow)
  if (e.which == RIGHT_ARROW && movingBox.x + movingBox.width + dXY <= canvas.width)
    movingBox.x += dXY; // Move right (right arrow)
  if (e.which == LEFT_ARROW && movingBox.x >= dXY)
    movingBox.x -= dXY; // Move left (left arrow)
  if (e.which == DOWN_ARROW && movingBox.y + movingBox.height + dXY <= canvas.height)
    movingBox.y += dXY; // Move down (down arrow)

  let keyCode = e.which;
  if (keyCode == UP_ARROW || keyCode == DOWN_ARROW) {
    // Prevent the browser from using these keys with text input drop downs
    e.stopPropagation();
    e.preventDefault();
  }
}

// Handle keyup event
function handleKeyUp(e) {
  if (e.which == RIGHT_ARROW || e.which == LEFT_ARROW || e.which == UP_ARROW || e.which == DOWN_ARROW) {
    let dataObj = {
      x: movingBox.x,
      y: movingBox.y
    };
    // Create a JSON string representation of the data object
    let jsonString = JSON.stringify(dataObj);
    // Do nothing with this data for now

  }

  if (e.which == ENTER) {
    handleGetPuzzleButton(); // Treat ENTER key like you would a submit
    document.getElementById('userTextField').value = '';
  }

  e.stopPropagation();
  e.preventDefault();
}

// Handle the "Get Puzzle" button click event
function handleGetPuzzleButton() {
  let userText = document.getElementById('userTextField').value;
  if (userText && userText != '') {
    // Append user input to the text area
    let textDiv = document.getElementById("text-area");
    textDiv.innerHTML = textDiv.innerHTML + `<p> ${userText}</p>`;

    let userRequestObj = {
      text: userText
    };
    let userRequestJSON = JSON.stringify(userRequestObj);
    document.getElementById('userTextField').value = '';

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log("data: " + this.responseText);
        console.log("typeof: " + typeof this.responseText);
        // We are expecting the response text to be a JSON string
        let responseObj = JSON.parse(this.responseText);
        console.dir(responseObj); // Pretty print response data to console.
        movingString.word = responseObj.text;

        // Handle word puzzle lines and display them on the canvas
        if (responseObj.puzzleLines) {
          words = []; // Clear words on the canvas
          for (line of responseObj.puzzleLines) {
            lineWords = line.split(" ");
            for (w of lineWords) {
              let word = {
                word: w
              };
              assignRandomIntCoords(word, canvas.width, canvas.height);
              words.push(word);
            }
          }
        }

        drawCanvas();
      }
    };
    xhttp.open("POST", "userText"); // Define the POST request
    xhttp.send(userRequestJSON); // Send the user's request data
  }
}

// Handle the "Solve Puzzle" button click event
function handleSolvePuzzleButton() {
  const verticalTolerance = 10;
  const lines = {};
  words.sort((a, b) => a.y - b.y);

  let currentLine = [];
  for (const word of words) {
    if (currentLine.length === 0) {
      currentLine.push(word);
    } else {
      const previousWord = currentLine[currentLine.length - 1];
      if (Math.abs(word.y - previousWord.y) <= verticalTolerance) {
        currentLine.push(word);
      } else {
        currentLine.sort((a, b) => a.x - b.x);
        lines[previousWord.y] = currentLine.map((w) => w.word);
        currentLine = [word];
      }
    }
  }

  if (currentLine.length > 0) {
    currentLine.sort((a, b) => a.x - b.x);
    lines[currentLine[0].y] = currentLine.map((w) => w.word);
  }

  const sortedLines = Object.keys(lines).sort((a, b) => parseInt(a) - parseInt(b));
  const solution = sortedLines.map((lineKey) => lines[lineKey].join(' '));

  // Get the text from the file (you need to implement this part).
  const textFromFile = "Rose are red Violets are blue We like javascript And so will you"; // Replace with the actual text from the file.

  const textDiv = document.getElementById('text-area');
  textDiv.innerHTML = solution.join('<br>');

  // Check if the solution matches the text from the file (excluding spaces).
  const isCorrect = solution.join('') === textFromFile.split(' ').join('');

  // Add or remove a CSS class based on whether the solution is correct.
  if (isCorrect) {
    textDiv.classList.add('correct'); // Add a CSS class for green text.
  } else {
    textDiv.classList.remove('correct'); // Remove the CSS class for green text.
  }
}
