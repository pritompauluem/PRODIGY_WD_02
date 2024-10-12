let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let lapCount = 1;
let lapData = [];
const display = document.getElementById("display");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const lapBtn = document.getElementById("lap-btn");
const lapTimes = document.getElementById("lap-times");
const circle = document.querySelector(".circle");
const pulse = document.querySelector(".pulse");
const downloadBtn = document.getElementById("download-btn");

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
lapBtn.addEventListener("click", recordLap);
downloadBtn.addEventListener("click", downloadCSV);

function startTimer() {
  startTime = Date.now() - elapsedTime;
  timerInterval = requestAnimationFrame(updateTimer);
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  circle.style.display = "block";
  pulse.style.display = "block";
}

function pauseTimer() {
  cancelAnimationFrame(timerInterval);
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  circle.style.display = "none";
  pulse.style.display = "none";
}

function resetTimer() {
  cancelAnimationFrame(timerInterval);
  startTime = 0;
  elapsedTime = 0;
  lapCount = 1;
  lapData = [];
  display.textContent = "00:00:00.000";
  lapTimes.innerHTML = "";
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  circle.style.display = "none";
  pulse.style.display = "none";
}

function recordLap() {
  const lapTime = formatTime(elapsedTime);
  const lapListItem = document.createElement("LI");
  lapListItem.textContent = `Lap ${lapCount}: ${lapTime}`;
  lapTimes.insertBefore(lapListItem, lapTimes.firstChild);

  lapData.push({
    lapNumber: lapCount,
    lapTime: lapTime,
    totalTime: formatTime(elapsedTime),
  });

  lapCount++;
}

function updateTimer() {
  elapsedTime = Date.now() - startTime;
  display.textContent = formatTime(elapsedTime);
  timerInterval = requestAnimationFrame(updateTimer);
}

function formatTime(time) {
  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = Math.floor(time % 1000);
  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}.${padZero(
    milliseconds,
    3
  )}`;
}

function padZero(value, length = 2) {
  return value.toString().padStart(length, "0");
}

function downloadCSV() {
  if (lapData.length === 0) {
    alert("No lap data to download.");
    return;
  }

  const csvContent =
    "data:text/csv;charset=utf-8," +
    "Lap Number,Lap Time,Total Time\n" +
    lapData
      .map((row) => `${row.lapNumber},${row.lapTime},${row.totalTime}`)
      .join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "stopwatch_lap_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
