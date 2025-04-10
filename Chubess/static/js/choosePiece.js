function choosePiece(id) {
    chessmap = new Array;
    for (let i = 0; i < 8; i++) {
        let face = [];
        for (let j = 0; j < 8; j++) {
            let row = [];
            for (let k = 0; k < 8; k++) {
                row.push(0);
            }
            face.push(row);
        }
        chessmap.push(face);
    }
    chessmap[3][3][3] = id;
    setUpChessBoard();
    pieces = new Array;
    setUpPieces();
}