console.log("keyboardInput.js start init...")

const keyDisplay = document.getElementById("lastKey")

document.addEventListener("keydown", function(event){ 
  event.preventDefault();
  var displayedKey = "";

  var modifierKey = false;

  var ctrlHeld = false;
  var shiftHeld = false;

  if (event.key === "Control" || event.key === "Shift") {
    modifierKey = true;
  }

  if (event.ctrlKey) {
    ctrlHeld = true;
    displayedKey = "Ctrl";
  }
  if (event.shiftKey) {
    shiftHeld = true;
    if (displayedKey.length > 0) {
      displayedKey += " + Shift";
    } else {
      displayedKey = "Shift"
    }
  }

  if (displayedKey.length > 0 && modifierKey === false) {
    displayedKey += (" + " + event.key.toLowerCase())
  } else if (modifierKey === false) {
    displayedKey = event.key.toLowerCase();
  }
  
  keyDisplay.textContent = displayedKey;
});

console.log("keyboardInput.js initialized!");