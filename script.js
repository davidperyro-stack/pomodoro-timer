let totalSeconds = 25 * 60;
let timerInterval = null;
let isBreak = false;
const focusTime = 25 * 60;
const breakTime = 5 * 60;

function updateDisplay() {
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  document.getElementById("display").textContent =
    minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
  document.getElementById("status").textContent = isBreak ? "Break time!" : "Focus Time";
}

document.getElementById("start").addEventListener("click", function() {
  if (timerInterval !== null) return;
  document.getElementById("start").disabled = true
  timerInterval = setInterval(function() {
    totalSeconds--;
    updateDisplay();
    if (totalSeconds <= 0) {
        timerInterval = null;
        document.getElementById("start").disabled = false;

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
    totalSeconds = 25 * 60;
    updateDisplay();
    document.getElementById("start").disabled = false;
});

document.getElementById("pause").addEventListener("click", function() {
  clearInterval(timerInterval);
  timerInterval = null;
  document.getElementById("start").disabled = false;
});
