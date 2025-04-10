let angleX = 0, angleY = 0;
let speedX = 0, speedY = 0;
let inertia = 0;
let prevMouseX, prevMouseY;
let HS = 10;
let pawnModel, knightModel, bishopModel, rookModel, queenModel, kingModel;
let chessmap;

fetch('static/chessmap/basic.chessmap')
    .then(response => response.text())
    .then(text => {
        const lines = text.split(/\r?\n/);
        let level = [];
        let board = [];

        lines.forEach((line, index) => {
            if (line.trim() === '') return;
            const row = line.split(' ').map(Number);
            level.push(row);
            if (level.length === 8) {
                board.push(level);
                level = [];
            }
        });

        chessmap = board;
    });

function idToModel(id) {
    switch (id) {
        case 1:
        case 7:
            return pawnModel;
            break;
        case 2:
        case 8:
            return knightModel;
            break;
        case 3:
        case 9:
            return bishopModel;
            break;
        case 4:
        case 10:
            return rookModel;
            break;
        case 5:
        case 11:
            return queenModel;
            break;
        case 6:
        case 12:
            return kingModel;
            break;
    }
}

function preload() {
    pawnModel = loadModel('/static/models/pawn.obj');
    knightModel = loadModel('/static/models/knight.obj');
    bishopModel = loadModel('/static/models/bishop.obj');
    rookModel = loadModel('/static/models/rook.obj');
    queenModel = loadModel('/static/models/queen.obj');
    kingModel = loadModel('/static/models/king.obj');
}

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
    let dvect = [
        -Math.sin(angleX) * Math.cos(angleY),
        Math.sin(angleY),                  
        Math.cos(angleX) * Math.cos(angleY)  
    ];



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
                if (chessmap[x][y][z]) {
                    if (chessmap[x][y][z] < 7) {
                        push();
                        translate(175 - x * cubeSize, 175 - y * cubeSize + 19, 175 - z * cubeSize);
                        noFill();
                        strokeWeight(2);
                        stroke(0);
                        scale(5.5);
                        rotateX(PI / 2);
                        model(idToModel(chessmap[x][y][z]));
                        rotateX(-PI / 2);
                        scale(1 / 5.5);
                        translate(3 * dvect[0], 3 * dvect[1], 3 * dvect[2]);
                        scale(5.4);
                        fill(255, 255, 255);
                        noStroke();
                        rotateX(PI / 2);
                        model(idToModel(chessmap[x][y][z]));
                        pop();
                    }
                    else {
                        push();
                        translate(175 - x * cubeSize, 175 - y * cubeSize + 19, 175 - z * cubeSize);
                        noFill();
                        strokeWeight(2);
                        stroke(255);
                        scale(5.5);
                        rotateX(PI / 2);
                        model(idToModel(chessmap[x][y][z]));
                        rotateX(-PI / 2);
                        scale(1 / 5.5);
                        translate(3 * dvect[0], 3 * dvect[1], 3 * dvect[2]);
                        scale(5.4);
                        fill(0, 0, 0);
                        noStroke();
                        rotateX(PI / 2);
                        model(idToModel(chessmap[x][y][z]));
                        pop();
                    }
                }
            }
        }
    }

    translate(-25, -25, -25);

    stroke(245, 133, 65);
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
