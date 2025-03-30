let camX = 25, camY = 25, camZ = -800;
let pointX, pointY, pointZ;
let angleX = 0, angleY = 0;
let speed = 5;
let clickStartX, clickStartY;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    perspective(PI / 3, width / height, 0.1, 1000);
}

function draw() {
    if (gameStarted && !gameEnded) {
        background(0); //245, 176, 65

        angleY = constrain(angleY, -PI / 2, PI / 2);

        if (keyIsDown(87)) {
            camX += sin(angleX) * speed;
            camZ += cos(angleX) * speed;
        }
        if (keyIsDown(83)) {
            camX -= sin(angleX) * speed;
            camZ -= cos(angleX) * speed;
        }
        if (keyIsDown(65)) {
            camX += cos(angleX) * speed;
            camZ -= sin(angleX) * speed;
        }
        if (keyIsDown(68)) {
            camX -= cos(angleX) * speed;
            camZ += sin(angleX) * speed;
        }
        if (keyIsDown(32))
            camY -= speed;
        if (keyIsDown(16))
            camY += speed;

        pointX = camX + sin(angleX) * cos(angleY);
        pointY = camY + sin(angleY);
        pointZ = camZ + cos(angleX) * cos(angleY);

        camera(camX, camY, camZ, pointX, pointY, pointZ, 0, 1, 0);

        noFill();
        stroke(0);
        for (let i = 2; i < 10; i++) {
            for (let j = 2; j < 10; j++) {
                for (let k = 2; k < 10; k++) {
                    push();
                    translate(200 - 50 * (i - 2), 200 - 50 * (j - 2), 200 - 50 * (k - 2));
                    noFill();
                    stroke(255)
                    box(50);
                    if (chessBoard3D[i][j][k] == 13) {
                        fill(0, 0, 255);
                        noStroke();
                        sphere(HS);
                    }

                    pop();
                }
            }
        }

        for (let i = 0; i < pieces.length; i++) {
            push();
            let pos = boardPositionToCoord(pieces[i].getPosition());
            let dvect = normalize([camX - pos[0], camY - pos[1], camZ - pos[2]]);
            translate(pos[0], pos[1] + 19, pos[2]);
            if (pieces[i].getId() < 7) {
                noFill();
                strokeWeight(2);
                stroke(0);
                scale(5.5);
                rotateX(PI / 2);
                model(idToModel(pieces[i].getId()));
                rotateX(-PI / 2);
                scale(1 / 5.5);
                translate(dvect[0] * 3, dvect[1] * 3, dvect[2] * 3);
                scale(5.4);
                fill(255, 255, 255);
                noStroke();
                rotateX(PI / 2);
            }
            else {
                noFill();
                strokeWeight(2);
                stroke(255);
                scale(5.5);
                rotateX(PI / 2);
                model(idToModel(pieces[i].getId()));
                rotateX(-PI / 2);
                scale(1 / 5.5);
                translate(dvect[0] * 3, dvect[1] * 3, dvect[2] * 3);
                scale(5.4);
                fill(0, 0, 0);
                noStroke();
                rotateX(PI / 2);
            }
            model(idToModel(pieces[i].getId()));
            pop();
        }
    }
    else if (gameEnded)
        console.log("Game Ended!");
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
    if (clickStartX == mouseX && clickStartY == mouseY && gameStarted && moveCount % 2 == !isWhite) {
        let vect = createRay();
        let pieceDistanceIndex = -1, pieceDistance = 999999;
        let hitboxDistanceIndex = -1, hitboxDistance = 999999;
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].isWhite() == isWhite) {
                if (pieces[i].isHit(vect, [camX, camY, camZ])) {
                    let newDis = Math.sqrt((xToCoord(pieces[i].getPosition()[0]) - camX) * (xToCoord(pieces[i].getPosition()[0]) - camX) +
                        (xToCoord(pieces[i].getPosition()[1]) - camY) * (xToCoord(pieces[i].getPosition()[1]) - camY) +
                        (xToCoord(pieces[i].getPosition()[2]) - camZ) * (xToCoord(pieces[i].getPosition()[2]) - camZ));
                    if (newDis < pieceDistance) {
                        pieceDistance = newDis;
                        pieceDistanceIndex = i;
                    }
                }
            }
        }
        for (let i = 0; i < hitboxes.length; i++) {
            if (hitboxes[i].isHit(vect, [camX, camY, camZ])) {
                let newDis = Math.sqrt((xToCoord(hitboxes[i].getPosition()[0]) - camX) * (xToCoord(hitboxes[i].getPosition()[0]) - camX) +
                    (xToCoord(hitboxes[i].getPosition()[1]) - camY) * (xToCoord(hitboxes[i].getPosition()[1]) - camY) +
                    (xToCoord(hitboxes[i].getPosition()[2]) - camZ) * (xToCoord(hitboxes[i].getPosition()[2]) - camZ));
                if (newDis < hitboxDistance) {
                    hitboxDistance = newDis;
                    hitboxDistanceIndex = i;
                }
            }
        }
        if (hitboxDistanceIndex > -1) {
            if (pieceDistanceIndex > -1) {
                if (pieceDistance < hitboxDistance && (!isCheck(pieces[kingIndex].getPosition()) || pieces[pieceDistanceIndex].getId() == 12 - 6 * isWhite)) {
                    currentPieceIndex = pieceDistanceIndex;
                    createMoveOprionsHitboxesByID(pieces[pieceDistanceIndex].getId(), pieces[pieceDistanceIndex].getPosition());
                }
                else {
                    createMoveOprionsHitboxesByID(hitboxes[hitboxDistanceIndex].getId(), hitboxes[hitboxDistanceIndex].getPosition());
                    makeMove(currentPieceIndex, hitboxDistanceIndex)
                }
            }
            else {
                createMoveOprionsHitboxesByID(hitboxes[hitboxDistanceIndex].getId(), hitboxes[hitboxDistanceIndex].getPosition());
                makeMove(currentPieceIndex, hitboxDistanceIndex)
            }
        }
        else if (pieceDistanceIndex > -1 && (!isCheck(pieces[kingIndex].getPosition()) || pieces[pieceDistanceIndex].getId() == 12 - 6 * isWhite)) {
            currentPieceIndex = pieceDistanceIndex;
            createMoveOprionsHitboxesByID(pieces[pieceDistanceIndex].getId(), pieces[pieceDistanceIndex].getPosition());
        }
        else {
            deleteHitboxes();
        }
    }
}
