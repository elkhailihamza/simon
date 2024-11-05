const plays = [];

let time = 1000;
const userTime = 125;
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
const effect = document.getElementById("effect");

let selectedDifficulty = 1;
const difficultyStatic = document.querySelectorAll('.selectedDifficulty');
let difficultyTimer = time;

const randomInt = (max) => Math.floor(Math.random() * max) + 1;

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

let isSelected = false;
let invisibilityEffectMet = false;

const selectBtn = async (selectedDiv, duration) => {
    const soundIndex = buttons.indexOf(selectedDiv);
    await playSound(soundIndex);
    if (isSelected) return;

    isSelected = true;
    const originalColor = selectedDiv.style.background;

    if (selectedDifficulty === 4 && level >= 5) {
        if (!invisibilityEffectMet) {
            await writeEffect('Invisibility');
            invisibilityEffectMet = true;
        }
        return;
    }

    selectedDiv.style.background = "white";
    await timer(duration)
    selectedDiv.style.background = originalColor;
    isSelected = false;
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

    if (selectedDifficulty === 4) {
        if (level === 10) {
            simon.classList.add('rotate');
            await writeEffect('Spin');
        }
        if (level % 5 === 0 && level >= 15) {
            let currentDuration = parseFloat(simon.style.animationDuration);
            simon.style.animationDuration = (currentDuration - 1) + 's';
            await writeEffect('Speed Up!');
        }
    }

    currentLevel.innerText = level;
    currentPlay = 0;
    currentStatus.innerText = 'Level Up!';
    await transition();
    currentStatus.innerText = '';
    await randomPlay();
}

const resetGame = async () => {
    simon.style.pointerEvents = "none";
    simon.classList.remove("rotate");
    plays.length = 0;
    level = 0;
    time = difficultyTimer;
    currentPlay = 0;
    currentStatus.innerText = '';
    currentLevel.innerText = level;
}

const setDifficulty = async (difficulty) => {
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
            difficultyTimer = 200;
            selection = ':D';
            break;
        default:
            difficultyTimer = 1000;
            break;
    }
    difficultyStatic.forEach(e => e.innerText = selection);
}

const setSelectedDifficulty = async (difficulty) => {
    await setDifficulty(difficulty);
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

const writeEffect = async (effectStr) => {
    effect.innerText = 'Effect: ' + effectStr;
    await timer(transitionTimer);
    effect.innerText = '';
}

document.addEventListener("DOMContentLoaded", async () => {
    simon.style.pointerEvents = "none";
    sounds.forEach(sound => sound.load());
})
