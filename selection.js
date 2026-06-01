/* LOGIN CHECK */

if(
!localStorage.getItem(
"currentUser"
)
){

window.location.href =
"index.html";
}

let array = [];

let currentIndex = 0;

let minIndex = 0;

let moves = 0;

let correctMoves = 0;

let totalMoves = 0;

/* START */

generateArray();

/* GENERATE */

function generateArray(){

array = [];

let size =
parseInt(
document.getElementById(
"arraySize"
).value
);

let max =
parseInt(
document.getElementById(
"maxValue"
).value
);

if(size < 4){

size = 4;
}

if(size > 15){

size = 15;
}

if(max < 20){

max = 20;
}

for(let i=0; i<size; i++){

array.push(

Math.floor(
Math.random()*max
)+10

);
}

currentIndex = 0;

moves = 0;

correctMoves = 0;

totalMoves = 0;

findMinimum();

updateStats();

renderBars();
}

/* FIND MIN */

function findMinimum(){

minIndex = currentIndex;

for(
let i=currentIndex+1;
i<array.length;
i++
){

if(
array[i] <
array[minIndex]
){

minIndex = i;
}
}
}

/* RENDER */

function renderBars(){

const container =
document.getElementById(
"array-container"
);

container.innerHTML = "";

for(let i=0; i<array.length; i++){

let wrapper =
document.createElement("div");

wrapper.classList.add(
"bar-wrapper"
);

let bar =
document.createElement("div");

bar.classList.add("bar");

bar.style.height =
array[i] * 3 + "px";

bar.innerHTML =
array[i];

if(i < currentIndex){

bar.classList.add(
"correct"
);
}

if(i === currentIndex){

bar.classList.add(
"active"
);
}

bar.onclick = function(){

selectMinimum(i);
};

wrapper.appendChild(bar);

container.appendChild(wrapper);
}
}

/* SELECT */

function selectMinimum(index){

totalMoves++;

if(index === minIndex){

document.getElementById(
"correctSound"
).play();

swap(
currentIndex,
minIndex
);

correctMoves++;

moves++;

currentIndex++;

findMinimum();

updateStats();

renderBars();

checkFinish();
}

else{

document.getElementById(
"wrongSound"
).play();

moves++;

updateStats();
}
}

/* SWAP */

function swap(i,j){

[array[i],array[j]] =
[array[j],array[i]];
}

/* FINISH */

function checkFinish(){

if(
currentIndex >=
array.length - 1
){

finishGame();
}
}

function finishGame(){

let accuracy = Math.floor(

(correctMoves /
totalMoves) * 100

);

if(isNaN(accuracy)){

accuracy = 100;
}

localStorage.setItem(
"accuracy",
accuracy
);

localStorage.setItem(
"completedLevel",
"Selection Sort"
);

let stars = "⭐";

if(accuracy >= 90){

stars = "⭐⭐⭐";
}

else if(accuracy >= 70){

stars = "⭐⭐";
}

localStorage.setItem(
"stars",
stars
);

setTimeout(()=>{

window.location.href =
"result.html";

},1200);
}

/* STATS */

function updateStats(){

document.getElementById(
"moves"
).innerHTML =

"Moves: " + moves;

let accuracy = Math.floor(

(correctMoves /
totalMoves) * 100

);

if(isNaN(accuracy)){

accuracy = 100;
}

document.getElementById(
"accuracy"
).innerHTML =

"Accuracy: " +
accuracy + "%";
}

/* LOGOUT */

function logout(){

localStorage.removeItem(
"currentUser"
);

window.location.href =
"index.html";
}