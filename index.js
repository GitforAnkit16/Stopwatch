let startTime, updatedTime, difference, tInterval;
let running = false;
let lapCounter = 0;
let lastLapTime = 0;

const startStopBtn = document.getElementById('startStopBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const timeDisplay = document.querySelector('.time-display');
const lapsList = document.getElementById('lapsList');
const exportBtn = document.getElementById('exportBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const startSound = document.getElementById('startSound');
const lapSound = document.getElementById('lapSound');
const resetSound = document.getElementById('resetSound');

function startStopwatch() {
    if (!running) {
        startSound.play();
        startTime = new Date().getTime() - (difference || 0);
        tInterval = setInterval(updateTime, 10);
        startStopBtn.textContent = 'Pause';
        running = true;
    } else {
        clearInterval(tInterval);
        startStopBtn.textContent = 'Start';
        running = false;
    }
}

function updateTime() {
    updatedTime = new Date().getTime();
    difference = updatedTime - startTime;
    
    let hours = Math.floor(difference / (1000 * 60 * 60));
    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((difference % (1000 * 60)) / 1000);
    let milliseconds = Math.floor((difference % 1000) / 10);
    
    timeDisplay.textContent = 
        (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + 
        (minutes > 9 ? minutes : "0" + minutes) + ":" + 
        (seconds > 9 ? seconds : "0" + seconds) + "." + 
        (milliseconds > 9 ? milliseconds : "0" + milliseconds);
}

function resetStopwatch() {
    resetSound.play();
    clearInterval(tInterval);
    startTime = undefined;
    difference = 0;
    running = false;
    startStopBtn.textContent = 'Start';
    timeDisplay.textContent = "00:00:00.00";
    lapsList.innerHTML = '';
    lapCounter = 0;
    lastLapTime = 0;
    saveLaps();
}

function recordLap() {
    if (running) {
        lapSound.play();
        lapCounter++;
        const currentTime = difference;
        const lapDiff = currentTime - lastLapTime;
        lastLapTime = currentTime;

        const lapTime = document.createElement('li');
        lapTime.textContent = `Lap ${lapCounter}: ${timeDisplay.textContent} (+${formatTime(lapDiff)})`;
        lapsList.appendChild(lapTime);
        saveLaps();
    }
}

function formatTime(milliseconds) {
    let hours = Math.floor(milliseconds / (1000 * 60 * 60));
    let minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    let ms = Math.floor((milliseconds % 1000) / 10);

    return (
        (hours ? (hours > 9 ? hours
            : "0" + hours) : "00") + ":" +
            (minutes > 9 ? minutes : "0" + minutes) + ":" +
            (seconds > 9 ? seconds : "0" + seconds) + "." +
            (ms > 9 ? ms : "0" + ms)
        );
    }
    
    function saveLaps() {
        const laps = Array.from(document.querySelectorAll('#lapsList li')).map(li => li.textContent);
        localStorage.setItem('laps', JSON.stringify(laps));
    }
    

    function loadLaps() {
        const savedLaps = JSON.parse(localStorage.getItem('laps') || '[]');
        savedLaps.forEach(lapText => {
            const lap = document.createElement('li');
            lap.textContent = lapText;
            lapsList.appendChild(lap);
        });
    }
    

    function exportLapsAsCSV() {
        let csvContent = "data:text/csv;charset=utf-8,";
        const laps = Array.from(document.querySelectorAll('#lapsList li')).map(li => li.textContent);
        csvContent += laps.join("\n");
    
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "lap_times.csv");
        document.body.appendChild(link);
    
        link.click();
        document.body.removeChild(link);
    }

    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        document.querySelector('.stopwatch').classList.toggle('dark-mode');
    });
    
    
    startStopBtn.addEventListener('click', startStopwatch);
    resetBtn.addEventListener('click', resetStopwatch);
    lapBtn.addEventListener('click', recordLap);
    exportBtn.addEventListener('click', exportLapsAsCSV);
    window.onload = loadLaps;
    