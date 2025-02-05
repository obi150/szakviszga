let chessBoard3D = new Array;
let hitboxes = [];

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
	for (let i = 0; i < 12; i++) {
		chessBoard3D[i] = new Array;
		for (let j = 0; j < 12; j++) {
			chessBoard3D[i][j] = new Array;
			for (let e = 0; e < 12; e++)
				if (i < 2 || j < 2> 0 || e < 2 || i > 9 || j > 9 || e > 9)
					chessBoard3D[i][j][e] = -1;
				else
					chessBoard3D[i][j][e] = 0;
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
    }
}

function movePawn(white, pos) {
    hitboxes = [];
    if (chessBoard3D[pos[0] - 1 + 2 * white][pos[1] - 1 + 2 * white][pos[2] - 1 + 2 * white] == 0)
        hitboxes.push(new hitbox(25, [pos[0] - 1 + 2 * white, pos[1] - 1 + 2 * white, pos[2] - 1 + 2 * white]));
    if (chessBoard3D[pos[0] - 1 + 2 * white][pos[1] - 1 + 2 * white][pos[2]] < (7 + 6 * white) && chessBoard3D[pos[0] - 1 + 2 * white][pos[1] - 1 + 2 * white][pos[2]] > (0 + 6 * white))
        hitboxes.push(new hitbox(25, [pos[0] - 1 + 2 * white, pos[1] - 1 + 2 * white, pos[2]]));
    if (chessBoard3D[pos[0] - 1 + 2 * white][pos[1]][pos[2] - 1 + 2 * white] < (7 + 6 * white) && chessBoard3D[pos[0] - 1 + 2 * white][pos[1]][pos[2] - 1 + 2 * white] > (0 + 6 * white))
        hitboxes.push(new hitbox(25, [pos[0] - 1 + 2 * white, pos[1], pos[2] - 1 + 2 * white]));
    if (chessBoard3D[pos[0]][pos[1] - 1 + 2 * white][pos[2] - 1 + 2 * white] < (7 + 6 * white) && chessBoard3D[pos[0]][pos[1] - 1 + 2 * white][pos[2] - 1 + 2 * white] > (0 + 6 * white))
        hitboxes.push(new hitbox(25, [pos[0], pos[1] - 1 + 2 * white, pos[2] - 1 + 2 * white]));
}

function moveKnight(white, pos) {
    let hitboxes = [];
    if(chessBoard3D[pos[0] + 2][pos[1] + 1][pos[2]] == 0 || (chessBoard3D[pos[0] + 2][pos[1] + 1][pos[2]] > (6 * white) && chessBoard3D[pos[0] + 2][pos[1] + 1][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0] + 2, pos[1] + 1, pos[2]]);
    if(chessBoard3D[pos[0] + 2][pos[1] - 1][pos[2]] == 0 || (chessBoard3D[pos[0] + 2][pos[1] - 1][pos[2]] > (6 * white) && chessBoard3D[pos[0] + 2][pos[1] - 1][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0] + 2, pos[1] - 1, pos[2]]);
    if(chessBoard3D[pos[0] + 2][pos[1]][pos[2] + 1] == 0 || (chessBoard3D[pos[0] + 2][pos[1]][pos[2] + 1] > (6 * white) && chessBoard3D[pos[0] + 2][pos[1]][pos[2] + 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0] + 2, pos[1], pos[2] + 1]);
    if(chessBoard3D[pos[0] + 2][pos[1]][pos[2] - 1] == 0 || (chessBoard3D[pos[0] + 2][pos[1]][pos[2] - 1] > (6 * white) && chessBoard3D[pos[0] + 2][pos[1]][pos[2] - 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0] + 2, pos[1], pos[2] - 1]);

    if(chessBoard3D[pos[0] - 2][pos[1] + 1][pos[2]] == 0 || (chessBoard3D[pos[0] - 2][pos[1] + 1][pos[2]] > (6 * white) && chessBoard3D[pos[0] - 2][pos[1] + 1][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0] - 2, pos[1] + 1, pos[2]]);
    if(chessBoard3D[pos[0] - 2][pos[1] - 1][pos[2]] == 0 || (chessBoard3D[pos[0] - 2][pos[1] - 1][pos[2]] > (6 * white) && chessBoard3D[pos[0] - 2][pos[1] - 1][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0] - 2, pos[1] - 1, pos[2]]);
    if(chessBoard3D[pos[0] - 2][pos[1]][pos[2] + 1] == 0 || (chessBoard3D[pos[0] - 2][pos[1]][pos[2] + 1] > (6 * white) && chessBoard3D[pos[0] - 2][pos[1]][pos[2] + 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0] - 2, pos[1], pos[2] + 1]);
    if(chessBoard3D[pos[0] - 2][pos[1]][pos[2] - 1] == 0 || (chessBoard3D[pos[0] - 2][pos[1]][pos[2] - 1] > (6 * white) && chessBoard3D[pos[0] - 2][pos[1]][pos[2] - 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0] - 2, pos[1], pos[2] - 1]);

    if(chessBoard3D[pos[0] + 1][pos[1] + 2][pos[2]] == 0 || (chessBoard3D[pos[0] + 1][pos[1] + 2][pos[2]] > (6 * white) && chessBoard3D[pos[0] + 1][pos[1] + 2][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0] + 1, pos[1] + 2, pos[2]]);
    if(chessBoard3D[pos[0] - 1][pos[1] + 2][pos[2]] == 0 || (chessBoard3D[pos[0] - 1][pos[1] + 2][pos[2]] > (6 * white) && chessBoard3D[pos[0] - 1][pos[1] + 2][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0] - 1, pos[1] + 2, pos[2]]);
    if(chessBoard3D[pos[0]][pos[1] + 2][pos[2] + 1] == 0 || (chessBoard3D[pos[0]][pos[1] + 2][pos[2] + 1] > (6 * white) && chessBoard3D[pos[0]][pos[1] + 2][pos[2] + 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0], pos[1] + 2, pos[2] + 1]);
    if(chessBoard3D[pos[0]][pos[1] + 2][pos[2] - 1] == 0 || (chessBoard3D[pos[0]][pos[1] + 2][pos[2] - 1] > (6 * white) && chessBoard3D[pos[0]][pos[1] + 2][pos[2] - 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0], pos[1] + 2, pos[2] - 1]);

    if(chessBoard3D[pos[0] + 1][pos[1] - 2][pos[2]] == 0 || (chessBoard3D[pos[0] + 1][pos[1] - 2][pos[2]] > (6 * white) && chessBoard3D[pos[0] + 1][pos[1] - 2][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0] + 1, pos[1] - 2, pos[2]]);
    if(chessBoard3D[pos[0] - 1][pos[1] - 2][pos[2]] == 0 || (chessBoard3D[pos[0] - 1][pos[1] - 2][pos[2]] > (6 * white) && chessBoard3D[pos[0] - 1][pos[1] - 2][pos[2]] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0] - 1, pos[1] - 2, pos[2]]);
    if(chessBoard3D[pos[0]][pos[1] - 2][pos[2] + 1] == 0 || (chessBoard3D[pos[0]][pos[1] - 2][pos[2] + 1] > (6 * white) && chessBoard3D[pos[0]][pos[1] - 2][pos[2] + 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0], pos[1] - 2, pos[2] + 1]);
    if(chessBoard3D[pos[0]][pos[1] - 2][pos[2] - 1] == 0 || (chessBoard3D[pos[0]][pos[1] - 2][pos[2] - 1] > (6 * white) && chessBoard3D[pos[0]][pos[1] - 2][pos[2] - 1] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0], pos[1] - 2, pos[2] - 1]);

    if(chessBoard3D[pos[0] + 1][pos[1]][pos[2] + 2] == 0 || (chessBoard3D[pos[0] + 1][pos[1]][pos[2] + 2] > (6 * white) && chessBoard3D[pos[0] + 1][pos[1]][pos[2] + 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0] + 1, pos[1], pos[2] + 2]);
    if(chessBoard3D[pos[0] - 1][pos[1]][pos[2] + 2] == 0 || (chessBoard3D[pos[0] - 1][pos[1]][pos[2] + 2] > (6 * white) && chessBoard3D[pos[0] - 1][pos[1]][pos[2] + 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0] - 1, pos[1], pos[2] + 2]);
    if(chessBoard3D[pos[0]][pos[1] + 1][pos[2] + 2] == 0 || (chessBoard3D[pos[0]][pos[1] + 1][pos[2] + 2] > (6 * white) && chessBoard3D[pos[0]][pos[1] + 1][pos[2] + 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0], pos[1] + 1, pos[2] + 2]);
    if(chessBoard3D[pos[0]][pos[1] - 1][pos[2] + 2] == 0 || (chessBoard3D[pos[0]][pos[1] - 1][pos[2] + 2] > (6 * white) && chessBoard3D[pos[0]][pos[1] - 1][pos[2] + 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0], pos[1] - 1, pos[2] + 2]);

    if(chessBoard3D[pos[0] + 1][pos[1]][pos[2] - 2] == 0 || (chessBoard3D[pos[0] + 1][pos[1]][pos[2] - 2] > (6 * white) && chessBoard3D[pos[0] + 1][pos[1]][pos[2] - 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0] + 1, pos[1], pos[2] - 2]);
    if(chessBoard3D[pos[0] - 1][pos[1]][pos[2] - 2] == 0 || (chessBoard3D[pos[0] - 1][pos[1]][pos[2] - 2] > (6 * white) && chessBoard3D[pos[0] - 1][pos[1]][pos[2] - 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0] - 1, pos[1], pos[2] - 2]);
    if(chessBoard3D[pos[0]][pos[1] + 1][pos[2] - 2] == 0 || (chessBoard3D[pos[0]][pos[1] + 1][pos[2] - 2] > (6 * white) && chessBoard3D[pos[0]][pos[1] + 1][pos[2] - 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0], pos[1] + 1, pos[2] - 2]);
    if(chessBoard3D[pos[0]][pos[1] - 1][pos[2] - 2] == 0 || (chessBoard3D[pos[0]][pos[1] - 1][pos[2] - 2] > (6 * white) && chessBoard3D[pos[0]][pos[1] - 1][pos[2] - 2] < (7 + 6 * white)))
        hitboxes.push(new hitbox(25), [pos[0], pos[1] - 1, pos[2] - 2]);
}

function moveBishop(white, pos) {
    hitboxes = [];
    
}
