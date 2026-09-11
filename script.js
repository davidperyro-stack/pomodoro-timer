let totalSeconds = 25 * 60;
let timerInterval = null;

function updateDisplay() {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    document.getElementById("display").textContent =
        minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
}

document.getElementById("start").addEventListener("click", function() {
  if (timerInterval !== null) return;
  timerInterval = setInterval(function() {
    totalSeconds--;
    updateDisplay();
    if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        alert("Times up! go rest a bit, you deserve it!")
    }
  }, 1000); 
});
