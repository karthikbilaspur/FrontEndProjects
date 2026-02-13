const canvas = new fabric.Canvas('cardCanvas');
canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));

let history=[], redoStack=[];

function saveState(){
history.push(JSON.stringify(canvas));
redoStack=[];
}
canvas.on('object:added', saveState);

/* Undo Redo */
function undo(){
if(history.length){
redoStack.push(JSON.stringify(canvas));
canvas.loadFromJSON(history.pop(),canvas.renderAll.bind(canvas));
}
}
function redo(){
if(redoStack.length){
history.push(JSON.stringify(canvas));
canvas.loadFromJSON(redoStack.pop(),canvas.renderAll.bind(canvas));
}
}

/* Add Elements */
function addText(){
canvas.add(new fabric.IText("Message",{left:100,top:100}));
}
function addRectangle(){
canvas.add(new fabric.Rect({left:120,top:120,width:150,height:80,fill:"red"}));
}
function addCircle(){
canvas.add(new fabric.Circle({left:120,top:120,radius:50,fill:"blue"}));
}

/* Theme Toggle */
function toggleTheme(){
document.body.classList.toggle("light");
}

/* Download */
function downloadCard(){
let link=document.createElement("a");
link.download="card.png";
link.href=canvas.toDataURL({format:"png"});
link.click();
}

/* Scroll Top */
function scrollToTop(){
window.scrollTo({top:0,behavior:"smooth"});
}

/* Keyboard Shortcuts */
document.addEventListener("keydown",e=>{
if(e.key==="Delete"){
canvas.remove(canvas.getActiveObject());
}
if(e.ctrlKey && e.key==="z") undo();
});
