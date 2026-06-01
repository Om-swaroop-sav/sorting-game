/* ================= DATA ================= */

let rootArray = [];

let moves = 0;
let correctMoves = 0;
let wrongMoves = 0;

/* ================= ELEMENTS ================= */

const treeContainer =
document.getElementById(
"treeContainer"
);

const message =
document.getElementById(
"message"
);

const accuracyText =
document.getElementById(
"accuracy"
);

const movesText =
document.getElementById(
"moves"
);

/* ================= BRANCHES ================= */

let branchId = 0;

let activeBranches = [];

/*
branch structure

{

id,
array,

pivot,

left,
right,

parent,

completed

}
*/

/* ================= START ================= */

generateArray();

/* ================= GENERATE ARRAY ================= */

function generateArray(){

let size =
parseInt(
document.getElementById(
"arraySize"
).value
);

let maxValue =
parseInt(
document.getElementById(
"maxValue"
).value
);

rootArray = [];

for(
let i=0;
i<size;
i++
){

rootArray.push(

Math.floor(
Math.random()*maxValue
)+1

);
}

moves = 0;
correctMoves = 0;
wrongMoves = 0;

updateStats();

branchId = 0;

activeBranches = [];

treeContainer.innerHTML = "";

createRootBranch(
rootArray
);
}

/* ================= ROOT ================= */

function createRootBranch(arr){

const branch = {

id : ++branchId,

array : [...arr],

pivot : null,

left : [],

right : [],

parent : null,

completed : false

};

activeBranches.push(
branch
);

renderBranch(
branch
);
}

/* ================= RENDER BRANCH ================= */

function renderBranch(branch){

const level =
document.createElement(
"div"
);

level.className =
"level";

level.id =
"branch-" +
branch.id;

const title =
document.createElement(
"h3"
);

title.innerHTML =

"Choose Pivot";

level.appendChild(
title
);

const group =
document.createElement(
"div"
);

group.className =
"group";

branch.array.forEach(num=>{

const box =
document.createElement(
"div"
);

box.className =
"num";

box.innerHTML =
num;

box.onclick =
function(){

choosePivot(
branch,
num
);
};

group.appendChild(
box
);

});

level.appendChild(
group
);

treeContainer.appendChild(
level
);
}

/* ================= CHOOSE PIVOT ================= */

function choosePivot(
branch,
pivot
){

if(
branch.pivot !== null
){

return;
}

branch.pivot =
pivot;

showPartitionArea(
branch
);
}

/* ================= PARTITION AREA ================= */

function showPartitionArea(
branch
){

const level =
document.getElementById(
"branch-" +
branch.id
);

level.innerHTML = "";

const title =
document.createElement(
"h3"
);

title.innerHTML =

"Pivot : " +
branch.pivot;

level.appendChild(
title
);

const original =
document.createElement(
"div"
);

original.className =
"group";

branch.array.forEach(num=>{

const box =
document.createElement(
"div"
);

box.className =
"num";

if(
num === branch.pivot
){

box.classList.add(
"pivot"
);
}

box.innerHTML =
num;

if(
num !== branch.pivot
){

box.onclick =
function(){

selectValue(
branch,
num,
box
);
};
}

original.appendChild(
box
);

});

level.appendChild(
original
);

/* STORE TEMP VALUE */

branch.selected =
null;

/* LEFT RIGHT AREA */

const area =
document.createElement(
"div"
);

area.innerHTML =

`

<div
style="
display:flex;
justify-content:space-around;
margin-top:25px;
flex-wrap:wrap;
">

<div>

<h3>

🟢 LESS THAN
${branch.pivot}

</h3>

<button
id="left-${branch.id}">

Place Here

</button>

<div
id="leftBox-${branch.id}"
class="group">

</div>

</div>

<div>

<h3>

🔴 GREATER THAN
${branch.pivot}

</h3>

<button
id="right-${branch.id}">

Place Here

</button>

<div
id="rightBox-${branch.id}"
class="group">

</div>

</div>

</div>

<br>

<button
id="complete-${branch.id}"
style="display:none;">

✓ Partition Complete

</button>

`;

level.appendChild(
area
);

document.getElementById(
"left-" +
branch.id
).onclick =
function(){

placeValue(
branch,
"left"
);
};

document.getElementById(
"right-" +
branch.id
).onclick =
function(){

placeValue(
branch,
"right"
);
};

updatePartitionView(
branch
);
}

/* ================= SELECT VALUE ================= */

function selectValue(
branch,
num,
element
){

branch.selected =
num;

document
.querySelectorAll(
"#branch-" +
branch.id +
" .num"
)
.forEach(x=>{

x.style.outline =
"none";

});

element.style.outline =
"4px solid white";
}

/* ================= STATS ================= */

function updateStats(){

movesText.innerHTML =

"Moves: " +
moves;

const accuracy =

Math.floor(

(correctMoves /

Math.max(
moves,
1
)

)*100

);

accuracyText.innerHTML =

"Accuracy: " +
accuracy +
"%";
}

/* ================= SOUNDS ================= */

function playCorrect(){

const sound =
document.getElementById(
"correctSound"
);

if(sound){

sound.currentTime = 0;
sound.play();
}
}

function playWrong(){

const sound =
document.getElementById(
"wrongSound"
);

if(sound){

sound.currentTime = 0;
sound.play();
}
}

function playWin(){

const sound =
document.getElementById(
"winSound"
);

if(sound){

sound.currentTime = 0;
sound.play();
}
}

/* ================= LOGOUT ================= */

function logout(){

localStorage.removeItem(
"currentUser"
);

window.location.href =
"index.html";
}

/* ================= PLACE VALUE ================= */

function placeValue(
branch,
side
){

if(
branch.selected === null
){

alert(
"Select a number first!"
);

return;
}

const value =
branch.selected;

const correctSide =

value < branch.pivot

? "left"

: "right";

moves++;

if(
side === correctSide
){

correctMoves++;

playCorrect();

if(
side === "left"
){

if(
!branch.left.includes(
value
)
){

branch.left.push(
value
);
}
}
else{

if(
!branch.right.includes(
value
)
){

branch.right.push(
value
);
}
}
}
else{

wrongMoves++;

playWrong();
}

branch.selected =
null;

updateStats();

updatePartitionView(
branch
);
}

/* ================= UPDATE PARTITION ================= */

function updatePartitionView(
branch
){

const leftBox =
document.getElementById(
"leftBox-" +
branch.id
);

const rightBox =
document.getElementById(
"rightBox-" +
branch.id
);

if(
!leftBox ||
!rightBox
)return;

leftBox.innerHTML = "";
rightBox.innerHTML = "";

/* LEFT */

branch.left.forEach(num=>{

const box =
document.createElement(
"div"
);

box.className =
"num less";

box.innerHTML =
num;

leftBox.appendChild(
box
);

});

/* RIGHT */

branch.right.forEach(num=>{

const box =
document.createElement(
"div"
);

box.className =
"num greater";

box.innerHTML =
num;

rightBox.appendChild(
box
);

});

/* COMPLETION */

const totalNeeded =

branch.array.length - 1;

if(

branch.left.length +
branch.right.length

=== totalNeeded

){

const btn =
document.getElementById(
"complete-" +
branch.id
);

btn.style.display =
"inline-block";

btn.onclick =
function(){

completePartition(
branch
);
};
}
}

/* ================= COMPLETE PARTITION ================= */

function completePartition(
branch
){

branch.completed =
true;

playCorrect();

/* RESULT ROW */

const resultRow =
document.createElement(
"div"
);

resultRow.className =
"group";

branch.left.forEach(num=>{

const box =
document.createElement(
"div"
);

box.className =
"num less";

box.innerHTML =
num;

resultRow.appendChild(
box
);

});

const pivotBox =
document.createElement(
"div"
);

pivotBox.className =
"num pivot";

pivotBox.innerHTML =
branch.pivot;

resultRow.appendChild(
pivotBox
);

branch.right.forEach(num=>{

const box =
document.createElement(
"div"
);

box.className =
"num greater";

box.innerHTML =
num;

resultRow.appendChild(
box
);

});

const parent =
document.getElementById(
"branch-" +
branch.id
);

parent.appendChild(
document.createElement(
"br"
)
);

parent.appendChild(
resultRow
);

/* CHILD BRANCHES */

createChildBranches(
branch
);

checkGameComplete();
}

/* ================= CREATE CHILD BRANCHES ================= */

function createChildBranches(
branch
){

const wrapper =
document.createElement(
"div"
);

wrapper.className =
"level";

/* LEFT CHILD */

if(
branch.left.length > 1
){

const leftBranch = {

id : ++branchId,

array :
[...branch.left],

pivot : null,

left : [],

right : [],

parent :
branch.id,

completed :
false

};

activeBranches.push(
leftBranch
);

wrapper.appendChild(

createBranchElement(
leftBranch
)

);
}

/* RIGHT CHILD */

if(
branch.right.length > 1
){

const rightBranch = {

id : ++branchId,

array :
[...branch.right],

pivot : null,

left : [],

right : [],

parent :
branch.id,

completed :
false

};

activeBranches.push(
rightBranch
);

wrapper.appendChild(

createBranchElement(
rightBranch
)

);
}

if(
wrapper.children.length > 0
){

treeContainer.appendChild(
wrapper
);
}
}

/* ================= CREATE BRANCH ELEMENT ================= */

function createBranchElement(
branch
){

const holder =
document.createElement(
"div"
);

holder.id =
"branch-" +
branch.id;

holder.style.margin =
"20px";

const title =
document.createElement(
"h3"
);

title.innerHTML =
"Choose Pivot";

holder.appendChild(
title
);

const group =
document.createElement(
"div"
);

group.className =
"group";

branch.array.forEach(num=>{

const box =
document.createElement(
"div"
);

box.className =
"num";

box.innerHTML =
num;

box.onclick =
function(){

choosePivot(
branch,
num
);
};

group.appendChild(
box
);

});

holder.appendChild(
group
);

return holder;
}

/* ================= CHECK GAME COMPLETE ================= */

function checkGameComplete(){

const unfinished =

activeBranches.filter(
branch => !branch.completed
);

if(
unfinished.length === 0
){

showFinalSortedArray();
}
}

/* ================= FINAL SORT ================= */

function quickSortAuto(arr){

if(
arr.length <= 1
){

return arr;
}

const pivot =
arr[arr.length - 1];

const left = [];
const right = [];

for(
let i = 0;
i < arr.length - 1;
i++
){

if(
arr[i] < pivot
){

left.push(
arr[i]
);
}
else{

right.push(
arr[i]
);
}
}

return [

...quickSortAuto(
left
),

pivot,

...quickSortAuto(
right
)

];
}

/* ================= SHOW FINAL ARRAY ================= */

function showFinalSortedArray(){

const sorted =

quickSortAuto(
[...rootArray]
);

const title =
document.createElement(
"h2"
);

title.innerHTML =

"🏆 Quick Sort Complete";

treeContainer.appendChild(
title
);

const finalRow =
document.createElement(
"div"
);

finalRow.className =
"group";

sorted.forEach(num=>{

const box =
document.createElement(
"div"
);

box.className =
"num sorted";

box.innerHTML =
num;

finalRow.appendChild(
box
);

});

treeContainer.appendChild(
finalRow
);

playWin();

showResultScreen();
}

/* ================= RESULT ================= */

function showResultScreen(){

const accuracy =

Math.floor(

(correctMoves /

Math.max(
moves,
1
)

)*100

);

localStorage.setItem(
"accuracy",
accuracy
);

localStorage.setItem(
"completedLevel",
"Quick Sort"
);

let stars = "⭐";

if(
accuracy >= 100
){

stars =
"⭐⭐⭐";
}
else if(
accuracy >= 70
){

stars =
"⭐⭐";
}

localStorage.setItem(
"stars",
stars
);

setTimeout(()=>{

window.location.href =
"result.html";

},2000);
}/* ================= CHECK GAME COMPLETE ================= */

function checkGameComplete(){

const unfinished =

activeBranches.filter(
branch => !branch.completed
);

if(
unfinished.length === 0
){

showFinalSortedArray();
}
}

/* ================= FINAL SORT ================= */

function quickSortAuto(arr){

if(
arr.length <= 1
){

return arr;
}

const pivot =
arr[arr.length - 1];

const left = [];
const right = [];

for(
let i = 0;
i < arr.length - 1;
i++
){

if(
arr[i] < pivot
){

left.push(
arr[i]
);
}
else{

right.push(
arr[i]
);
}
}

return [

...quickSortAuto(
left
),

pivot,

...quickSortAuto(
right
)

];
}

/* ================= SHOW FINAL ARRAY ================= */

function showFinalSortedArray(){

const sorted =

quickSortAuto(
[...rootArray]
);

const title =
document.createElement(
"h2"
);

title.innerHTML =

"🏆 Quick Sort Complete";

treeContainer.appendChild(
title
);

const finalRow =
document.createElement(
"div"
);

finalRow.className =
"group";

sorted.forEach(num=>{

const box =
document.createElement(
"div"
);

box.className =
"num sorted";

box.innerHTML =
num;

finalRow.appendChild(
box
);

});

treeContainer.appendChild(
finalRow
);

playWin();

showResultScreen();
}

/* ================= RESULT ================= */

function showResultScreen(){

const accuracy =

Math.floor(

(correctMoves /

Math.max(
moves,
1
)

)*100

);

localStorage.setItem(
"accuracy",
accuracy
);

localStorage.setItem(
"completedLevel",
"Quick Sort"
);

let stars = "⭐";

if(
accuracy >= 100
){

stars =
"⭐⭐⭐";
}
else if(
accuracy >= 70
){

stars =
"⭐⭐";
}

localStorage.setItem(
"stars",
stars
);

setTimeout(()=>{

window.location.href =
"result.html";

},2000);
}