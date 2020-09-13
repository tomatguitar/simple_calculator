const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");
const decimalDot = document.querySelector("#decimal");
const clearBtns = document.querySelectorAll(".clear-btn");
const ce = document.querySelector("#ce");
const c = document.querySelector("#c");
const result = document.querySelector("#result");
const display = document.getElementById("display");
let currentMemoryNumber = 0;
let IsNewMemoryNumber = false;
let pendingMemoryOperation = "";

const addButtonsEventListener = (event, cb, buttons) => {
   for (let i = 0; i < buttons.length; i++) {
    let button = buttons[i];
    button.addEventListener(event, (e) => {
      cb(e.target.innerText);
    });
  }
};

const addDecimalDotEventListener = (event, cb, button) => {
  let buttonValue = button.innerText;
  button.addEventListener(event, () => cb(buttonValue));
};

const onNumButtonClick = (number) => {
  if (IsNewMemoryNumber) {
    display.value = number;
    IsNewMemoryNumber = false;
  } else {
    if (display.value === "0") {
      display.value = number;
    } else {
      display.value += number;
    }
  }
};

const onOperatorButtonClick = (operator) => {
  let localOperationMemory = display.value;
  if (IsNewMemoryNumber && pendingMemoryOperation !== "=") {
    display.value = currentMemoryNumber;
  } else {
    IsNewMemoryNumber = true;
    if (pendingMemoryOperation === "+") {
      currentMemoryNumber += +localOperationMemory;
    } else if (pendingMemoryOperation === "-") {
      currentMemoryNumber -= +localOperationMemory;
    } else if (pendingMemoryOperation === "/") {
      currentMemoryNumber /= +localOperationMemory;
    } else if (pendingMemoryOperation === "*") {
      currentMemoryNumber *= +localOperationMemory;
    } else {
      currentMemoryNumber = +localOperationMemory;
    }

    display.value = currentMemoryNumber;
    pendingMemoryOperation = operator;
  }
};

const onDecimalDotButtonClick = () => {
  let localDecimalMemory = display.value;

  if (IsNewMemoryNumber) {
    localDecimalMemory = "0.";
    IsNewMemoryNumber = false;
  } else {
    if (localDecimalMemory.indexOf(".") === -1) {
      localDecimalMemory += ".";
    }
  }
  display.value = localDecimalMemory;
};

const onClearButtonsClick = (id) => {
  if (id == "CE") {
    clearMemory();
    console.log(id);
  } else if (id == "C") {
    clearDisplay();
  }
};

const clearMemory = () => {
  display.value = "0";
  currentMemoryNumber = 0;
  IsNewMemoryNumber = true;
  pendingMemoryOperation = "";
};

const clearDisplay = () => {
  display.value = "0";
  IsNewMemoryNumber = true;
};

addButtonsEventListener("click", onNumButtonClick, numbers);
addButtonsEventListener("click", onOperatorButtonClick, operators);
addButtonsEventListener("click", onClearButtonsClick, clearBtns);
addDecimalDotEventListener("click", onDecimalDotButtonClick, decimalDot);
