if(
!localStorage.getItem(
"currentUser"
)
){
window.location.href =
"index.html";
}

/* ================= VARIABLES ================= */

let originalArray = [];

let levels = [];

let phase = "split";

let totalMoves = 0;

let correctMoves = 0;

let mergeStages = [];

let currentStage = 0;

let currentPair = 0;

let splitDepth = 0;

/* ================= START ================= */

function startGame(){

phase = "split";

levels = [];

mergeStages = [];

currentStage = 0;

currentPair = 0;

splitDepth = 0;

totalMoves = 0;

correctMoves = 0;

generateArray();

buildInitialLevel();

render();

updateAccuracy();

document.getElementById(
"phase"
).innerHTML =
"Phase: Splitting";

document.getElementById(
"message"
).innerHTML =
"Split arrays into single values";
}

/* ================= GENERATE ARRAY ================= */

function generateArray(){

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

originalArray = [];

for(let i=0;i<size;i++){

originalArray.push(

Math.floor(
Math.random()*max
)+1

);
}
}

/* ================= INITIAL LEVEL ================= */

function buildInitialLevel(){

levels = [

[
{
array:originalArray,
split:false
}
]

];
}

/* ================= RENDER ================= */

function render(){

const container =
document.getElementById(
"treeContainer"
);

container.innerHTML = "";

/* LEVEL LOOP */

levels.forEach((level)=>{

let row =
document.createElement("div");

row.className = "level";

/* GROUP LOOP */

level.forEach((group)=>{

let box =
document.createElement("div");

box.className = "array-box";

/* ================= ACTIVE PAIRS ================= */

if(
phase === "merge"
&& currentStage < mergeStages.length
){

let pair =
mergeStages[currentStage][currentPair];

if(pair){

if(

sameArray(
group.array,
pair.fullLeft
)

||

sameArray(
group.array,
pair.fullRight
)

){

box.classList.add(
"active"
);
}
}
}

/* VALUE LOOP */

group.array.forEach((num,index)=>{

let value =
document.createElement("div");

value.className = "value";

/* SINGLE */

if(group.single){

value.classList.add(
"single"
);
}

/* MERGED */

if(group.merged){

value.classList.add(
"merged"
);
}

/* ================= MERGE CLICK ================= */

if(
phase === "merge"
&& currentStage < mergeStages.length
){

value.classList.add(
"clickable"
);

value.onclick = ()=>{

selectMergeValue(num);
};
}

/* NUMBER */

value.innerHTML = num;

box.appendChild(value);

/* ================= SPLIT OPTION ================= */

if(

phase === "split"
&& !group.split
&& group.array.length > 1
&& index < group.array.length - 1

){

let split =
document.createElement("div");

split.className = "split";

split.innerHTML = "|";

split.onclick = ()=>{

splitArray(
group,
index + 1
);
};

box.appendChild(split);
}
});

/* APPEND BOX */

row.appendChild(box);
});

/* APPEND ROW */

container.appendChild(row);
});
}

/* ================= SAME ARRAY ================= */

function sameArray(a,b){

if(!a || !b){

return false;
}

if(a.length !== b.length){

return false;
}

for(let i=0;i<a.length;i++){

if(a[i] !== b[i]){

return false;
}
}

return true;
}

/* ================= SPLIT ================= */

function splitArray(
group,
position
){

let middle =
Math.floor(
group.array.length / 2
);

totalMoves++;

if(position !== middle){

updateAccuracy();

document.getElementById(
"message"
).innerHTML =
"❌ Split only in middle";

return;
}

correctMoves++;
document.getElementById(
"correctSound"
).currentTime = 0;

document.getElementById(
"correctSound"
).play();
group.split = true;

let left =
group.array.slice(
0,
middle
);

let right =
group.array.slice(
middle
);

let nextLevel =
levels.findIndex(level=>
level.includes(group)
);

if(!levels[nextLevel+1]){

levels[nextLevel+1] = [];
}

levels[nextLevel+1].push({

array:left,

split:false,

single:left.length === 1
});

levels[nextLevel+1].push({

array:right,

split:false,

single:right.length === 1
});

updateAccuracy();

render();

checkSplitComplete();
}

/* ================= CHECK SPLIT ================= */

function checkSplitComplete(){

let done = true;

levels.forEach(level=>{

level.forEach(group=>{

if(
group.array.length > 1
&& !group.split
){

done = false;
}
});
});

if(done){

splitDepth =
levels.length - 1;

startMergePhase();
}
}

/* ================= START MERGE ================= */

function startMergePhase(){

phase = "merge";

document.getElementById(
"phase"
).innerHTML =
"Phase: Merging";

document.getElementById(
"message"
).innerHTML =
"Merge arrays in sorted order";

buildMergeStages();

render();
}

/* ================= BUILD MERGE STAGES ================= */

function buildMergeStages(){

mergeStages = [];

let current =
levels[
levels.length - 1
].map(x=>x.array);

while(current.length > 1){

let stage = [];

let next = [];

for(let i=0;i<current.length;i+=2){

if(current[i+1]){

let left =
[...current[i]];

let right =
[...current[i+1]];

stage.push({

left:[...left],

right:[...right],

result:[],

fullLeft:[...left],

fullRight:[...right]

});

next.push(

[...left,...right]
.sort((a,b)=>a-b)

);
}
}

mergeStages.push(stage);

current = next;
}
}

/* ================= EXPECTED VALUE ================= */

function getExpectedValue(pair){

if(pair.left.length === 0){

return pair.right[0];
}

if(pair.right.length === 0){

return pair.left[0];
}

return Math.min(
pair.left[0],
pair.right[0]
);
}

/* ================= SELECT VALUE ================= */

function selectMergeValue(num){

if(
currentStage >= mergeStages.length
){

return;
}

let pair =
mergeStages[currentStage][currentPair];

let expected =
getExpectedValue(pair);

totalMoves++;

if(num !== expected){

updateAccuracy();

document.getElementById(
"message"
).innerHTML =
"❌ Wrong choice";
document.getElementById(
"wrongSound"
).play();

return;
}

correctMoves++;

/* CORRECT SOUND */

document.getElementById(
"correctSound"
).play();

document.getElementById(
"message"
).innerHTML =
"✅ Correct";
/* REMOVE FROM LEFT */

if(
pair.left.length > 0
&& pair.left[0] === num
){

pair.left.shift();
}

/* REMOVE FROM RIGHT */

else{

pair.right.shift();
}

/* ADD RESULT */

pair.result.push(num);

updateAccuracy();

/* COMPLETE PAIR */

if(
pair.left.length === 0
&& pair.right.length === 0
){

updateMergeRows();

currentPair++;

if(
currentPair >=
mergeStages[currentStage].length
){

currentStage++;

currentPair = 0;
}
}

render();

checkMergeFinish();
}

/* ================= UPDATE MERGE ROWS ================= */

function updateMergeRows(){

let rowIndex =
splitDepth + currentStage + 1;

if(!levels[rowIndex]){

levels[rowIndex] = [];
}

levels[rowIndex] = [];

mergeStages[currentStage]
.forEach(pair=>{

if(
pair.result.length > 0
){

levels[rowIndex].push({

array:[...pair.result],

merged:true
});
}
});
}

/* ================= CHECK FINISH ================= */

function checkMergeFinish(){

if(
currentStage >= mergeStages.length
){

/* WIN SOUND */

document.getElementById(
"winSound"
).currentTime = 0;

document.getElementById(
"winSound"
).play();

/* CALCULATE ACCURACY */

let accuracy =
Math.floor(

(correctMoves /
Math.max(totalMoves,1))
*100

);

/* SAVE RESULT */

localStorage.setItem(
"accuracy",
accuracy
);

localStorage.setItem(
"completedLevel",
"Merge Sort"
);
localStorage.setItem(
"nextAlgorithm",
"Quick Sort"
);

localStorage.setItem(
"unlockMessage",
"⚡ Quick Sort Unlocked!"
);

/* OPEN COMMON RESULT PAGE */

setTimeout(()=>{

window.location.href =
"result.html";

},1500);
}
}
/* ================= ACCURACY ================= */

function updateAccuracy(){

let accuracy =
Math.floor(

(correctMoves /
Math.max(totalMoves,1))
* 100

);

document.getElementById(
"accuracy"
).innerHTML =

"Accuracy: " +
accuracy + "%";
}

/* ================= LOGOUT ================= */

function logout(){

localStorage.removeItem(
"currentUser"
);

window.location.href =
"index.html";
}

/* ================= START ================= */

startGame();