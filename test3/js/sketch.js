let camX = 0, camY = 0, camZ = 0;
let angleX = 0, angleY = 0;
let speed = 5;
let clickStartX, clickStartY;

let cir = new hitbox(100, [0, 0, -200])

function calculateDistance(A, vect, O) {
    let newVect = [A[0] - O[0], A[1] - O[1], A[2] - O[2]];
    let t = (newVect[0] * vect[0] + newVect[1] * vect[1] + newVect[2] * vect[2]) / (vect[0] * vect[0] + vect[1] * vect[1] + vect[2] * vect[2]);
    if (t < 0)
        return -1;
    let P = [O[0] + t * vect[0], O[1] + t * vect[1], O[2] + t * vect[2]];
    return Math.sqrt((P[0] - A[0]) * (P[0] - A[0]) + (P[1] - A[1]) * (P[1] - A[1]) + (P[2] - A[2]) * (P[2] - A[2]));
}

function createRay() {
    let ndcX = (mouseX / width) * 2 - 1;
    let ndcY = (mouseY / height) * 2 - 1;

    let forward = [
        Math.cos(angleY) * Math.sin(angleX),
        Math.sin(angleY),
        Math.cos(angleY) * Math.cos(angleX)
    ];
    let right = [
        -Math.cos(angleX),
        0,
        Math.sin(angleX)
    ];
    let up = [
        -Math.sin(angleY) * Math.sin(angleX),
        Math.cos(angleY),
        -Math.sin(angleY) * Math.cos(angleX)
    ];

    let fov = PI / 3, aspect = width / height;
    let nearPlaneX = ndcX * Math.tan(fov / 2) * aspect;
    let nearPlaneY = ndcY * Math.tan(fov / 2);

    return normalize([
        nearPlaneX * right[0] + nearPlaneY * up[0] + forward[0],
        nearPlaneX * right[1] + nearPlaneY * up[1] + forward[1],
        nearPlaneX * right[2] + nearPlaneY * up[2] + forward[2]
    ]);
}

function normalize(vec) {
    let magnitude = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
    if (magnitude === 0) return [0, 0, 0];
    return [vec[0] / magnitude, vec[1] / magnitude, vec[2] / magnitude];
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    perspective(PI / 3, width / height, 0.1, 1000);

    setUpChessBoard();
}

function draw() {
    background(220);

    angleY = constrain(angleY, -PI / 2, PI / 2);

    if (keyIsDown(UP_ARROW)) {
        camX += sin(angleX) * speed;
        camZ += cos(angleX) * speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
        camX -= sin(angleX) * speed;
        camZ -= cos(angleX) * speed;
    }
    if (keyIsDown(LEFT_ARROW)) {
        camX += cos(angleX) * speed;
        camZ -= sin(angleX) * speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        camX -= cos(angleX) * speed;
        camZ += sin(angleX) * speed;
    }
    if (keyIsDown(32))
        camY -= speed;
    if (keyIsDown(16))
        camY += speed;


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
        let vect = createRay();
        if (cir.isHit(vect, [camX, camY, camZ])) {
            cir.changeColor([0, 255, 0]);
        }
    }
}