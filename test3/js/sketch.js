let camX = 0, camY = 0, camZ = 0;
let angleX = 0, angleY = 0;
let speed = 5;
let clickStartX, clickStartY;

class hitbox {
    #r;
    #position;
    #color;
    constructor(r, position) {
        this.#r = r;
        this.#position = position;
        this.#color = [255, 0, 0];
    }
    changePosition(x, y, z) {
        this.#position = [x, y, z];
    }
    changeColor(color) {
        this.#color = color;
    }
    getPosition() {
        return this.#position;
    }
    getRadius() {
        return this.#r;
    }
    getColor() {
        return this.#color;
    }
    isHit(vect, O) {
        let dis = calculateDistance(this.#position, vect, O);
        return dis < this.#r && dis >= 0;
    }
};

let cir = new hitbox(100, [0, 0, -200])

function calculateDistance(A, vect, O) {
    let newVect = [A[0] - O[0], A[1] - O[1], A[2] - O[2]];
    let t = (newVect[0] * vect[0] + newVect[1] * vect[1] + newVect[2] * vect[2]) / (vect[0] * vect[0] + vect[1] * vect[1] + vect[2] * vect[2]);
    if (t < 0)
        return -1;
    let P = [O[0] + t * vect[0], O[1] + t * vect[1], O[2] + t * vect[2]];
    return Math.sqrt((P[0] - A[0]) * (P[0] - A[0]) + (P[1] - A[1]) * (P[1] - A[1]) + (P[2] - A[2]) * (P[2] - A[2]));
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    perspective(PI / 3, width / height, 0.1, 1000);
}

function draw() {
    background(220);

    angleY = constrain(angleY, -PI / 2, PI / 2);

    if (keyIsDown(UP_ARROW)) {
        camX += sin(angleX) * cos(angleY) * speed;
        camY += sin(angleY) * speed;
        camZ += cos(angleX) * cos(angleY) * speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
        camX -= sin(angleX) * cos(angleY) * speed;
        camY -= sin(angleY) * speed;
        camZ -= cos(angleX) * cos(angleY) * speed;
    }
    if (keyIsDown(LEFT_ARROW)) {
        camX += cos(angleX) * speed;
        camZ -= sin(angleX) * speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        camX -= cos(angleX) * speed;
        camZ += sin(angleX) * speed;
    }

    camera(camX, camY, camZ, camX + sin(angleX) * cos(angleY), camY + sin(angleY), camZ + cos(angleX) * cos(angleY), 0, 1, 0);

    let poz = cir.getPosition()
    translate(poz[0], poz[1], poz[2]);
    noStroke();
    fill(cir.getColor());
    sphere(cir.getRadius());
}

function mouseDragged() {
    angleX += (mouseX - pmouseX) * 0.01;
    angleY += (pmouseY - mouseY) * 0.01;
}

function mousePressed() {
    clickStartX = mouseX;
    clickStartY = mouseY;
}
function mouseReleased() {
    if (clickStartX == mouseX && clickStartY == mouseY) {
        let clickAngleX = angleX - (2 * mouseX / windowWidth - 1) * PI / 3;
        let clickAngleY = angleY + windowHeight / windowWidth * (2 * mouseY / windowHeight - 1) * PI / 3;
        let vect = [sin(clickAngleX) * cos(clickAngleY), sin(clickAngleY), cos(clickAngleX) * cos(clickAngleY)]
        if (cir.isHit(vect, [camX, camY, camZ])) {
            cir.changeColor([0, 255, 0]);
        }
    }
}