let array = [];

let currentIndex = 0;

let currentPass = 1;

let correctMoves = 0;

let wrongMoves = 0;

createBubbles();

newGame();

function createBubbles(){

    const bubbleContainer =
    document.querySelector(".bubbles");

    for(let i=0; i<25; i++){

        const bubble =
        document.createElement("span");

        bubble.style.left =
        Math.random()*100 + "%";

        bubble.style.width =
        Math.random()*40 + 20 + "px";

        bubble.style.height =
        bubble.style.width;

        bubble.style.animationDuration =
        Math.random()*10 + 5 + "s";

        bubbleContainer.appendChild(bubble);
    }
}

function newGame(){

    array = [];

    currentIndex = 0;

    currentPass = 1;

    correctMoves = 0;

    wrongMoves = 0;

    let size =
    document.getElementById("sizeSlider").value;

    document.getElementById("sizeValue")
    .innerHTML = size;

    for(let i=0; i<size; i++){

        let value =
        Math.floor(Math.random()*250)+50;

        array.push(value);
    }

    updateUI();

    renderBars();

    document.getElementById("message")
    .innerHTML =
    "Compare the highlighted bars";
}

function renderBars(){

    const container =
    document.getElementById("array-container");

    container.innerHTML = "";

    for(let i=0; i<array.length; i++){

        const bar =
        document.createElement("div");

        bar.classList.add("bar");

        bar.style.height =
        array[i] + "px";

        bar.style.width =
        (700/array.length) + "px";

        bar.innerText =
        array[i];

        if(i === currentIndex ||
           i === currentIndex + 1){

            bar.classList.add("active");
        }

        container.appendChild(bar);
    }
}

function makeMove(playerWantsSwap){

    let left = array[currentIndex];

    let right = array[currentIndex + 1];

    let shouldSwap = left > right;

    if(playerWantsSwap === shouldSwap){

        correctMoves++;

document.getElementById(
"correctSound"
).play();
        document.getElementById("message")
        .innerHTML =
        "✅ Correct Move!";

        if(shouldSwap){

            let temp = array[currentIndex];

            array[currentIndex] =
            array[currentIndex + 1];

            array[currentIndex + 1] =
            temp;
        }

        nextStep();

        updateUI();

        renderBars();
    }
    else{

        wrongMoves++;
        document.getElementById(
"wrongSound"
).play();

        document.getElementById("message")
        .innerHTML =
        shouldSwap
        ? "❌ Wrong! You should SWAP."
        : "❌ Wrong! You should SKIP.";

        shakeBars();

        setTimeout(() => {

            renderBars();

        }, 500);

        updateUI();

        return;
    }
}

function shakeBars(){

    const bars =
    document.getElementsByClassName("bar");

    bars[currentIndex]
    .classList.add("wrong");

    bars[currentIndex + 1]
    .classList.add("wrong");

    setTimeout(() => {

        bars[currentIndex]
        .classList.remove("wrong");

        bars[currentIndex + 1]
        .classList.remove("wrong");

    }, 500);
}

function nextStep(){

    currentIndex++;

    if(currentIndex >= array.length - currentPass){

        currentIndex = 0;

        currentPass++;

        document.getElementById("message")
        .innerHTML =
        "🔁 Pass Complete!";
    }

    if(checkSorted()){

        renderSortedBars();

        showFinalResult();
    }
}

function renderSortedBars(){

    const bars =
    document.getElementsByClassName("bar");

    for(let i=0; i<bars.length; i++){

        bars[i].classList.remove("active");

        bars[i].classList.add("correct");
    }
}

function updateUI(){

    document.getElementById("pass")
    .innerHTML =
    "Pass: " + currentPass;

    let total =
    correctMoves + wrongMoves;

    let accuracy =
    total === 0
    ? 100
    : Math.floor((correctMoves/total)*100);

    document.getElementById("accuracy")
    .innerHTML =
    "Accuracy: " + accuracy + "%";

    let stars = "⭐";

    if(accuracy >= 90){

        stars = "⭐⭐⭐";
    }
    else if(accuracy >= 70){

        stars = "⭐⭐";
    }

    document.getElementById("stars")
    .innerHTML = stars;
}

function checkSorted(){

    for(let i=0; i<array.length-1; i++){

        if(array[i] > array[i+1]){

            return false;
        }
    }

    return true;
}
document.getElementById(
"winSound"
).play();
function showFinalResult(){

    let total =
    correctMoves + wrongMoves;

    let accuracy =
    Math.floor((correctMoves/total)*100);

    let stars = "⭐";

    if(accuracy >= 90){

        stars = "⭐⭐⭐";
    }
    else if(accuracy >= 70){

        stars = "⭐⭐";
    }

    localStorage.setItem(
        "accuracy",
        accuracy
    );
    localStorage.setItem(
"completedLevel",
"Bubble Sort"
);

    localStorage.setItem(
        "stars",
        stars
    );

    setTimeout(() => {

        window.location.href =
        "result.html";

    }, 1500);
}

document.getElementById("sizeSlider")
.addEventListener("input", newGame);
function logout(){

localStorage.removeItem(
"currentUser"
);

window.location.href =
"index.html";
}