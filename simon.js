const plays = [];

let time = 1000;
let userTime = 200;
let currentPlay = 0;

let level = 0;

const timer = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

const simon = document.getElementById("simon");

const yellow = document.getElementById("yellow");
const blue = document.getElementById("blue");
const red = document.getElementById("red");
const green = document.getElementById("green");

const yellowSound = new Audio('audio/yellow.wav');
const blueSound = new Audio('audio/blue.wav');
const redSound = new Audio('audio/red.wav');
const greenSound = new Audio('audio/green.wav');

const nextLVLSound = new Audio('audio/nextLvl.wav');
const failSound = new Audio('audio/fail.wav');

const buttons = [yellow, blue, red, green];
const sounds = [yellowSound, blueSound, redSound, greenSound, nextLVLSound, failSound];

const currentStatus = document.getElementById("currentStatus");
const currentLevel = document.getElementById("level");

const randomPlay = async () => {
    if (time > 250) {
        time-=50;
    }
    const randomNum = randomInt(4);
    if (plays.length > 0) {
        for (let i = 0; i < plays.length; i++) {
            await selectBtn(buttons[plays[i]-1], time);
            await timer(time);
        }
    }
    plays.push(randomNum);
    await selectBtn(buttons[randomNum-1], time);
    simon.style.pointerEvents = "auto";
}

const selectBtn =  async (selectedDiv, duration) => {
    const originalColor = selectedDiv.style.background;
    const soundIndex = buttons.indexOf(selectedDiv);

    await playSound(soundIndex);

    selectedDiv.style.background = "white";
    await timer(duration);
    selectedDiv.style.background = originalColor;
}

const playSound = async (soundIndex) => {
    const sound = sounds[soundIndex];
    if (sound.readyState > 2) {
        try {
            await sound.play();
        } catch (error) {
            console.error("Audio play error:", error);
        }
    } else {
        console.warn("Sound not ready:", sounds[soundIndex]);
    }
}

const randomInt = (max) => Math.floor(Math.random() * max) + 1;

const play = async (btnId) => {
    await selectBtn(buttons[btnId-1], userTime)
    if (btnId === plays[currentPlay]) {
        currentPlay++;

        if (currentPlay === plays.length) {
            simon.style.pointerEvents = "none";
            level++;
            await playSound(4);
            currentLevel.innerText = level;
            currentPlay = 0;
            await timer(time);
            await randomPlay();
        }
    } else {
        currentStatus.innerText = "Game Over";
        await playSound(5);
        await resetGame();
    }
}

const resetGame = async () => {
    simon.style.pointerEvents = "none";
    await timer(time);
    plays.length = 0;
    level = 0;
    time = 1000;
    level = 0;
    currentPlay = 0;
    currentStatus.innerText = '';
    currentLevel.innerText = level;
    await randomPlay();
}

document.addEventListener("click", async () => {
    currentStatus.innerText = '';
    await resetGame();
}, {once: true})

document.addEventListener("DOMContentLoaded", async () => {
    simon.style.pointerEvents = "none";
    currentStatus.innerText = 'Click Anywhere to start!';
    sounds.forEach(sound => sound.load());
})