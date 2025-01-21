let camX = 0, camY = 0, camZ = 0;
let angleX = 0, angleY = 0;
let distance = 2000;
let pawn;

function preload() {
    pawn = loadModel('models/pawn.obj');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
    background(220);
    if (mouseIsPressed) {
        angleX += (pmouseX - mouseX) * 0.01;
        angleY += (pmouseY - mouseY) * 0.01;
    }
    angleY = constrain(angleY, -PI / 2, PI / 2);

    camX = cos(angleY) * sin(angleX) * distance;
    camZ = cos(angleY) * cos(angleX) * distance;
    camY = sin(angleY) * distance;
    camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0)
    noFill();
    stroke(0);
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            for (let k = 0; k < 8; k++) {
                push();
                translate(200 - 50 * i, 200 - 50 * j, 200 - 50 * k);
                noFill();
                stroke(0);
                box(50);
                if (i + j + k < 5 || i + j + k > 16) {
                    fill(255, 0, 0);
                    noStroke();
                    translate(0, 10, 0);
                    rotateX(PI / 2);
                    scale(7);
                    model(pawn);
                }
                pop();
            }
        }
    }
    
}