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

let currentIndex = 1;

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

currentIndex = 1;

moves = 0;

correctMoves = 0;

totalMoves = 0;

updateStats();

renderBars();
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

insertPosition(i);
};

wrapper.appendChild(bar);

container.appendChild(wrapper);
}
}

/* FIND POSITION */

function correctPosition(){

let key =
array[currentIndex];

for(let i=0; i<currentIndex; i++){

if(key < array[i]){

return i;
}
}

return currentIndex;
}

/* INSERT */

function insertPosition(index){

totalMoves++;

let pos =
correctPosition();

if(index === pos){

document.getElementById(
"correctSound"
).play();

let key =
array[currentIndex];

array.splice(
currentIndex,
1
);

array.splice(
index,
0,
key
);

correctMoves++;

moves++;

currentIndex++;

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

/* FINISH */

function checkFinish(){

if(
currentIndex >=
array.length
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
"Insertion Sort"
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