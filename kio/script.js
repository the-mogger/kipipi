
const streetlights = document.querySelectorAll('.streetlight');
const car = document.getElementById('car');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

let carInterval;
let carPosition = -80;

// Function to start the simulation
function startSimulation() {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    carPosition = -80;

    carInterval = setInterval(() => {
        carPosition += 5;
        car.style.left = carPosition + 'px';

        streetlights.forEach((light) => {
            const lightPosition = light.getBoundingClientRect().left + light.offsetWidth / 2;
            if (carPosition + car.offsetWidth >= lightPosition && carPosition <= lightPosition + 10) {
                activateLight(light);
            }
        });

        if (carPosition > window.innerWidth) {
            clearInterval(carInterval);
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }
    }, 30);
}

// Function to stop the simulation
function stopSimulation() {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    clearInterval(carInterval);
    car.style.left = '-80px';
}

// Function to activate streetlight glow
function activateLight(light) {
    light.classList.add('glow');
    setTimeout(() => {
        light.classList.remove('glow');
    }, 1500);
}

// Event listeners for buttons
startBtn.addEventListener('click', startSimulation);
stopBtn.addEventListener('click', stopSimulation);
