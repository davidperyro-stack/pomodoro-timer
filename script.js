let totalSeconds = 25 * 60;
let timerInterval = null;
let isBreak = false;
let focusTime = 25 * 60;
let breakTime = 5 * 60;
let savedTasks = localStorage.getItem("tasks");
let tasks = savedTasks !== null ? JSON.parse(savedTasks) : [];
let savedFocus = localStorage.getItem("focusMinutes");
let savedBreak = localStorage.getItem("breakMinutes");

if (savedFocus !== null) {
  focusTime = savedFocus * 60;
  totalSeconds = focusTime;
  document.getElementById("focusInput").value = savedFocus;
}

if (savedBreak !== null) {
  breakTime = savedBreak * 60;
  document.getElementById("breakInput").value = savedBreak;
}

updateDisplay();

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
  let timeString = minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
  document.getElementById("display").textContent = timeString;
  document.getElementById("status").textContent = isBreak ? "Break time!" : "Focus Time";
  document.title = timeString + " - " + (isBreak ? "Break" : "Focus");
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
          isBreak = false;
          totalSeconds = focusTime;
        } else {
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

  localStorage.setItem("focusMinutes", focusMinutes);
  localStorage.setItem("breakMinutes", breakMinutes);

  if (!isBreak) {
    totalSeconds = focusTime;
  } else {
    totalSeconds = breakTime;
  }
  updateDisplay();
});

document.getElementById("addTask").addEventListener("click", function() {
  let taskText = document.getElementById("taskInput").value.trim();
  if (taskText === "") return;

  tasks.push({ text: taskText, done: false });
  document.getElementById("taskInput").value = "";
  renderTasks();
});

function renderTasks() {
  let taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach(function(task, index) {
    let li = document.createElement("li");

    let taskSpan = document.createElement("span");
    taskSpan.textContent = task.text;

    if (task.done) {
      taskSpan.style.textDecoration = "line-through";
      taskSpan.style.color = "#666";
    }
    taskSpan.addEventListener("click", function() {
      task.done = !task.done;
      renderTasks();
    });

    li.appendChild(taskSpan);

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "x";
    deleteBtn.addEventListener("click", function() {
      tasks.splice(index, 1);
      renderTasks();
    });
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

renderTasks();

document.addEventListener("keydown", function(event) {
  if (event.key === " ") {
    event.preventDefault();
    if (timerInterval === null) {
      document.getElementById("start").click();
    } else {
      document.getElementById("pause").click();
    }
  }

  if (event.key === "r") {
    document.getElementById("reset").click();
  }
});
