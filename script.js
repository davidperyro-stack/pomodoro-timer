let totalSeconds = 25 * 60;
let timerInterval = null;
let isBreak = false;
let focusTime = 25 * 60;
let breakTime = 5 * 60;

const quotes = [
  "One step at a time.",
  "Small progress is still progress.",
  "Discipline beats motivation.",
  "Stay focused!",
  "Remember to drink water."
]

function playBeep() {
  let audioContext = new AudioContext();
  let oscillator = audioContext.createOscillator();
  let gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = "sine";
  oscillator.frequency.value = 800;
  gainNode.gain.value = 0.2;

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.3);
}

function updateDisplay() {
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  document.getElementById("display").textContent =
    minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
  document.getElementById("status").textContent = isBreak ? "Break time!" : "Focus Time";
}

document.getElementById("start").addEventListener("click", function() {
  if (timerInterval !== null) return;
  document.getElementById("start").disabled = true;
  document.getElementById("setTimes").disabled = true;
  document.getElementById("focusInput").disabled = true;
  document.getElementById("breakInput").disabled = true;
  let randomIndex = Math.floor(Math.random() * quotes.length);
  document.getElementById("quote").textContent = quotes[randomIndex];
  timerInterval = setInterval(function() {
    totalSeconds--;
    updateDisplay();
    if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        document.getElementById("start").disabled = false;
        document.getElementById("setTimes").disabled = false;
        document.getElementById("focusInput").disabled = false;
        document.getElementById("breakInput").disabled = false;

        playBeep();

        if (isBreak) {
          alert("Break`s over! Get ready for an other round!");
          isBreak = false;
          totalSeconds = focusTime;
        } else {
          alert("Times up! Go rest a bit, you deserve it!");
          isBreak = true;
          totalSeconds = breakTime;
        }
        updateDisplay();
    }
  }, 1000); 
});

document.getElementById("reset").addEventListener("click", function() {
    clearInterval(timerInterval);
    timerInterval = null;
    totalSeconds = isBreak ? breakTime : focusTime;
    updateDisplay();
    document.getElementById("start").disabled = false;
    document.getElementById("setTimes").disabled = false;
    document.getElementById("focusInput").disabled = false;
    document.getElementById("breakInput").disabled = false;
});

document.getElementById("pause").addEventListener("click", function() {
  clearInterval(timerInterval);
  timerInterval = null;
  document.getElementById("start").disabled = false;
  document.getElementById("setTimes").disabled = false;
  document.getElementById("focusInput").disabled = false;
  document.getElementById("breakInput").disabled = false;
});

document.getElementById("setTimes").addEventListener("click", function() {
  let focusMinutes = document.getElementById("focusInput").value;
  let breakMinutes = document.getElementById("breakInput").value;

  focusTime = focusMinutes * 60;
  breakTime = breakMinutes * 60;

  if (!isBreak) {
    totalSeconds = focusTime;
  } else {
    totalSeconds = breakTime;
  }
  updateDisplay();
});
