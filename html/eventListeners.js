


document.addEventListener('DOMContentLoaded', function() {
  //This is called after the browser has loaded the web page

  //add mouse down listener to our canvas object
  document.getElementById('canvas1').addEventListener('mousedown', handleMouseDown)
  //add listener to submit button
  document.getElementById('submit_button').addEventListener('click', handleGetPuzzleButton)
  //PROBLEM 5 Answer part
  document.getElementById('solve_button').addEventListener('click', handleSolvePuzzleButton)
  

  //add key handler for the document as a whole, not separate elements.
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)

  timer = setInterval(handleTimer, 100)

  randomizeWordArrayLocations(words) //PROBLEM 1 ANSWER CODE

  drawCanvas()
})
