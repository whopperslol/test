console.log("keyboardInput.js start init...")

const keyDisplay = document.getElementById("lastKey")

document.addEventListener("keypress", function(keyPressed){ 
  console.log(keyPressed);
  keyDisplay.textContent = keyPressed;
});

console.log("keyboardInput.js initialized!");