const MIN_NUMBER = 1;
const MAX_NUMBER = 100;

let targetNumber;
let userGuesses = [];
let attempts = 0;
let gameOver = false;

const guessInput = document.getElementById("guessInput");
const submitButton = document.getElementById("submitButton");
const feedback = document.getElementById("feedback");
const attemptsDisplay = document.getElementById("attemptsDisplay");
const previousGuesses = document.getElementById("previousGuesses");
const resetButton = document.getElementById("resetButton");

function startNewGame() {
    targetNumber =
        Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) +
        MIN_NUMBER;

    userGuesses = [];
    attempts = 0;
    gameOver = false;

    guessInput.value = "";
    guessInput.disabled = false;
    submitButton.disabled = false;

    feedback.textContent = `Guess a number between ${MIN_NUMBER} and ${MAX_NUMBER}.`;
    attemptsDisplay.textContent = "Attempts: 0";
    previousGuesses.textContent = "";

    resetButton.style.display = "none";

    saveGame();

    guessInput.focus();

    console.log("New game started!");
}

function validateInput(value) {

    if (value.trim() === "") {
        return {
            valid: false,
            message: "Please enter a number."
        };
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return {
            valid: false,
            message: "Please enter a valid number."
        };
    }

    if (!Number.isInteger(number)) {
        return {
            valid: false,
            message: "Please enter a whole number."
        };
    }

    if (number < MIN_NUMBER || number > MAX_NUMBER) {
        return {
            valid: false,
            message: `Please enter a number between ${MIN_NUMBER} and ${MAX_NUMBER}.`
        };
    }

    return {
        valid: true,
        number: number
    };
}


function checkGuess() {

    if (gameOver) {
        return;
    }

    const inputValue = guessInput.value;

    const validation = validateInput(inputValue);

    if (!validation.valid) {
        feedback.textContent = validation.message;
        return;
    }

    const guess = validation.number;

    attempts++;

    userGuesses.push(guess);

    attemptsDisplay.textContent = `Attempts: ${attempts}`;

    displayPreviousGuesses();


    if (guess === targetNumber) {

        feedback.textContent =
            `🎉 Correct! The number was ${targetNumber}. You guessed it in ${attempts} attempt${attempts > 1 ? "s" : ""}!`;

        gameOver = true;

        guessInput.disabled = true;
        submitButton.disabled = true;

        resetButton.style.display = "inline-block";

    } else if (guess < targetNumber) {

        feedback.textContent = "📉 Too low! Try a higher number.";

    } else {

        feedback.textContent = "📈 Too high! Try a lower number.";
    }

    guessInput.value = "";

    saveGame();

    if (!gameOver) {
        guessInput.focus();
    }
}


function displayPreviousGuesses() {

    previousGuesses.innerHTML = "";

    userGuesses.forEach((guess, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Attempt ${index + 1}: ${guess}`;
        previousGuesses.appendChild(listItem);
    });
}

function saveGame() {

    const gameData = {
        targetNumber: targetNumber,
        userGuesses: userGuesses,
        attempts: attempts,
        gameOver: gameOver
    };

    localStorage.setItem(
        "numberGuessingGame",
        JSON.stringify(gameData)
    );
}

function loadGame() {

    const savedGame = localStorage.getItem("numberGuessingGame");

    if (!savedGame) {
        startNewGame();
        return;
    }

    try {

        const gameData = JSON.parse(savedGame);

        targetNumber = gameData.targetNumber;
        userGuesses = gameData.userGuesses || [];
        attempts = gameData.attempts || 0;
        gameOver = gameData.gameOver || false;

        attemptsDisplay.textContent = `Attempts: ${attempts}`;

        displayPreviousGuesses();

        if (gameOver) {

            feedback.textContent =
                `🎉 Game completed! The number was ${targetNumber}.`;

            guessInput.disabled = true;
            submitButton.disabled = true;

            resetButton.style.display = "inline-block";

        } else {

            feedback.textContent =
                `Guess a number between ${MIN_NUMBER} and ${MAX_NUMBER}.`;
            guessInput.disabled = false;
            submitButton.disabled = false;
            resetButton.style.display = "none";
        }

    } catch (error) {

        console.error("Error loading saved game:", error);

        startNewGame();
    }
}

submitButton.addEventListener("click", checkGuess);
resetButton.addEventListener("click", startNewGame);
guessInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        checkGuess();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    loadGame();
});