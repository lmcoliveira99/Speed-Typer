const API_URL = "https://api.quotable.io/random";

const textSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

let quote = "";
let time = 60;
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

    // Add an event listener for the animationend event on the last character
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
                // Check for space and handle accordingly (if user forgets to press space)
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
    if (check) {
        displayResult();
    }
});

function timeUpdate() {
    if (time == 0) {
        displayResult();
    }
    else {
        document.getElementById("timer").innerText = --time + " sec"; // Fix timer display logic
    }
}

const timeReduce = () => {
    time = 60;
    timer = setInterval(timeUpdate, 1000);
}

const displayResult = () => {
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    timer = 0;
    document.getElementById("stop-test").style.display = "none";
    document.getElementById("restart-test").style.display = "block";
    userInput.disabled = true;

    let timeTaken = 1;
    if (timer != 0) {
        timeTaken = (60 - time) / 100;
    }
    document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + (" wpm");
    document.getElementById("accuracy").innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%";
};

const startTest = () => {
    mistakes = 0;
    clearInterval(timer); // Clear any existing timer
    timer = 0; // Reset timer to 0
    timeReduce(); // Start the timer
    userInput.disabled = false;
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
    userInput.focus();
};
const restartTest = () => {
    mistakes = 0;
    clearInterval(timer);
    timer = 0;
    timeReduce();
    userInput.disabled = false;
    document.getElementById("restart-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
    userInput.value = "";
    userInput.focus();
    document.getElementById("mistakes").innerHTML = 0; // Reset mistakes display
    document.getElementById("timer").innerText = "60 sec"; // Reset timer display
    generator(); // Fetch a new random quote
};

window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "none";
    document.getElementById("restart-test").style.display = "none";
    userInput.disabled = true;
    setTimeout(() => {
        document.getElementById("start-test").style.display = "block";
    }, 3500);
    setTimeout(generator, 3000);
};