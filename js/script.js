const MAX_DISPLAY_LENGTH = 12;
const MAX_RESULT = 999999999999.0;
const MIN_RESULT = -999999999999.0;

class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.readyToReset = false;
    this.clear();
  }

  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
  }

  delete() {
    if (this.currentOperand < 0) {
      if (this.currentOperand.toString().length > 2) {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
      } else {
        this.currentOperand = "0";
      }
    } else {
      if (this.currentOperand.toString().length >= 2) {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
      } else {
        this.currentOperand = "0";
      }
    }
  }

  appendNumber(number) {
    let emptyOperand = "";
    if (this.currentOperand.length < MAX_DISPLAY_LENGTH) {
      if (
        (number === "." && this.currentOperand.includes(".")) ||
        (this.currentOperand === "0" && number === "0")
      )
        return;

      if (
        this.currentOperand.length === 1 &&
        this.currentOperand === "0" &&
        number !== "0" &&
        number !== "."
      )
        this.currentOperand = emptyOperand;

      this.currentOperand = this.currentOperand.toString() + number.toString();
    } else {
      this.currentOperand = this.currentOperand;
    }
  }

  chooseOperation(operation) {
    if (this.currentOperand === "" || this.currentOperand === 0) return;
    if (this.currentOperand !== "" && this.previousOperand !== "") {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "÷":
          computation = prev / current;
        break;
      case "pow":
          computation = Math.pow(prev, current);
      case "root":
        computation = Math.pow(prev, 1 / current);
        break;
      default:
        return;
    }
    this.readyToReset = true;

    this.checkResultIsCorrect(computation)
      ? (this.currentOperand = +computation.toFixed(12))
      : this.generateErrorMessage();

    this.operation = undefined;
    this.previousOperand = "";
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(
      this.currentOperand
    );
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = "";
    }
  }

  invertSign() {
    if (parseFloat(this.currentOperand) > 0) {
      this.currentOperand = `-${this.currentOperand}`;
    } else if (parseFloat(this.currentOperand) < 0) {
      this.currentOperand = this.currentOperand.slice(1);
    }
  }

  checkResultIsCorrect(result) {
    if (
      (isNaN(result) && this.operation === "÷") ||
      (isNaN(result) && this.operation === "root")
    ) {
      this.errorMessage = "Ошибка!";
      return false;
    } else if (isNaN(result) && this.operation === "pow") {
      this.errorMessage = "Недопустимый ввод!";
      return false;
    } else if (!isFinite(result) && this.operation === "÷") {
      this.errorMessage = "Бесконечность!";
      return false;
    } else if (result > MAX_RESULT || result < MIN_RESULT) {
      this.errorMessage = "Предел вычисления!";
      return false;
    } else {
      return true;
    }
  }

  generateErrorMessage() {
    errorScreen.textContent = this.errorMessage;
    this.showErrorMessage();
    this.clear();
  }

  showErrorMessage() {
    errorScreen.classList.add("error-screen--visible");
  }

  hideErrorMessage() {
    errorScreen.classList.remove("error-screen--visible");
  }
}

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
const invertSignNumberButton = document.querySelector("[data-invertion]");
const previousOperandTextElement = document.querySelector(
  "[data-previous-operand]"
);
const currentOperandTextElement = document.querySelector(
  "[data-current-operand]"
);
const errorScreen = document.querySelector(".error-screen");

const calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement
);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (
      calculator.previousOperand === "" &&
      calculator.currentOperand !== "" &&
      calculator.readyToReset
    ) {
      calculator.currentOperand = "";
      calculator.readyToReset = false;
    }
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener("click", (button) => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearButton.addEventListener("click", (button) => {
  calculator.hideErrorMessage();
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener("click", (button) => {
  calculator.delete();
  calculator.updateDisplay();
});

invertSignNumberButton.addEventListener("click", (button) => {
  if (calculator.currentOperand !== "" || calculator.currentOperand !== "0") {
    calculator.invertSign();
    calculator.updateDisplay();
  }
});
