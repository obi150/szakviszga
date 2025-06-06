let chessBoard3D = new Array;
let HS = 10;
let pawnModel, knightModel, bishopModel, rookModel, queenModel, kingModel;
let chessmap;
let capturedList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let promotionId = 0; ///piece id
let currentHitboxIndex = 0;

function preload() {
    pawnModel = loadModel('/static/models/pawn.obj');
    knightModel = loadModel('/static/models/knight.obj');
    bishopModel = loadModel('/static/models/bishop.obj');
    rookModel = loadModel('/static/models/rook.obj');
    queenModel = loadModel('/static/models/queen.obj');
    kingModel = loadModel('/static/models/king.obj');
}

class hitbox {
    #r;
    #position;
    #id;
    #oldId;
    constructor(r, position, id, oldId = 0) {
        this.#r = r;
        this.#position = position;
        this.#id = id;
        this.#oldId = oldId;
        chessBoard3D[position[0]][position[1]][position[2]] = id;
    }
    destroy() {
        chessBoard3D[this.#position[0]][this.#position[1]][this.#position[2]] = this.#oldId;
    }
    changePosition(position) {
        chessBoard3D[this.#position[0]][this.#position[1]][this.#position[2]] = 0;
        this.#position = position;
        chessBoard3D[position[0]][position[1]][position[2]] = this.#id;
    }
    changeId(id) {
        this.#id = id;
    }
    changeOldId(id) {
        this.#oldId = id;
    }
    getPosition() {
        return this.#position;
    }
    getRadius() {
        return this.#r;
    }
    getId() {
        return this.#id;
    }
    getOldId() {
        return this.#oldId;
    }
    isHit(vect, O) {
        let dis = calculateRayPointDistance(boardPositionToCoord(this.#position), vect, O);
        return dis < this.#r && dis >= 0;
    }
    isWhite() {
        return this.#id < 7;
    }
};
/*IDs on the board
 * nothing:      0
 * barrier:     -1
 * white_pawn:   1
 * white_knight: 2
 * white_bishop: 3
 * white_rook:   4
 * white_queen:  5
 * white_king:   6
 * black_pawn:   7
 * black_knight: 8
 * black_bishop: 9
 * black_rook:  10
 * black_queen: 11
 * black_king:  12
 * hitbox:      13*/

let pieces = [];
let hitboxes = [];

let currentPieceIndex = 0;

function update_taken_list(id) {
    capturedList[id] += 1;

    const item = document.getElementById(`${id}`);
    item.querySelector('span').textContent = `${capturedList[id]}`;
}

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

function calculateRayPointDistance(A, vect, O) {
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

function boardPositionToCoord(pos) {
    return [200 - 50 * (pos[0] - 2), 200 - 50 * (pos[1] - 2), 200 - 50 * (pos[2] - 2)];
}
function xToCoord(x) {
    return 200 - 50 * (x - 2);
}

function setUpChessBoard() {
    for (let i = 0; i < 12; i++) {
        chessBoard3D[i] = new Array;
        for (let j = 0; j < 12; j++) {
            chessBoard3D[i][j] = new Array;
            for (let k = 0; k < 12; k++)
                if (i < 2 || j < 2 || k < 2 || i > 9 || j > 9 || k > 9)
                    chessBoard3D[i][j][k] = -1;
                else
                    chessBoard3D[i][j][k] = chessmap[i - 2][j - 2][k - 2];
        }
    }
}

function setUpPieces() {
    for (let i = 2; i < 10; i++) {
        for (let j = 2; j < 10; j++) {
            for (let k = 2; k < 10; k++) {
                if (chessBoard3D[i][j][k] != 0)
                    pieces.push(new hitbox(HS, [i, j, k], chessBoard3D[i][j][k]));
                    
            }
        }
    }
}

function findKingIndex(white = isWhite) {
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].getId() == 12 - 6 * white)
            return i;
    }
    return -1;
}

function findOppositeKingIndex(white = isWhite) {
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].getId() == 12 - 6 * !white)
            return i;
    }
    return -1;
}

function move(pieceId, hitboxId) {
    currentPieceIndex = pieceId
    createMoveOprionsHitboxesByID(pieces[pieceId].getId(), pieces[pieceId].getPosition())
    if (promotionId != 0) {
        pieces[currentPieceIndex].changeId(promotionId);
        promotionId = 0;
    }
    createMoveOprionsHitboxesByID(hitboxes[hitboxId].getId(), hitboxes[hitboxId].getPosition())
}

function createMoveOprionsHitboxesByID(id, pos) {
    switch (id) {
        case 1:
        case 7:
            deleteHitboxes()
            movePawn(id == 1, pos);
            pawnTake(id == 1, pos)
            break;
        case 2:
        case 8:
            deleteHitboxes();
            moveKnight(id == 2, pos);
            break;
        case 3:
        case 9:
            deleteHitboxes();
            moveBishop(id == 3, pos);
            break;
        case 4:
        case 10:
            deleteHitboxes();
            moveRook(id == 4, pos);
            break;
        case 5:
        case 11:
            deleteHitboxes();
            moveRook(id == 5, pos);
            moveBishop(id == 5, pos);
            break;
        case 6:
        case 12:
            deleteHitboxes();
            moveKing(id == 6, pos);
            break;
        case 13:
            deleteHitboxes();
            take(pos);
            pieces[currentPieceIndex].changePosition(pos);
            break;
    }
}

function take(pos) {
    let pieceIndex = -1;
    for (let i = 0; i < pieces.length; i++) {
        if (JSON.stringify(pos) == JSON.stringify(pieces[i].getPosition())) {
            pieceIndex = i;
            break;
        }
    }
    if (pieceIndex != -1) {
        update_taken_list(pieces[pieceIndex].getId());
        pieces[pieceIndex].destroy();
        pieces.splice(pieceIndex, 1);
        if (pieceIndex < currentPieceIndex)
            currentPieceIndex--;
        if (pieceIndex < kingIndex)
            kingIndex--;
        if (pieceIndex < oppositeKingIndex)
            oppositeKingIndex--;
    }
}

function canPromote(id, pos) {
    if (id == 1 && pos[0] + pos[1] + pos[2] >= 22 && (pos[0] == 9 || pos[1] == 9 || pos[2] == 9)) {
        makeVisiblePromotion(pieces[currentPieceIndex].isWhite());
        return true;
    }
    else if (id == 7 && pos[0] + pos[1] + pos[2] <= 11 && (pos[0] == 2 || pos[1] == 2 || pos[2] == 2)) {
        makeVisiblePromotion(pieces[currentPieceIndex].isWhite());
        return true; 
    }
    return false;
}

function canTakeChecker(id, pos) {
    deleteHitboxes();
    let white;
    if (id < 7)
        white = true;
    else
        white = false;
    let index;
    if (white == isWhite)
        index = kingIndex;
    else
        index = oppositeKingIndex;
    let checkersIndexes = findChecker(white, pieces[index].getPosition());
    if (checkersIndexes.length < 2 && checkersIndexes.length > 0) {
        let checkerPos = pieces[checkersIndexes[0]].getPosition();
        pinnedHitboxes(id, pos);
        if (chessBoard3D[checkerPos[0]][checkerPos[1]][checkerPos[2]] == 13) {
            deleteHitboxes();
            hitboxes.push(new hitbox(HS, checkerPos, 13,
                chessBoard3D[checkerPos[0]][checkerPos[1]][checkerPos[2]]));
            return true;
        }
        deleteHitboxes();
    }
    return false;
}

function canBlockCheck(id, pos) {
    deleteHitboxes();
    let white;
    if (id < 7)
        white = true;
    else
        white = false;
    let index;
    if (white == isWhite)
        index = kingIndex;
    else
        index = oppositeKingIndex;
    let checkersIndexes = findChecker(white, pieces[index].getPosition());
    if (checkersIndexes.length < 2 && checkersIndexes.length > 0) {
        let newHitboxes = [];
        pinnedHitboxes(id, pos);
        for (let i = 0; i < hitboxes.length; i++) {
            let hpos = hitboxes[i].getPosition();
            let oldId = hitboxes[i].getOldId();
            hitboxes[i].changeOldId(id)
            chessBoard3D[hpos[0]][hpos[1]][hpos[2]] = id;
            if (!isCheck(pieces[index].getPosition(), white))
                newHitboxes.push(hitboxes[i]);
            hitboxes[i].changeOldId(oldId)
            chessBoard3D[hpos[0]][hpos[1]][hpos[2]] = 13;
        }
        deleteHitboxes();
        if (newHitboxes.length > 0) {
            hitboxes = newHitboxes;
            buildHitboxes();
            return true;
        }
    }
    return false;
}

function pinnedHitboxes(id, pos) {
    deleteHitboxes();
    let white;
    if (id < 7)
        white = true;
    else
        white = false;
    let index;
    if (white == isWhite)
        index = kingIndex;
    else
        index = oppositeKingIndex;
    let newHitboxes = [];
    let checkerIndex = -1;
    createMoveOprionsHitboxesByID(id, pos);
    for (let i = 0; i < hitboxes.length; i++) {
        let hpos = hitboxes[i].getPosition();
        let oldId = hitboxes[i].getOldId();
        hitboxes[i].changeOldId(id)
        chessBoard3D[hpos[0]][hpos[1]][hpos[2]] = id;
        chessBoard3D[pos[0]][pos[1]][pos[2]] = 0;
        if (!isCheck(pieces[index].getPosition(), white))
            newHitboxes.push(hitboxes[i]);
        else if (checkerIndex == -1) {
            checkerIndex = findChecker(white, pieces[index].getPosition())[0];
            if (positionsEqual(hpos, pieces[checkerIndex].getPosition()))
                newHitboxes.push(hitboxes[i]);
        }
        else if (positionsEqual(hpos, pieces[checkerIndex].getPosition()))
            newHitboxes.push(hitboxes[i]);
        hitboxes[i].changeOldId(oldId);
        chessBoard3D[hpos[0]][hpos[1]][hpos[2]] = 13;
        chessBoard3D[pos[0]][pos[1]][pos[2]] = id;
    }
    deleteHitboxes();
    hitboxes = newHitboxes;
    buildHitboxes();
}

function positionsEqual(pos1, pos2) {
    return pos1.length === pos2.length && pos1.every((val, i) => val === pos2[i]);
}

function specialHitboxIndexToHitboxesIndex(id, pos, index) {
    let saveHitboxes = hitboxes;
    deleteHitboxes();
    createMoveOprionsHitboxesByID(id, pos);
    let i = hitboxes.findIndex(x => positionsEqual(x.getPosition(), saveHitboxes[index].getPosition()));
    deleteHitboxes();
    hitboxes = saveHitboxes;
    return i;
}

function makeVisiblePromotion(white) {
    if (white == isWhite)
        document.querySelector(white ? '.promote-white' : '.promote-black').style.display = 'flex';
}

function allTakeHitboxes(white, pos) {
    deleteHitboxes();
    let thisId = chessBoard3D[pos[0]][pos[1]][pos[2]];
    chessBoard3D[pos[0]][pos[1]][pos[2]] = 0;
    for (let i = 0; i < pieces.length; i++) {
        let indexId = pieces[i].getId();
        if (pieces[i].isWhite() != white) {
            switch (indexId) {
                case 1 + 6 * white:
                    pawnTake(!white, pieces[i].getPosition(), true);
                    break;
                case 2 + 6 * white:
                    moveKnight(white, pieces[i].getPosition());
                    break;
                case 3 + 6 * white:
                    moveBishop(white, pieces[i].getPosition());
                    break;
                case 4 + 6 * white:
                    moveRook(white, pieces[i].getPosition());
                    break;
                case 5 + 6 * white:
                    moveBishop(white, pieces[i].getPosition());
                    moveRook(1 - white, pieces[i].getPosition());
                    break;
                case 6 + 6 * white:
                    noRestrictionKingMove(pieces[i].getPosition());
                    break;
            }
        }
    }
    if (chessBoard3D[pos[0]][pos[1]][pos[2]] == 13) {
        chessBoard3D[pos[0]][pos[1]][pos[2]] = thisId;
        return true;
    }
    chessBoard3D[pos[0]][pos[1]][pos[2]] = thisId;
    return false;
}

function killAllHitboxes(pos) {
    let thisId = chessBoard3D[pos[0]][pos[1]][pos[2]];
    for (let i = pieces.length - 1; i >= 0; i--)
        deleteHitboxes();
    chessBoard3D[pos[0]][pos[1]][pos[2]] = thisId;
}

function buildHitboxes() {
    for (let i = 0; i < hitboxes.length; i++) {
        let pos = hitboxes[i].getPosition();
        chessBoard3D[pos[0]][pos[1]][pos[2]] = 13;
    }
}

function isTakeable(pos) {
    if (chessBoard3D[pos[0]][pos[1]][pos[2]] == 13)
        return true;
    return false;
}

function deleteHitboxes() {
    hitboxes.slice().reverse().forEach(hitbox => hitbox.destroy());
    hitboxes = [];
}

function movePawn(white, pos) {
    if (chessBoard3D[pos[0] - 1 + 2 * white][pos[1] - 1 + 2 * white][pos[2] - 1 + 2 * white] == 0)
        hitboxes.push(new hitbox(HS, [pos[0] - 1 + 2 * white, pos[1] - 1 + 2 * white, pos[2] - 1 + 2 * white], 13,
            chessBoard3D[pos[0] - 1 + 2 * white][pos[1] - 1 + 2 * white][pos[2] - 1 + 2 * white]));
}

function pawnTake(white, pos, checkCheck = false) {
    if ((chessBoard3D[pos[0] - 1 + 2 * white][pos[1] - 1 + 2 * white][pos[2]] < (7 + 6 * white) && chessBoard3D[pos[0] - 1 + 2 * white][pos[1] - 1 + 2 * white][pos[2]] > (0 + 6 * white)) || checkCheck)
        hitboxes.push(new hitbox(HS, [pos[0] - 1 + 2 * white, pos[1] - 1 + 2 * white, pos[2]], 13,
            chessBoard3D[pos[0] - 1 + 2 * white][pos[1] - 1 + 2 * white][pos[2]]));
    if ((chessBoard3D[pos[0] - 1 + 2 * white][pos[1]][pos[2] - 1 + 2 * white] < (7 + 6 * white) && chessBoard3D[pos[0] - 1 + 2 * white][pos[1]][pos[2] - 1 + 2 * white] > (0 + 6 * white)) || checkCheck)
        hitboxes.push(new hitbox(HS, [pos[0] - 1 + 2 * white, pos[1], pos[2] - 1 + 2 * white], 13,
            chessBoard3D[pos[0] - 1 + 2 * white][pos[1]][pos[2] - 1 + 2 * white]));
    if ((chessBoard3D[pos[0]][pos[1] - 1 + 2 * white][pos[2] - 1 + 2 * white] < (7 + 6 * white) && chessBoard3D[pos[0]][pos[1] - 1 + 2 * white][pos[2] - 1 + 2 * white] > (0 + 6 * white)) || checkCheck)
        hitboxes.push(new hitbox(HS, [pos[0], pos[1] - 1 + 2 * white, pos[2] - 1 + 2 * white], 13,
            chessBoard3D[pos[0]][pos[1] - 1 + 2 * white][pos[2] - 1 + 2 * white]));
}

function moveKnight(white, pos) {
    if (chessBoard3D[pos[0] + 2][pos[1] + 1][pos[2]] == 0 || chessBoard3D[pos[0] + 2][pos[1] + 1][pos[2]] == 13 || (chessBoard3D[pos[0] + 2][pos[1] + 1][pos[2]] > (6 * white) && chessBoard3D[pos[0] + 2][pos[1] + 1][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0] + 2, pos[1] + 1, pos[2]], 13,
            chessBoard3D[pos[0] + 2][pos[1] + 1][pos[2]]));
    if (chessBoard3D[pos[0] + 2][pos[1] - 1][pos[2]] == 0 || chessBoard3D[pos[0] + 2][pos[1] - 1][pos[2]] == 13 || (chessBoard3D[pos[0] + 2][pos[1] - 1][pos[2]] > (6 * white) && chessBoard3D[pos[0] + 2][pos[1] - 1][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0] + 2, pos[1] - 1, pos[2]], 13,
            chessBoard3D[pos[0] + 2][pos[1] - 1][pos[2]]));
    if (chessBoard3D[pos[0] + 2][pos[1]][pos[2] + 1] == 0 || chessBoard3D[pos[0] + 2][pos[1]][pos[2] + 1] == 13 || (chessBoard3D[pos[0] + 2][pos[1]][pos[2] + 1] > (6 * white) && chessBoard3D[pos[0] + 2][pos[1]][pos[2] + 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0] + 2, pos[1], pos[2] + 1], 13,
            chessBoard3D[pos[0] + 2][pos[1]][pos[2] + 1]));
    if (chessBoard3D[pos[0] + 2][pos[1]][pos[2] - 1] == 0 || chessBoard3D[pos[0] + 2][pos[1]][pos[2] - 1] == 13 || (chessBoard3D[pos[0] + 2][pos[1]][pos[2] - 1] > (6 * white) && chessBoard3D[pos[0] + 2][pos[1]][pos[2] - 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0] + 2, pos[1], pos[2] - 1], 13,
            chessBoard3D[pos[0] + 2][pos[1]][pos[2] - 1]));

    if (chessBoard3D[pos[0] - 2][pos[1] + 1][pos[2]] == 0 || chessBoard3D[pos[0] - 2][pos[1] + 1][pos[2]] == 13 || (chessBoard3D[pos[0] - 2][pos[1] + 1][pos[2]] > (6 * white) && chessBoard3D[pos[0] - 2][pos[1] + 1][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0] - 2, pos[1] + 1, pos[2]], 13,
            chessBoard3D[pos[0] - 2][pos[1] + 1][pos[2]]));
    if (chessBoard3D[pos[0] - 2][pos[1] - 1][pos[2]] == 0 || chessBoard3D[pos[0] - 2][pos[1] - 1][pos[2]] == 13 || (chessBoard3D[pos[0] - 2][pos[1] - 1][pos[2]] > (6 * white) && chessBoard3D[pos[0] - 2][pos[1] - 1][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0] - 2, pos[1] - 1, pos[2]], 13,
            chessBoard3D[pos[0] - 2][pos[1] - 1][pos[2]]));
    if (chessBoard3D[pos[0] - 2][pos[1]][pos[2] + 1] == 0 || chessBoard3D[pos[0] - 2][pos[1]][pos[2] + 1] == 13 || (chessBoard3D[pos[0] - 2][pos[1]][pos[2] + 1] > (6 * white) && chessBoard3D[pos[0] - 2][pos[1]][pos[2] + 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0] - 2, pos[1], pos[2] + 1], 13,
            chessBoard3D[pos[0] - 2][pos[1]][pos[2] + 1]));
    if (chessBoard3D[pos[0] - 2][pos[1]][pos[2] - 1] == 0 || chessBoard3D[pos[0] - 2][pos[1]][pos[2] - 1] == 13 || (chessBoard3D[pos[0] - 2][pos[1]][pos[2] - 1] > (6 * white) && chessBoard3D[pos[0] - 2][pos[1]][pos[2] - 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0] - 2, pos[1], pos[2] - 1], 13,
            chessBoard3D[pos[0] - 2][pos[1]][pos[2] - 1]));

    if (chessBoard3D[pos[0] + 1][pos[1] + 2][pos[2]] == 0 || chessBoard3D[pos[0] + 1][pos[1] + 2][pos[2]] == 13 || (chessBoard3D[pos[0] + 1][pos[1] + 2][pos[2]] > (6 * white) && chessBoard3D[pos[0] + 1][pos[1] + 2][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0] + 1, pos[1] + 2, pos[2]], 13,
            chessBoard3D[pos[0] + 1][pos[1] + 2][pos[2]]));
    if (chessBoard3D[pos[0] - 1][pos[1] + 2][pos[2]] == 0 || chessBoard3D[pos[0] - 1][pos[1] + 2][pos[2]] == 13 || (chessBoard3D[pos[0] - 1][pos[1] + 2][pos[2]] > (6 * white) && chessBoard3D[pos[0] - 1][pos[1] + 2][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0] - 1, pos[1] + 2, pos[2]], 13,
            chessBoard3D[pos[0] - 1][pos[1] + 2][pos[2]]));
    if (chessBoard3D[pos[0]][pos[1] + 2][pos[2] + 1] == 0 || chessBoard3D[pos[0]][pos[1] + 2][pos[2] + 1] == 13 || (chessBoard3D[pos[0]][pos[1] + 2][pos[2] + 1] > (6 * white) && chessBoard3D[pos[0]][pos[1] + 2][pos[2] + 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0], pos[1] + 2, pos[2] + 1], 13,
            chessBoard3D[pos[0]][pos[1] + 2][pos[2] + 1]));
    if (chessBoard3D[pos[0]][pos[1] + 2][pos[2] - 1] == 0 || chessBoard3D[pos[0]][pos[1] + 2][pos[2] - 1] == 13 || (chessBoard3D[pos[0]][pos[1] + 2][pos[2] - 1] > (6 * white) && chessBoard3D[pos[0]][pos[1] + 2][pos[2] - 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0], pos[1] + 2, pos[2] - 1], 13,
            chessBoard3D[pos[0]][pos[1] + 2][pos[2] - 1]));

    if (chessBoard3D[pos[0] + 1][pos[1] - 2][pos[2]] == 0 || chessBoard3D[pos[0] + 1][pos[1] - 2][pos[2]] == 13 || (chessBoard3D[pos[0] + 1][pos[1] - 2][pos[2]] > (6 * white) && chessBoard3D[pos[0] + 1][pos[1] - 2][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0] + 1, pos[1] - 2, pos[2]], 13,
            chessBoard3D[pos[0] + 1][pos[1] - 2][pos[2]]));
    if (chessBoard3D[pos[0] - 1][pos[1] - 2][pos[2]] == 0 || chessBoard3D[pos[0] - 1][pos[1] - 2][pos[2]] == 13 || (chessBoard3D[pos[0] - 1][pos[1] - 2][pos[2]] > (6 * white) && chessBoard3D[pos[0] - 1][pos[1] - 2][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0] - 1, pos[1] - 2, pos[2]], 13,
            chessBoard3D[pos[0] - 1][pos[1] - 2][pos[2]]));
    if (chessBoard3D[pos[0]][pos[1] - 2][pos[2] + 1] == 0 || chessBoard3D[pos[0]][pos[1] - 2][pos[2] + 1] == 13 || (chessBoard3D[pos[0]][pos[1] - 2][pos[2] + 1] > (6 * white) && chessBoard3D[pos[0]][pos[1] - 2][pos[2] + 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0], pos[1] - 2, pos[2] + 1], 13,
            chessBoard3D[pos[0]][pos[1] - 2][pos[2] + 1]));
    if (chessBoard3D[pos[0]][pos[1] - 2][pos[2] - 1] == 0 || chessBoard3D[pos[0]][pos[1] - 2][pos[2] - 1] == 13 || (chessBoard3D[pos[0]][pos[1] - 2][pos[2] - 1] > (6 * white) && chessBoard3D[pos[0]][pos[1] - 2][pos[2] - 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0], pos[1] - 2, pos[2] - 1], 13,
            chessBoard3D[pos[0]][pos[1] - 2][pos[2] - 1]));

    if (chessBoard3D[pos[0] + 1][pos[1]][pos[2] + 2] == 0 || chessBoard3D[pos[0] + 1][pos[1]][pos[2] + 2] == 13 || (chessBoard3D[pos[0] + 1][pos[1]][pos[2] + 2] > (6 * white) && chessBoard3D[pos[0] + 1][pos[1]][pos[2] + 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0] + 1, pos[1], pos[2] + 2], 13,
            chessBoard3D[pos[0] + 1][pos[1]][pos[2] + 2]));
    if (chessBoard3D[pos[0] - 1][pos[1]][pos[2] + 2] == 0 || chessBoard3D[pos[0] - 1][pos[1]][pos[2] + 2] == 13 || (chessBoard3D[pos[0] - 1][pos[1]][pos[2] + 2] > (6 * white) && chessBoard3D[pos[0] - 1][pos[1]][pos[2] + 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0] - 1, pos[1], pos[2] + 2], 13,
            chessBoard3D[pos[0] - 1][pos[1]][pos[2] + 2]));
    if (chessBoard3D[pos[0]][pos[1] + 1][pos[2] + 2] == 0 || chessBoard3D[pos[0]][pos[1] + 1][pos[2] + 2] == 13 || (chessBoard3D[pos[0]][pos[1] + 1][pos[2] + 2] > (6 * white) && chessBoard3D[pos[0]][pos[1] + 1][pos[2] + 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0], pos[1] + 1, pos[2] + 2], 13,
            chessBoard3D[pos[0]][pos[1] + 1][pos[2] + 2]));
    if (chessBoard3D[pos[0]][pos[1] - 1][pos[2] + 2] == 0 || chessBoard3D[pos[0]][pos[1] - 1][pos[2] + 2] == 13 || (chessBoard3D[pos[0]][pos[1] - 1][pos[2] + 2] > (6 * white) && chessBoard3D[pos[0]][pos[1] - 1][pos[2] + 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0], pos[1] - 1, pos[2] + 2], 13,
            chessBoard3D[pos[0]][pos[1] - 1][pos[2] + 2]));

    if (chessBoard3D[pos[0] + 1][pos[1]][pos[2] - 2] == 0 || chessBoard3D[pos[0] + 1][pos[1]][pos[2] - 2] == 13 || (chessBoard3D[pos[0] + 1][pos[1]][pos[2] - 2] > (6 * white) && chessBoard3D[pos[0] + 1][pos[1]][pos[2] - 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0] + 1, pos[1], pos[2] - 2], 13,
            chessBoard3D[pos[0] + 1][pos[1]][pos[2] - 2]));
    if (chessBoard3D[pos[0] - 1][pos[1]][pos[2] - 2] == 0 || chessBoard3D[pos[0] - 1][pos[1]][pos[2] - 2] == 13 || (chessBoard3D[pos[0] - 1][pos[1]][pos[2] - 2] > (6 * white) && chessBoard3D[pos[0] - 1][pos[1]][pos[2] - 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0] - 1, pos[1], pos[2] - 2], 13,
            chessBoard3D[pos[0] - 1][pos[1]][pos[2] - 2]));
    if (chessBoard3D[pos[0]][pos[1] + 1][pos[2] - 2] == 0 || chessBoard3D[pos[0]][pos[1] + 1][pos[2] - 2] == 13 || (chessBoard3D[pos[0]][pos[1] + 1][pos[2] - 2] > (6 * white) && chessBoard3D[pos[0]][pos[1] + 1][pos[2] - 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0], pos[1] + 1, pos[2] - 2], 13,
            chessBoard3D[pos[0]][pos[1] + 1][pos[2] - 2]));
    if (chessBoard3D[pos[0]][pos[1] - 1][pos[2] - 2] == 0 || chessBoard3D[pos[0]][pos[1] - 1][pos[2] - 2] == 13 || (chessBoard3D[pos[0]][pos[1] - 1][pos[2] - 2] > (6 * white) && chessBoard3D[pos[0]][pos[1] - 1][pos[2] - 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(HS, [pos[0], pos[1] - 1, pos[2] - 2], 13,
            chessBoard3D[pos[0]][pos[1] - 1][pos[2] - 2]));
}

function moveBishop(white, pos) {
    let i = 1;
    for (i; !chessBoard3D[pos[0] + i][pos[1] + i][pos[2]] || chessBoard3D[pos[0] + i][pos[1] + i][pos[2]] == 13; i++)
        hitboxes.push(new hitbox(HS, [pos[0] + i, pos[1] + i, pos[2]], 13, chessBoard3D[pos[0] + i][pos[1] + i][pos[2]]))
    if (chessBoard3D[pos[0] + i][pos[1] + i][pos[2]] > (6 * white) && chessBoard3D[pos[0] + i][pos[1] + i][pos[2]] < (7 + 6 * white))
        hitboxes.push(new hitbox(HS, [pos[0] + i, pos[1] + i, pos[2]], 13, chessBoard3D[pos[0] + i][pos[1] + i][pos[2]]))
    i = 1;
    for (i; !chessBoard3D[pos[0] + i][pos[1] - i][pos[2]] || chessBoard3D[pos[0] + i][pos[1] - i][pos[2]] == 13; i++)
        hitboxes.push(new hitbox(HS, [pos[0] + i, pos[1] - i, pos[2]], 13, chessBoard3D[pos[0] + i][pos[1] - i][pos[2]]))
    if (chessBoard3D[pos[0] + i][pos[1] - i][pos[2]] > (6 * white) && chessBoard3D[pos[0] + i][pos[1] - i][pos[2]] < (7 + 6 * white))
        hitboxes.push(new hitbox(HS, [pos[0] + i, pos[1] - i, pos[2]], 13, chessBoard3D[pos[0] + i][pos[1] - i][pos[2]]))
    i = 1;
    for (i; !chessBoard3D[pos[0] - i][pos[1] + i][pos[2]] || chessBoard3D[pos[0] - i][pos[1] + i][pos[2]] == 13; i++)
        hitboxes.push(new hitbox(HS, [pos[0] - i, pos[1] + i, pos[2]], 13, chessBoard3D[pos[0] - i][pos[1] + i][pos[2]]))
    if (chessBoard3D[pos[0] - i][pos[1] + i][pos[2]] > (6 * white) && chessBoard3D[pos[0] - i][pos[1] + i][pos[2]] < (7 + 6 * white))
        hitboxes.push(new hitbox(HS, [pos[0] - i, pos[1] + i, pos[2]], 13, chessBoard3D[pos[0] - i][pos[1] + i][pos[2]]))
    i = 1;
    for (i; !chessBoard3D[pos[0] - i][pos[1] - i][pos[2]] || chessBoard3D[pos[0] - i][pos[1] - i][pos[2]] == 13; i++)
        hitboxes.push(new hitbox(HS, [pos[0] - i, pos[1] - i, pos[2]], 13, chessBoard3D[pos[0] - i][pos[1] - i][pos[2]]))
    if (chessBoard3D[pos[0] - i][pos[1] - i][pos[2]] > (6 * white) && chessBoard3D[pos[0] - i][pos[1] - i][pos[2]] < (7 + 6 * white))
        hitboxes.push(new hitbox(HS, [pos[0] - i, pos[1] - i, pos[2]], 13, chessBoard3D[pos[0] - i][pos[1] - i][pos[2]]))

    i = 1;
    for (i; !chessBoard3D[pos[0] + i][pos[1]][pos[2] + i] || chessBoard3D[pos[0] + i][pos[1]][pos[2] + i] == 13; i++)
        hitboxes.push(new hitbox(HS, [pos[0] + i, pos[1], pos[2] + i], 13, chessBoard3D[pos[0] + i][pos[1]][pos[2] + i]))
    if (chessBoard3D[pos[0] + i][pos[1]][pos[2] + i] > (6 * white) && chessBoard3D[pos[0] + i][pos[1]][pos[2] + i] < (7 + 6 * white))
        hitboxes.push(new hitbox(HS, [pos[0] + i, pos[1], pos[2] + i], 13, chessBoard3D[pos[0] + i][pos[1]][pos[2] + i]))
    i = 1;
    for (i; !chessBoard3D[pos[0] + i][pos[1]][pos[2] - i] || chessBoard3D[pos[0] + i][pos[1]][pos[2] - i] == 13; i++)
        hitboxes.push(new hitbox(HS, [pos[0] + i, pos[1], pos[2] - i], 13, chessBoard3D[pos[0] + i][pos[1]][pos[2] - i]))
    if (chessBoard3D[pos[0] + i][pos[1]][pos[2] - i] > (6 * white) && chessBoard3D[pos[0] + i][pos[1]][pos[2] - i] < (7 + 6 * white))
        hitboxes.push(new hitbox(HS, [pos[0] + i, pos[1], pos[2] - i], 13, chessBoard3D[pos[0] + i][pos[1]][pos[2] - i]))
    i = 1;
    for (i; !chessBoard3D[pos[0] - i][pos[1]][pos[2] + i] || chessBoard3D[pos[0] - i][pos[1]][pos[2] + i] == 13; i++)
        hitboxes.push(new hitbox(HS, [pos[0] - i, pos[1], pos[2] + i], 13, chessBoard3D[pos[0] - i][pos[1]][pos[2] + i]))
    if (chessBoard3D[pos[0] - i][pos[1]][pos[2] + i] > (6 * white) && chessBoard3D[pos[0] - i][pos[1]][pos[2] + i] < (7 + 6 * white))
        hitboxes.push(new hitbox(HS, [pos[0] - i, pos[1], pos[2] + i], 13, chessBoard3D[pos[0] - i][pos[1]][pos[2] + i]))
    i = 1;
    for (i; !chessBoard3D[pos[0] - i][pos[1]][pos[2] - i] || chessBoard3D[pos[0] - i][pos[1]][pos[2] - i] == 13; i++)
        hitboxes.push(new hitbox(HS, [pos[0] - i, pos[1], pos[2] - i], 13, chessBoard3D[pos[0] - i][pos[1]][pos[2] - i]))
    if (chessBoard3D[pos[0] - i][pos[1]][pos[2] - i] > (6 * white) && chessBoard3D[pos[0] - i][pos[1]][pos[2] - i] < (7 + 6 * white))
        hitboxes.push(new hitbox(HS, [pos[0] - i, pos[1], pos[2] - i], 13, chessBoard3D[pos[0] - i][pos[1]][pos[2] - i]))

    i = 1;
    for (i; !chessBoard3D[pos[0]][pos[1] + i][pos[2] + i] || chessBoard3D[pos[0]][pos[1] + i][pos[2] + i] == 13; i++)
        hitboxes.push(new hitbox(HS, [pos[0], pos[1] + i, pos[2] + i], 13, chessBoard3D[pos[0]][pos[1] + i][pos[2] + i]))
    if (chessBoard3D[pos[0]][pos[1] + i][pos[2] + i] > (6 * white) && chessBoard3D[pos[0]][pos[1] + i][pos[2] + i] < (7 + 6 * white))
        hitboxes.push(new hitbox(HS, [pos[0], pos[1] + i, pos[2] + i], 13, chessBoard3D[pos[0]][pos[1] + i][pos[2] + i]))
    i = 1;
    for (i; !chessBoard3D[pos[0]][pos[1] + i][pos[2] - i] || chessBoard3D[pos[0]][pos[1] + i][pos[2] - i] == 13; i++)
        hitboxes.push(new hitbox(HS, [pos[0], pos[1] + i, pos[2] - i], 13, chessBoard3D[pos[0]][pos[1] + i][pos[2] - i]))
    if (chessBoard3D[pos[0]][pos[1] + i][pos[2] - i] > (6 * white) && chessBoard3D[pos[0]][pos[1] + i][pos[2] - i] < (7 + 6 * white))
        hitboxes.push(new hitbox(HS, [pos[0], pos[1] + i, pos[2] - i], 13, chessBoard3D[pos[0]][pos[1] + i][pos[2] - i]))
    i = 1;
    for (i; !chessBoard3D[pos[0]][pos[1] - i][pos[2] + i] || chessBoard3D[pos[0]][pos[1] - i][pos[2] + i] == 13; i++)
        hitboxes.push(new hitbox(HS, [pos[0], pos[1] - i, pos[2] + i], 13, chessBoard3D[pos[0]][pos[1] - i][pos[2] + i]))
    if (chessBoard3D[pos[0]][pos[1] - i][pos[2] + i] > (6 * white) && chessBoard3D[pos[0]][pos[1] - i][pos[2] + i] < (7 + 6 * white))
        hitboxes.push(new hitbox(HS, [pos[0], pos[1] - i, pos[2] + i], 13, chessBoard3D[pos[0]][pos[1] - i][pos[2] + i]))
    i = 1;
    for (i; !chessBoard3D[pos[0]][pos[1] - i][pos[2] - i] || chessBoard3D[pos[0]][pos[1] - i][pos[2] - i] == 13; i++)
        hitboxes.push(new hitbox(HS, [pos[0], pos[1] - i, pos[2] - i], 13, chessBoard3D[pos[0]][pos[1] - i][pos[2] - i]))
    if (chessBoard3D[pos[0]][pos[1] - i][pos[2] - i] > (6 * white) && chessBoard3D[pos[0]][pos[1] - i][pos[2] - i] < (7 + 6 * white))
        hitboxes.push(new hitbox(HS, [pos[0], pos[1] - i, pos[2] - i], 13, chessBoard3D[pos[0]][pos[1] - i][pos[2] - i]))
}

function moveRook(white, pos) {
    let i = 1;
    for (i; !chessBoard3D[pos[0] + i][pos[1]][pos[2]] || chessBoard3D[pos[0] + i][pos[1]][pos[2]] == 13; i++)
        hitboxes.push(new hitbox(HS, [pos[0] + i, pos[1], pos[2]], 13))
    if (chessBoard3D[pos[0] + i][pos[1]][pos[2]] > (6 * white) && chessBoard3D[pos[0] + i][pos[1]][pos[2]] < (7 + 6 * white))
        hitboxes.push(new hitbox(HS, [pos[0] + i, pos[1], pos[2]], 13, chessBoard3D[pos[0] + i][pos[1]][pos[2]]))

    i = 1;
    for (i; !chessBoard3D[pos[0] - i][pos[1]][pos[2]] || chessBoard3D[pos[0] - i][pos[1]][pos[2]] == 13; i++)
        hitboxes.push(new hitbox(HS, [pos[0] - i, pos[1], pos[2]], 13))
    if (chessBoard3D[pos[0] - i][pos[1]][pos[2]] > (6 * white) && chessBoard3D[pos[0] - i][pos[1]][pos[2]] < (7 + 6 * white))
        hitboxes.push(new hitbox(HS, [pos[0] - i, pos[1], pos[2]], 13, chessBoard3D[pos[0] - i][pos[1]][pos[2]]))

    i = 1;
    for (i; !chessBoard3D[pos[0]][pos[1] + i][pos[2]] || chessBoard3D[pos[0]][pos[1] + i][pos[2]] == 13; i++)
        hitboxes.push(new hitbox(HS, [pos[0], pos[1] + i, pos[2]], 13))
    if (chessBoard3D[pos[0]][pos[1] + i][pos[2]] > (6 * white) && chessBoard3D[pos[0]][pos[1] + i][pos[2]] < (7 + 6 * white))
        hitboxes.push(new hitbox(HS, [pos[0], pos[1] + i, pos[2]], 13, chessBoard3D[pos[0]][pos[1] + i][pos[2]]))

    i = 1;
    for (i; !chessBoard3D[pos[0]][pos[1] - i][pos[2]] || chessBoard3D[pos[0]][pos[1] - i][pos[2]] == 13; i++)
        hitboxes.push(new hitbox(HS, [pos[0], pos[1] - i, pos[2]], 13))
    if (chessBoard3D[pos[0]][pos[1] - i][pos[2]] > (6 * white) && chessBoard3D[pos[0]][pos[1] - i][pos[2]] < (7 + 6 * white))
        hitboxes.push(new hitbox(HS, [pos[0], pos[1] - i, pos[2]], 13, chessBoard3D[pos[0]][pos[1] - i][pos[2]]))

    i = 1;
    for (i; !chessBoard3D[pos[0]][pos[1]][pos[2] + i] || chessBoard3D[pos[0]][pos[1]][pos[2] + i] == 13; i++)
        hitboxes.push(new hitbox(HS, [pos[0], pos[1], pos[2] + i], 13))
    if (chessBoard3D[pos[0]][pos[1]][pos[2] + i] > (6 * white) && chessBoard3D[pos[0]][pos[1]][pos[2] + i] < (7 + 6 * white))
        hitboxes.push(new hitbox(HS, [pos[0], pos[1], pos[2] + i], 13, chessBoard3D[pos[0]][pos[1]][pos[2] + i]))

    i = 1;
    for (i; !chessBoard3D[pos[0]][pos[1]][pos[2] - i] || chessBoard3D[pos[0]][pos[1]][pos[2] - i] == 13; i++)
        hitboxes.push(new hitbox(HS, [pos[0], pos[1], pos[2] - i], 13))
    if (chessBoard3D[pos[0]][pos[1]][pos[2] - i] > (6 * white) && chessBoard3D[pos[0]][pos[1]][pos[2] - i] < (7 + 6 * white))
        hitboxes.push(new hitbox(HS, [pos[0], pos[1], pos[2] - i], 13, chessBoard3D[pos[0]][pos[1]][pos[2] - i]))
}

function moveKing(white, pos) {
    let newHitboxes = [];
    allTakeHitboxes(white, pos);
    for (let i = -1; i < 2; i++)
        for (let j = -1; j < 2; j++)
            for (let k = -1; k < 2; k++) {
                if (!isTakeable([pos[0] + i, pos[1] + j, pos[2] + k]) && (chessBoard3D[pos[0] + i][pos[1] + j][pos[2] + k] == 0 ||
                    (chessBoard3D[pos[0] + i][pos[1] + j][pos[2] + k] > (6 * white) && chessBoard3D[pos[0] + i][pos[1] + j][pos[2] + k] < (7 + 6 * white))))
                    newHitboxes.push(new hitbox(HS, [pos[0] + i, pos[1] + j, pos[2] + k], 13, chessBoard3D[pos[0] + i][pos[1] + j][pos[2] + k]));
            }
    killAllHitboxes(pos);
    hitboxes = newHitboxes;
    buildHitboxes();
}

function noRestrictionKingMove(pos) {
    for (let i = -1; i < 2; i++)
        for (let j = -1; j < 2; j++)
            for (let k = -1; k < 2; k++)
                hitboxes.push(new hitbox(HS, [pos[0] + i, pos[1] + j, pos[2] + k], 13, chessBoard3D[pos[0] + i][pos[1] + j][pos[2] + k]));
}

function isCheck(pos, white = isWhite) {
    let saveHitboxes = hitboxes;
    if (chessBoard3D[pos[0]][pos[1]][pos[2]] == 12 - 6 * white) {
        if (allTakeHitboxes(white, pos)) {
            killAllHitboxes(pos);
            hitboxes = saveHitboxes;
            buildHitboxes();
            return true;
        }
        killAllHitboxes(pos);
    }
    hitboxes = saveHitboxes;
    buildHitboxes();
    return false;
}

function findChecker(white, pos) {
    let checkersIndexes = [];
    let saveHitboxes = hitboxes;
    deleteHitboxes();
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].isWhite() != white) {
            createMoveOprionsHitboxesByID(pieces[i].getId(), pieces[i].getPosition());
            if (chessBoard3D[pos[0]][pos[1]][pos[2]] == 13) {
                checkersIndexes.push(i);
            }
            deleteHitboxes();
        }
    }
    hitboxes = saveHitboxes;
    buildHitboxes();
    return checkersIndexes;
}

function isCheckmate(pos, white = isWhite) {
    if (isCheck(pos, white) && chessBoard3D[pos[0]][pos[1]][pos[2]] == 12 - 6 * white) {
        moveKing(white, pos);
        if (hitboxes.length == 0) {
            let calcTakers = 0;
            for (let i = 0; i < pieces.length; i++) {
                if (pieces[i].isWhite() == white)
                    calcTakers += (canTakeChecker(pieces[i].getId(), pieces[i].getPosition()) + canBlockCheck(pieces[i].getId(), pieces[i].getPosition()));
            }
            deleteHitboxes();
            if (calcTakers == 0)
                return true;
        }
        deleteHitboxes()
    }
    return false;
}

function isStealmate(white = isWhite) {
    if (pieces.length == 2)
        return true;
    else {
        let stealmate = true;
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].isWhite() == white) {
                let id = pieces[i].getId();
                switch (id) {
                    case 7 - 6 * white:
                        pawnTake(white, pieces[i].getPosition());
                        if (hitboxes.length > 0)
                            stealmate = false;
                        deleteHitboxes();
                        movePawn(white, pieces[i].getPosition())
                        if (hitboxes.length > 0)
                            stealmate = false;
                        deleteHitboxes();
                        break;
                    case 8 - 6 * white:
                        moveKnight(white, pieces[i].getPosition());
                        if (hitboxes.length > 0)
                            stealmate = false;
                        deleteHitboxes();
                        break;
                    case 9 - 6 * white:
                        moveBishop(white, pieces[i].getPosition());
                        if (hitboxes.length > 0)
                            stealmate = false;
                        deleteHitboxes();
                        break;
                    case 10 - 6 * white:
                        moveRook(white, pieces[i].getPosition());
                        if (hitboxes.length > 0)
                            stealmate = false;
                        deleteHitboxes();
                        break;
                    case 11 - 6 * white:
                        moveBishop(white, pieces[i].getPosition());
                        moveRook(1 - white, pieces[i].getPosition());
                        if (hitboxes.length > 0)
                            stealmate = false;
                        deleteHitboxes();
                        break;
                    case 12 - 6 * white:
                        moveKing(white, pieces[i].getPosition());
                        if (hitboxes.length > 0)
                            stealmate = false;
                        deleteHitboxes();
                        break;
                }
            }
        }
        return stealmate;
    }
}