const API_URL = "https://api.quotable.io/random";

const textSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

let quote = "";
let time = 30;
let timer = 0;
let mistakes = 0;

const generator = async () => {
    let response = await fetch(API_URL);
    let data = await response.json();
    quote = data.content;

    let newQuote = quote.split("").map((value, index) => {
        if (index === quote.length - 1) {
            return "<span class='quote-chars' id='last-char'>" + value + "</span>";
        } else {
            return "<span class='quote-chars'>" + value + "</span>";
        }
    });

    textSection.innerHTML = newQuote.join("");

    const lastChar = document.getElementById("last-char");
    lastChar.addEventListener("animationend", () => {
        document.getElementById("start-test").style.display = "block";
    });
};

userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");
    quoteChars = Array.from(quoteChars);

    let userInputChars = userInput.value.split("");

    quoteChars.forEach((char, index) => {
        if (char.innerText === userInputChars[index]) {
            char.classList.add("success");
        } else if (userInputChars[index] == null) {
            if (char.classList.contains("success")) {
                char.classList.remove("success");
            } else {
                char.classList.remove("fail");
            }
        } else if (userInputChars[index] === " ") {
            if (char.innerText !== " ") {
                char.classList.add("fail");
                mistakes += 1;
                document.getElementById("mistakes").innerHTML = mistakes;
            } else {
                char.classList.remove("fail");
            }
        } else {
            if (!char.classList.contains("fail")) {
                mistakes += 1;
                char.classList.add("fail");
            }
            document.getElementById("mistakes").innerHTML = mistakes;
        }
    });

    let check = quoteChars.every((element) => {
        return element.classList.contains("success");
    });

    if (check && userInput.value.length === quote.length) {
        displayResult();
    }
});

const timeUpdate = () => {
    if (time === 0) {
        displayResult("You are too slow!");
    } else {
        document.getElementById("timer").innerText = --time + " sec";
    }
};

const timeReduce = () => {
    time = 30;
    timer = setInterval(() => {
        if (time === 0) {
            clearInterval(timer);
            displayResult("Time's up!");
        } else {
            timeUpdate();
        }
    }, 1000);
};

const displayOverallStats = () => {
    const overallTimeTaken = (30 - time) / 100;
    const wpm = (userInput.value.length / 5 / overallTimeTaken).toFixed(2);
    const accuracy = userInput.value.length ? Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%" : "0%";

    document.getElementById("wpm").innerText = wpm + " wpm";
    document.getElementById("accuracy").innerText = accuracy;
};

const displayResult = (message) => {
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    timer = 0;
    document.getElementById("stop-test").style.display = "none";
    document.getElementById("restart-test").style.display = "block";
    userInput.disabled = true;

    let timeTaken = (30 - time) / 100;

    if (message) {
        document.getElementById("result-message").innerText = message;
    }

    if (userInput.value.length === quote.length || message === "Time's up!") {
        document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + " wpm";
        document.getElementById("accuracy").innerText = userInput.value.length ? Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%" : "0%";
    } else {
        document.getElementById("wpm").innerText = (userInput.value.length / 5 / (30 / 60)).toFixed(2) + " wpm";
        document.getElementById("accuracy").innerText = userInput.value.length ? Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%" : "0%";
    }
};

const startTest = () => {
    mistakes = 0;
    clearInterval(timer);
    timer = 0;
    time = 30;
    timeUpdate();
    timer = setInterval(timeUpdate, 1000);
    userInput.disabled = false;
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
    document.querySelector(".result").style.display = "none";
    document.getElementById("result-message").innerText = "";
    userInput.focus();
};

const restartTest = () => {
    mistakes = 0;
    clearInterval(timer);
    timer = 0;
    time = 30;
    timeUpdate();
    userInput.disabled = false;
    document.getElementById("stop-test").style.display = "block";
    document.getElementById("restart-test").style.display = "none";
    userInput.value = "";
    userInput.focus();
    document.getElementById("mistakes").innerHTML = 0;
    document.getElementById("timer").innerText = "30 sec";

    setTimeout(() => {
        document.getElementById("start-test").style.display = "block";
        document.getElementById("stop-test").style.display = "none";
    }, 3500);

    generator();
};

window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "none";
    document.getElementById("restart-test").style.display = "none";
    document.querySelector(".result").style.display = "none";
    userInput.disabled = true;

    setTimeout(() => {
        document.getElementById("start-test").style.display = "block";
    }, 3500);

    setTimeout(generator, 3000);
};
