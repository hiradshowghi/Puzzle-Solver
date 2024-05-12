let deltaX, deltaY //location where mouse is pressed relative to targeted string



function getCanvasMouseLocation(e) {
  //provide the mouse location relative to the upper left corner
  //of the canvas

  /*
  This code took some trial and error. If someone wants to write a
  nice tutorial on how mouse-locations work that would be great.
  */
  let rect = canvas.getBoundingClientRect()

  //account for amount the document scroll bars might be scrolled

  //get the scroll offset
  const element = document.getElementsByTagName("html")[0]
  let scrollOffsetX = element.scrollLeft
  let scrollOffsetY = element.scrollTop

  let canX = e.pageX - rect.left - scrollOffsetX
  let canY = e.pageY - rect.top - scrollOffsetY

  return {
    canvasX: canX,
    canvasY: canY
  }

}

function handleMouseDown(e) {

  //get mouse location relative to canvas top left
  let canvasMouseLoc = getCanvasMouseLocation(e)

  console.log("mouse down:" + canvasMouseLoc.canvasX + ", " + canvasMouseLoc.canvasY)

  wordBeingMoved = getWordAtLocation(canvasMouseLoc.canvasX, canvasMouseLoc.canvasY)
  //console.log(wordBeingMoved.word)
  if (wordBeingMoved != null) {
    deltaX = wordBeingMoved.x - canvasMouseLoc.canvasX
    deltaY = wordBeingMoved.y - canvasMouseLoc.canvasY
    document.getElementById('canvas1').addEventListener('mousemove', handleMouseMove)
    document.getElementById('canvas1').addEventListener('mouseup', handleMouseUp)

  }

  // Stop propagation of the event and stop any default
  //  browser action

  e.stopPropagation()
  e.preventDefault()

  drawCanvas()
}



function handleMouseMove(e) {

  console.log("mouse move");

  //get mouse location relative to canvas top left

  let canvasMouseLoc = getCanvasMouseLocation(e)

  wordBeingMoved.x = canvasMouseLoc.canvasX + deltaX
  wordBeingMoved.y = canvasMouseLoc.canvasY + deltaY

  e.stopPropagation()

  drawCanvas()
}

function handleMouseUp(e) {

  console.log("mouse up")

  e.stopPropagation()

  //remove mouse move and mouse up handlers but leave mouse down handler
  document.getElementById('canvas1').removeEventListener('mousemove', handleMouseMove)
  document.getElementById('canvas1').removeEventListener('mouseup', handleMouseUp)

  drawCanvas() //redraw the canvas
}
