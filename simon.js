const plays = [];

let time = 1000;
const userTime = 150;
const transitionTimer = 1500;
let currentPlay = 0;

let level = 0;

const timer = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

const simon = document.getElementById("simon");
const mainMenu = document.getElementById("main");
mainMenu.style.display = 'flex'

const game = document.getElementById("game");
game.style.display = 'none';

const endScreen = document.getElementById("end");
endScreen.style.display = 'none';

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

let selectedDifficulty = 1;
const difficultyStatic = document.querySelectorAll('.selectedDifficulty');
let difficultyTimer = time;

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

    if (selectedDifficulty !== 4) {
        selectedDiv.style.background = "white";
        await timer(duration)
        selectedDiv.style.background = originalColor;
    }
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
            await nextLevel();
        }
    } else {
        currentStatus.innerText = "Game Over";
        await playSound(5);
        await endGame();
    }
}

const transition = async () => {
    await timer(transitionTimer);
}

const nextLevel = async () => {
    await playSound(4);

    simon.style.pointerEvents = "none";
    level++;
    currentLevel.innerText = level;
    currentPlay = 0;
    currentStatus.innerText = 'Level Up!';
    await transition();
    currentStatus.innerText = '';
    await randomPlay();
}

const resetGame = async () => {
    simon.style.pointerEvents = "none";
    plays.length = 0;
    level = 0;
    time = difficultyTimer;
    currentPlay = 0;
    currentStatus.innerText = '';
    currentLevel.innerText = level;
}

const setDifficulty = (difficulty) => {
    let selection;
    switch (difficulty) {
        case 1:
            difficultyTimer = 1000;
            selection = "Easy";
            break;
        case 2:
            difficultyTimer = 500;
            selection = "Medium";
            break;
        case 3:
            difficultyTimer = 250;
            selection = "Hard";
            break;
        case 4:
            difficultyTimer = 150;
            selection = ':D';
            break;
        default:
            difficultyTimer = 1000;
            break;
    }
    difficultyStatic.forEach(e => e.innerText = selection);
}

const setSelectedDifficulty = (difficulty) => {
    setDifficulty(difficulty);
    selectedDifficulty = difficulty;
}

const toggleDisplay = (element, displayType = 'flex', desiredType = 'none') => {
    if (element.style.display === desiredType) {
        element.style.display = displayType;
    }
};

const startGame = async () => {
    toggleDisplay(mainMenu, 'none', 'flex');
    toggleDisplay(game);
    await resetGame();
    await transition();
    await randomPlay();
};

const endGame = async () => {
    toggleDisplay(game, 'none', 'flex');
    toggleDisplay(endScreen, 'flex', 'none');
    currentStatus.innerText = '';
    document.getElementById("lvlReached").innerText = level;
};

const replay = async () => {
    toggleDisplay(endScreen, 'none', 'flex');
    await startGame();
};


const returnToMainMenu = () => {
    toggleDisplay(endScreen, 'none', 'flex');
    toggleDisplay(mainMenu);
};

document.addEventListener("DOMContentLoaded", async () => {
    simon.style.pointerEvents = "none";
    sounds.forEach(sound => sound.load());
})