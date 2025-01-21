let pawn;
function preload() {
    pawn = loadModel('models/pawn.obj',true);
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
    model(pawn);
    
}