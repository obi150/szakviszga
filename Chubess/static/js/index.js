let angleX = 0, angleY = 0;
let speedX = 0, speedY = 0;
let inertia = 0.95;
let prevMouseX, prevMouseY;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    perspective(PI / 3, width / height, 0.1, 1000000);
}

function draw() {
    background(127);

    angleX -= speedX;
    angleY += speedY;
    angleY = constrain(angleY, -PI / 2, PI / 2);
    speedX *= inertia;
    speedY *= inertia;

    translate(0, 0, -25);

    rotateX(angleY);
    rotateY(angleX);

    let cubeSize = 50;

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            for (let z = 0; z < 8; z++) {
                push();
                translate(175 - x * cubeSize , 175 - y * cubeSize, 175 - z * cubeSize);
                strokeWeight(0.5);
                stroke(255)
                noFill();
                box(cubeSize);
                pop();
            }
        }
    }

    translate(-25, -25, -25);

    stroke(245, 176, 65);
    strokeWeight(5);

    line(-175, -175, -174, -175, -175, -125)
    line(-175, -174, -175, -175, -125, -175)
    line(-174, -175, -175, -125, -175, -175)

    line(-175, 224, -175, -175, 175, -175)
    line(-174, 225, -175, -125, 225, -175)
    line(-175, 225, -174, -175, 225, -125)

    line(224, 225, -175, 175, 225, -175)
    line(225, 224, -175, 225, 175, -175)
    line(225, 225, -174, 225, 225, -125)

    line(225, -175, -174, 225, -175, -125)
    line(225, -174, -175, 225, -125, -175)
    line(224, -175, -175, 175, -175, -175)

    line(-175, 224, 225, -175, 175, 225)
    line(-174, 225, 225, -125, 225, 225)
    line(-175, 225, 224, -175, 225, 175)

    line(224, 225, 225, 175, 225, 225)
    line(225, 224, 225, 225, 175, 225)
    line(225, 225, 224, 225, 225, 175)

    line(-175, -174, 225, -175, -125, 225)
    line(-174, -175, 225, -125, -175, 225)
    line(-175, -175, 224, -175, -175, 175)

    line(224, -175, 225, 175, -175, 225)
    line(225, -174, 225, 225, -125, 225)
    line(225, -175, 224, 225, -175, 175)
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
