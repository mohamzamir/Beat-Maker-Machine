// global constants
var clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
//var pattern = [2, 2, 4, 3, 6, 1, 2, 5];
var pattern = [1, 7, 6, 3, 3, 6, 7, 1, 7, 6, 3, 3, 6, 7];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var numberOfMistakes;

const MODE_EASY = 'easy';
const MODE_MEDIUM = 'medium';
const MODE_HARD = 'hard';

let mode = MODE_EASY; // Default mode
let speedIncrement = 20; // Speed increment for each mode
let easySpeed, mediumSpeed, hardSpeed;
let score = 0;

function changeMode(selectedMode) {
  // Remove active class from all mode buttons
  document.getElementById("easyModeBtn").classList.remove("active");
  document.getElementById("mediumModeBtn").classList.remove("active");
  document.getElementById("hardModeBtn").classList.remove("active");

  // Add active class to the selected mode button
  document.getElementById(`${selectedMode}ModeBtn`).classList.add("active");

  // Update the mode variable
  mode = selectedMode;

  // Update button colors based on the selected mode
  updateButtonColors();
}

function calculateSpeeds() {
  // Calculate speed values for each mode
  easySpeed = speedIncrement;
  mediumSpeed = speedIncrement * 2;
  hardSpeed = speedIncrement * 3;
}

function updateScoreDisplay() {
  document.getElementById("score").textContent = score;
}

function incrementScore() {
  score++;
  updateScoreDisplay();
}

function updateButtonColors() {
  const easyButton = document.getElementById("easyModeBtn");
  const mediumButton = document.getElementById("mediumModeBtn");
  const hardButton = document.getElementById("hardModeBtn");

  // Update button colors based on the selected mode
  const scoreDisplay = document.getElementById("score");

  switch (mode) {
    case MODE_EASY:
      scoreDisplay.style.color = "#FFA500";
      break;
    case MODE_MEDIUM:
      scoreDisplay.style.color = "#FFFFFF";
      break;
    case MODE_HARD:
      scoreDisplay.style.color = "#FF0000";
      break;
  }

  switch (mode) {
    case MODE_EASY:
      easyButton.style.backgroundColor = "#FFA500";
      mediumButton.style.backgroundColor = "#FFFFFF";
      hardButton.style.backgroundColor = "#FFFFFF";
      break;
    case MODE_MEDIUM:
      easyButton.style.backgroundColor = "#FFFFFF";
      mediumButton.style.backgroundColor = "#FFA500";
      hardButton.style.backgroundColor = "#FFFFFF";
      break;
    case MODE_HARD:
      easyButton.style.backgroundColor = "#FFFFFF";
      mediumButton.style.backgroundColor = "#FFFFFF";
      hardButton.style.backgroundColor = "#FFA500";
      break;
  }
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    incrementScore(); // Increment the score when the button is played
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

// Initial update of button colors on page load
updateButtonColors();
updateScoreDisplay();


function startGame() {
  calculateSpeeds();

  score = 0;
  updateScoreDisplay();

  context.resume().then(() => {
    ranPattern();
    console.log(pattern);
    numberOfMistakes = 3;
    progress = 0;
    gamePlaying = true;

    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    playClueSequence();
  });
}


function stopGame() {
  progress = 0;
  gamePlaying = false;

  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  pattern = [];

  updateScoreDisplay();
}

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
    clueHoldTime -= 40;
  }
}

function loseGame() {
  stopGame();
  updateScoreDisplay();
  alert("Game Over. You lost :( ");
}

function winGame() {
  stopGame();
  score++;
  alert("Game Over. Congrats you learned how to make beats just like a dj!");
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }

  // add game logic here
  if (pattern[guessCounter] == btn) {
    if (progress == guessCounter) {
      if (progress == pattern.length - 1) {
        winGame();
      } else {
        progress++;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  } else {
    numberOfMistakes -= 1;
    alert(
      "Wrong Button! You still have " + numberOfMistakes + " chances left."
    );
    if (numberOfMistakes == 0) {
      loseGame();
    }
  }
}

// this func generates random sequence every game
function ranPattern() {
  pattern = [1, 7, 6, 3, 3, 6, 7, 1, 7, 6, 3, 3, 6, 7];
  for (let i = 0; i < 5; i++) {
    pattern.push(Math.floor(Math.random() * 8) + 1);
  }
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.63, // C
  2: 293.66, // D
  3: 329.63, // E
  4: 349.23, // F
  5: 392.00, // G
  6: 440.00, // A
  7: 493.88, // B
};

function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);
