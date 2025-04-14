fetch('static/chessmap/checker.chessmap')
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

        setUpChessBoard();
        setUpPieces();
        kingIndex = findKingIndex();
        oppositeKingIndex = findOppositeKingIndex();
    });