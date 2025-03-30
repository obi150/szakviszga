let camX = 0, camY = 0, camZ = -500;
let angleX = 0, angleY = 0;
let speedX = 0, speedY = 0;
let inertia = 0.95;
let prevMouseX, prevMouseY;

function setup() {
    createCanvas(600, 600, WEBGL);
    perspective(PI / 3, width / height, 0.1, 1000);
}

function draw() {
    background(10);

    angleX -= speedX;
    angleY += speedY;
    angleY = constrain(angleY, -PI / 2, PI / 2);
    speedX *= inertia;
    speedY *= inertia;

    rotateX(angleY);
    rotateY(angleX);

    let cubeSize = 20;
    let gap = 5;
    let spacing = cubeSize + gap;
    let offset = (8 * spacing) / 2;

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            for (let z = 0; z < 8; z++) {
                push();
                translate(x * spacing - offset, y * spacing - offset, z * spacing - offset);
                stroke(255);
                noFill();
                box(cubeSize);
                pop();
            }
        }
    }
}

function mousePressed() {
    prevMouseX = mouseX;
    prevMouseY = mouseY;
}

function mouseDragged() {
    let dx = mouseX - prevMouseX;
    let dy = mouseY - prevMouseY;
    speedX = -dx * 0.005;
    speedY = -dy * 0.005;
    prevMouseX = mouseX;
    prevMouseY = mouseY;
}
