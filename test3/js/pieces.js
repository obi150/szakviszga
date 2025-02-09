let chessBoard3D = new Array;
let hitboxes = [];

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
    getPosition() {
        return this.#position;
    }
    getRadius() {
        return this.#r;
    }
    getId() {
        return this.#id;
    }
    isHit(vect, O) {
        let dis = calculateDistance(boardPositionToCoord(this.#position), vect, O);
        console.log(dis);
        return dis < this.#r && dis >= 0;
    }
};

setUpChessBoard();

let pieces = [new hitbox(25, [3, 3, 3], 1), new hitbox(25, [9, 9, 9], 2), new hitbox(25, [4, 4, 3], 1)];

let currentPieceIndex = 0;

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

function boardPositionToCoord(pos) {
    return [200 - 50 * (pos[0] - 2), 200 - 50 * (pos[1] - 2), 200 - 50 * (pos[2] - 2)];
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
                    chessBoard3D[i][j][k] = 0;
        }
    }
}

function createMoveOprionsHitboxesByID(id, pos) {
    switch (id) {
        case 1:
        case 7:
            movePawn(id == 1, pos);
            break;
        case 2:
        case 8:
            moveKnight(id == 2, pos);
            break;
        case 3:
        case 9:
            moveBishop(id == 3, pos);
            break;
        case 4:
        case 10:
            moveRook(id == 4, pos);
            break;
        case 5:
        case 11:
            moveQueen(id == 5, pos);
            break;
        case 6:
        case 12:
            moveKing(id == 6, pos);
            break;
        case 13:
            hitboxes.forEach(hitbox => hitbox.destroy());
            hitboxes = [];
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
        pieces[pieceIndex].destroy();
        pieces.splice(pieceIndex, 1);
    }
}

function movePawn(white, pos) {
    hitboxes.forEach(hitbox => hitbox.destroy());
    hitboxes = [];
    if (chessBoard3D[pos[0] - 1 + 2 * white][pos[1] - 1 + 2 * white][pos[2] - 1 + 2 * white] == 0)
        hitboxes.push(new hitbox(25, [pos[0] - 1 + 2 * white, pos[1] - 1 + 2 * white, pos[2] - 1 + 2 * white], 13,
            chessBoard3D[pos[0] - 1 + 2 * white][pos[1] - 1 + 2 * white][pos[2] - 1 + 2 * white]));
    if (chessBoard3D[pos[0] - 1 + 2 * white][pos[1] - 1 + 2 * white][pos[2]] < (7 + 6 * white) && chessBoard3D[pos[0] - 1 + 2 * white][pos[1] - 1 + 2 * white][pos[2]] > (0 + 6 * white))
        hitboxes.push(new hitbox(25, [pos[0] - 1 + 2 * white, pos[1] - 1 + 2 * white, pos[2]], 13,
            chessBoard3D[pos[0] - 1 + 2 * white][pos[1] - 1 + 2 * white][pos[2]]));
    if (chessBoard3D[pos[0] - 1 + 2 * white][pos[1]][pos[2] - 1 + 2 * white] < (7 + 6 * white) && chessBoard3D[pos[0] - 1 + 2 * white][pos[1]][pos[2] - 1 + 2 * white] > (0 + 6 * white))
        hitboxes.push(new hitbox(25, [pos[0] - 1 + 2 * white, pos[1], pos[2] - 1 + 2 * white], 13,
            chessBoard3D[pos[0] - 1 + 2 * white][pos[1]][pos[2] - 1 + 2 * white]));
    if (chessBoard3D[pos[0]][pos[1] - 1 + 2 * white][pos[2] - 1 + 2 * white] < (7 + 6 * white) && chessBoard3D[pos[0]][pos[1] - 1 + 2 * white][pos[2] - 1 + 2 * white] > (0 + 6 * white))
        hitboxes.push(new hitbox(25, [pos[0], pos[1] - 1 + 2 * white, pos[2] - 1 + 2 * white], 13,
            chessBoard3D[pos[0]][pos[1] - 1 + 2 * white][pos[2] - 1 + 2 * white]));
}

function moveKnight(white, pos) {
    hitboxes.forEach(hitbox => hitbox.destroy());
    hitboxes = [];
    if (chessBoard3D[pos[0] + 2][pos[1] + 1][pos[2]] == 0 || (chessBoard3D[pos[0] + 2][pos[1] + 1][pos[2]] > (6 * white) && chessBoard3D[pos[0] + 2][pos[1] + 1][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0] + 2, pos[1] + 1, pos[2]], 13,
            chessBoard3D[pos[0] + 2][pos[1] + 1][pos[2]]));
    if (chessBoard3D[pos[0] + 2][pos[1] - 1][pos[2]] == 0 || (chessBoard3D[pos[0] + 2][pos[1] - 1][pos[2]] > (6 * white) && chessBoard3D[pos[0] + 2][pos[1] - 1][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0] + 2, pos[1] - 1, pos[2]], 13,
            chessBoard3D[pos[0] + 2][pos[1] - 1][pos[2]]));
    if (chessBoard3D[pos[0] + 2][pos[1]][pos[2] + 1] == 0 || (chessBoard3D[pos[0] + 2][pos[1]][pos[2] + 1] > (6 * white) && chessBoard3D[pos[0] + 2][pos[1]][pos[2] + 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0] + 2, pos[1], pos[2] + 1], 13,
            chessBoard3D[pos[0] + 2][pos[1]][pos[2] + 1]));
    if (chessBoard3D[pos[0] + 2][pos[1]][pos[2] - 1] == 0 || (chessBoard3D[pos[0] + 2][pos[1]][pos[2] - 1] > (6 * white) && chessBoard3D[pos[0] + 2][pos[1]][pos[2] - 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0] + 2, pos[1], pos[2] - 1], 13,
            chessBoard3D[pos[0] + 2][pos[1]][pos[2] - 1]));

    if (chessBoard3D[pos[0] - 2][pos[1] + 1][pos[2]] == 0 || (chessBoard3D[pos[0] - 2][pos[1] + 1][pos[2]] > (6 * white) && chessBoard3D[pos[0] - 2][pos[1] + 1][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0] - 2, pos[1] + 1, pos[2]], 13,
            chessBoard3D[pos[0] - 2][pos[1] + 1][pos[2]]));
    if (chessBoard3D[pos[0] - 2][pos[1] - 1][pos[2]] == 0 || (chessBoard3D[pos[0] - 2][pos[1] - 1][pos[2]] > (6 * white) && chessBoard3D[pos[0] - 2][pos[1] - 1][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0] - 2, pos[1] - 1, pos[2]], 13,
            chessBoard3D[pos[0] - 2][pos[1] - 1][pos[2]]));
    if (chessBoard3D[pos[0] - 2][pos[1]][pos[2] + 1] == 0 || (chessBoard3D[pos[0] - 2][pos[1]][pos[2] + 1] > (6 * white) && chessBoard3D[pos[0] - 2][pos[1]][pos[2] + 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0] - 2, pos[1], pos[2] + 1], 13,
            chessBoard3D[pos[0] - 2][pos[1]][pos[2] + 1]));
    if (chessBoard3D[pos[0] - 2][pos[1]][pos[2] - 1] == 0 || (chessBoard3D[pos[0] - 2][pos[1]][pos[2] - 1] > (6 * white) && chessBoard3D[pos[0] - 2][pos[1]][pos[2] - 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0] - 2, pos[1], pos[2] - 1], 13,
            chessBoard3D[pos[0] - 2][pos[1]][pos[2] - 1]));

    if (chessBoard3D[pos[0] + 1][pos[1] + 2][pos[2]] == 0 || (chessBoard3D[pos[0] + 1][pos[1] + 2][pos[2]] > (6 * white) && chessBoard3D[pos[0] + 1][pos[1] + 2][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0] + 1, pos[1] + 2, pos[2]], 13,
            chessBoard3D[pos[0] + 1][pos[1] + 2][pos[2]]));
    if (chessBoard3D[pos[0] - 1][pos[1] + 2][pos[2]] == 0 || (chessBoard3D[pos[0] - 1][pos[1] + 2][pos[2]] > (6 * white) && chessBoard3D[pos[0] - 1][pos[1] + 2][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0] - 1, pos[1] + 2, pos[2]], 13,
            chessBoard3D[pos[0] - 1][pos[1] + 2][pos[2]]));
    if (chessBoard3D[pos[0]][pos[1] + 2][pos[2] + 1] == 0 || (chessBoard3D[pos[0]][pos[1] + 2][pos[2] + 1] > (6 * white) && chessBoard3D[pos[0]][pos[1] + 2][pos[2] + 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0], pos[1] + 2, pos[2] + 1], 13,
            chessBoard3D[pos[0]][pos[1] + 2][pos[2] + 1]));
    if (chessBoard3D[pos[0]][pos[1] + 2][pos[2] - 1] == 0 || (chessBoard3D[pos[0]][pos[1] + 2][pos[2] - 1] > (6 * white) && chessBoard3D[pos[0]][pos[1] + 2][pos[2] - 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0], pos[1] + 2, pos[2] - 1], 13,
            chessBoard3D[pos[0]][pos[1] + 2][pos[2] - 1]));

    if (chessBoard3D[pos[0] + 1][pos[1] - 2][pos[2]] == 0 || (chessBoard3D[pos[0] + 1][pos[1] - 2][pos[2]] > (6 * white) && chessBoard3D[pos[0] + 1][pos[1] - 2][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0] + 1, pos[1] - 2, pos[2]], 13,
            chessBoard3D[pos[0] + 1][pos[1] - 2][pos[2]]));
    if (chessBoard3D[pos[0] - 1][pos[1] - 2][pos[2]] == 0 || (chessBoard3D[pos[0] - 1][pos[1] - 2][pos[2]] > (6 * white) && chessBoard3D[pos[0] - 1][pos[1] - 2][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0] - 1, pos[1] - 2, pos[2]], 13,
            chessBoard3D[pos[0] - 1][pos[1] - 2][pos[2]]));
    if (chessBoard3D[pos[0]][pos[1] - 2][pos[2] + 1] == 0 || (chessBoard3D[pos[0]][pos[1] - 2][pos[2] + 1] > (6 * white) && chessBoard3D[pos[0]][pos[1] - 2][pos[2] + 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0], pos[1] - 2, pos[2] + 1], 13,
            chessBoard3D[pos[0]][pos[1] - 2][pos[2] + 1]));
    if (chessBoard3D[pos[0]][pos[1] - 2][pos[2] - 1] == 0 || (chessBoard3D[pos[0]][pos[1] - 2][pos[2] - 1] > (6 * white) && chessBoard3D[pos[0]][pos[1] - 2][pos[2] - 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0], pos[1] - 2, pos[2] - 1], 13,
            chessBoard3D[pos[0]][pos[1] - 2][pos[2] - 1]));

    if (chessBoard3D[pos[0] + 1][pos[1]][pos[2] + 2] == 0 || (chessBoard3D[pos[0] + 1][pos[1]][pos[2] + 2] > (6 * white) && chessBoard3D[pos[0] + 1][pos[1]][pos[2] + 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0] + 1, pos[1], pos[2] + 2], 13,
            chessBoard3D[pos[0] + 1][pos[1]][pos[2] + 2]));
    if (chessBoard3D[pos[0] - 1][pos[1]][pos[2] + 2] == 0 || (chessBoard3D[pos[0] - 1][pos[1]][pos[2] + 2] > (6 * white) && chessBoard3D[pos[0] - 1][pos[1]][pos[2] + 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0] - 1, pos[1], pos[2] + 2], 13,
            chessBoard3D[pos[0] - 1][pos[1]][pos[2] + 2]));
    if (chessBoard3D[pos[0]][pos[1] + 1][pos[2] + 2] == 0 || (chessBoard3D[pos[0]][pos[1] + 1][pos[2] + 2] > (6 * white) && chessBoard3D[pos[0]][pos[1] + 1][pos[2] + 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0], pos[1] + 1, pos[2] + 2], 13,
            chessBoard3D[pos[0]][pos[1] + 1][pos[2] + 2]));
    if (chessBoard3D[pos[0]][pos[1] - 1][pos[2] + 2] == 0 || (chessBoard3D[pos[0]][pos[1] - 1][pos[2] + 2] > (6 * white) && chessBoard3D[pos[0]][pos[1] - 1][pos[2] + 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0], pos[1] - 1, pos[2] + 2], 13,
            chessBoard3D[pos[0]][pos[1] - 1][pos[2] + 2]));

    if (chessBoard3D[pos[0] + 1][pos[1]][pos[2] - 2] == 0 || (chessBoard3D[pos[0] + 1][pos[1]][pos[2] - 2] > (6 * white) && chessBoard3D[pos[0] + 1][pos[1]][pos[2] - 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0] + 1, pos[1], pos[2] - 2], 13,
            chessBoard3D[pos[0] + 1][pos[1]][pos[2] - 2]));
    if (chessBoard3D[pos[0] - 1][pos[1]][pos[2] - 2] == 0 || (chessBoard3D[pos[0] - 1][pos[1]][pos[2] - 2] > (6 * white) && chessBoard3D[pos[0] - 1][pos[1]][pos[2] - 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0] - 1, pos[1], pos[2] - 2], 13,
            chessBoard3D[pos[0] - 1][pos[1]][pos[2] - 2]));
    if (chessBoard3D[pos[0]][pos[1] + 1][pos[2] - 2] == 0 || (chessBoard3D[pos[0]][pos[1] + 1][pos[2] - 2] > (6 * white) && chessBoard3D[pos[0]][pos[1] + 1][pos[2] - 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0], pos[1] + 1, pos[2] - 2], 13,
            chessBoard3D[pos[0]][pos[1] + 1][pos[2] - 2]));
    if (chessBoard3D[pos[0]][pos[1] - 1][pos[2] - 2] == 0 || (chessBoard3D[pos[0]][pos[1] - 1][pos[2] - 2] > (6 * white) && chessBoard3D[pos[0]][pos[1] - 1][pos[2] - 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25, [pos[0], pos[1] - 1, pos[2] - 2], 13,
            chessBoard3D[pos[0]][pos[1] - 1][pos[2] - 2]));
}
