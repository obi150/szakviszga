let chessBoard3D = new Array;

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

function setUpChessBoard() {
	for (let i = 0; i < 10; i++) {
		chessBoard3D[i] = new Array;
		for (let j = 0; j < 10; j++) {
			chessBoard3D[i][j] = new Array;
			for (let e = 0; e < 10; e++)
				if (i == 0 || j == 0 || e == 0 || i == 9 || j == 9 || e == 9)
					chessBoard3D[i][j][e] = -1;
				else
					chessBoard3D[i][j][e] = 0;
		}
	}
}

function createMoveOprionsHitboxesByID(id, pos) {
    let moveOptions = new Array;
    switch (id) {
        case 1:
        case 7:
            moveOptions = movePawn(id == 1, pos);
            break;
        case 2:
        case 8:
            moveOptions = moveKnight(id == 2, pos);
            break;
        case 3:
        case 9:
            moveOptions = moveBishop(id == 3, pos);
            break;
        case 4:
        case 10:
            moveOptions = moveRook(id == 4, pos);
            break;
        case 5:
        case 11:
            moveOptions = moveQueen(id == 5, pos);
            break;
        case 6:
        case 12:
            moveOptions = moveKing(id == 6, pos);
            break;
    }
    return moveOptions;
}

function movePawn(white, pos) {
    let hitboxes = new Array;
    if (chessBoard3D[pos[1] - 1 + 2 * white][pos[2] - 1 + 2 * white][pos[3] - 1 + 2 * white] == 0)
        hitboxes.push(new hitbox(25, [pos[1] - 1 + 2 * white, pos[2] - 1 + 2 * white, pos[3] - 1 + 2 * white]));
    if (chessBoard3D[pos[1] - 1 + 2 * white][pos[2] - 1 + 2 * white][pos[3]] < (7 + 6 * white) && chessBoard3D[pos[1] - 1 + 2 * white][pos[2] - 1 + 2 * white][pos[3]] > (0 + 6 * white))
        hitboxes.push(new hitbox(25, [pos[1] - 1 + 2 * white, pos[2] - 1 + 2 * white, pos[3]]));
    if (chessBoard3D[pos[1] - 1 + 2 * white][pos[2]][pos[3] - 1 + 2 * white] < (7 + 6 * white) && chessBoard3D[pos[1] - 1 + 2 * white][pos[2]][pos[3] - 1 + 2 * white] > (0 + 6 * white))
        hitboxes.push(new hitbox(25, [pos[1] - 1 + 2 * white, pos[2], pos[3] - 1 + 2 * white]));
    if (chessBoard3D[pos[1]][pos[2] - 1 + 2 * white][pos[3] - 1 + 2 * white] < (7 + 6 * white) && chessBoard3D[pos[1]][pos[2] - 1 + 2 * white][pos[3] - 1 + 2 * white] > (0 + 6 * white))
        hitboxes.push(new hitbox(25, [pos[1], pos[2] - 1 + 2 * white, pos[3] - 1 + 2 * white]));
    return hitboxes;
}
