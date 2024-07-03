let gameName = `Guess the <span class="word">Word</span> Game`;
let title = document.querySelector("title");
let footer = document.querySelector("footer h5");
let header = document.querySelector("header h1");
let inputContainer = document.querySelector(".inputs-container");
let btnCheck = document.querySelector(".check");
let btnHint = document.querySelector(".hint");
let gameMsg = document.querySelector(".gameMsg");

title.innerHTML = "Guess the Word Game";
header.innerHTML = gameName;
footer.innerHTML = `${gameName} - ${new Date().getFullYear()} - Created By Mnsa &copy;`;

// Game Settings
let qtyTries = 6;
let qtyLetters = 6;
let currentTry = 1;
let qtyOfHints = 2;

// Manage Words
let wordToGuess = "";
const words = [
  "Create",
  "Update",
  "Delete",
  "Branch",
  "Mainly",
  "Elzero",
  "School",
];

// Generate Word
let randomWord =
  words[Math.floor(Math.random() * words.length)].toLocaleLowerCase();
// console.log(randomWord);
gameMsg.innerHTML = `Guess The Word [${randomWord}]`;

// Generate Inputs
function generateInputs() {
  // Create Inputs
  for (let i = 1; i <= qtyTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<h4>Try ${i}</h4>`;

    //   Disabled all tries except the first
    if (i !== 1) {
      tryDiv.classList.add("disabled");
    }

    for (let j = 1; j <= qtyLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      input.classList.add(`input-${j}`);
      tryDiv.appendChild(input);
    }
    inputContainer.appendChild(tryDiv);
  }

  //   Focus on first input
  inputContainer.children[0].children[1].focus();

  // disable all input except first one
  const disInputs = document.querySelectorAll(".disabled input");
  disInputs.forEach((input) => (input.disabled = true));
  //   console.log(disInputs);

  //   Manage Inputs
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    // Convert inputs to Upper case
    input.addEventListener("input", () => {
      input.value = input.value.toUpperCase();
      //   Go to next input
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus();
    });

    //   Manage Arrows & Backspace Keys
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        const nextInput = inputs[index + 1];
        if (nextInput) nextInput.focus();
      } else if (e.key === "ArrowLeft") {
        const prevInput = inputs[index - 1];
        if (prevInput) prevInput.focus();
      }
      if (e.key === "Backspace") {
        const currentInput = inputs[index];
        const prevInput = inputs[index - 1];
        if (prevInput) {
          currentInput.value = "";
          prevInput.value = "";
          prevInput.focus();
        }
      }
    });
  });
}

//   Check Button
btnCheck.addEventListener("click", handelGuess);

function handelGuess() {
  let success = true;
  for (let i = 1; i <= qtyLetters; i++) {
    const inputField = document.querySelector(`.input-${i}`);
    const letter = inputField.value.toLocaleLowerCase();
    const actualLetter = randomWord[i - 1];
    if (letter === actualLetter) {
      inputField.classList.add("in-place");
    } else if (randomWord.includes(letter)) {
      inputField.classList.add("not-place");
      success = false;
    } else {
      inputField.classList.add("no");
      success = false;
    }
  }

  //   Check if user win or lose
  if (success) {
    const msgWord = document.querySelector(".msg-word");
    gameMsg.innerHTML = `You Win </br> The Word Is <span class="msg-word">[${randomWord}]</span>`;
    // msgWord.style.backgroundColor = "green";
    gameMsg.style.background = "green";
    if (qtyOfHints === 2) {
      gameMsg.innerHTML += `</br> <p>You Have ${qtyOfHints} hint left</p>`;
    }
    // Add Disable class on all tries
    let allTries = document.querySelector(".inputs > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled"));

    // Disable Check & Hint Buttons
    btnCheck.disabled = true;
    btnHint.disabled = true;
  } else {
    document.querySelector(`.try-${currentTry}`).classList.add("disabled");
    const currentTryInputs = document.querySelectorAll(
      `.try-${currentTry} input`
    );
    currentTryInputs.forEach((input) => (input.disabled = true));

    currentTry++;

    const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    nextTryInputs.forEach((input) => (input.disabled = false));

    let el = document.querySelector(`.try-${currentTry}`);
    if (el) {
      document.querySelector(`.try-${currentTry}`).classList.remove("disabled");
      el.children[1].focus();
      // console.log(el.children[1]);
    } else {
      // Disable Check & Hint Buttons
      btnCheck.disabled = true;
      btnHint.disabled = true;
      gameMsg.innerHTML = `You Lose </br> The Word Is <span class="msg-word">[${randomWord}]</span>`;
      gameMsg.style.background = "red";
    }
  }
}

//   Hint Button
document.querySelector(".hint span").innerHTML = qtyOfHints;
btnHint.addEventListener("click", handelHint);

//   Hint Function
function handelHint() {
  if (qtyOfHints > 0) {
    qtyOfHints--;
    document.querySelector(".hint span").innerHTML = qtyOfHints;
  }
  if (qtyOfHints === 0) btnHint.disabled = true;

  // Select All Enabled Inputs
  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  const emptyEnabledInputs = Array.from(enabledInputs).filter(
    (input) => input.value === ""
  );

  //
  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
    if (indexToFill !== -1) {
      randomInput.value = randomWord[indexToFill].toUpperCase();
    }
  }
}

window.onload = function () {
  generateInputs();
};
