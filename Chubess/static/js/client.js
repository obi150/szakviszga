const socket = io();
let isWhite = true;
let gameStarted = false, gameEnded = false;
let win = false;
let moveCount = 0;
let kingIndex, oppositeKingIndex;
let check = false, stealmate = false;

socket.emit("join_game");

socket.on("connect", () => {
    console.log("Connected to server");
});

socket.on("waiting_room", () => {
    let waiting = document.querySelector('.waiting');

    if (waiting) waiting.style.display = 'block';
});

socket.on("game_room", () => {
    let waiting = document.querySelector('.waiting');
    let pause = document.querySelector('.pause');
    let home = document.querySelector('.home-content');
    let yourT = document.querySelector('#yourTurn');

    if (waiting) waiting.style.display = 'none';
    if (pause) pause.style.display = 'block';
    if (home) home.style.display = 'none';
    if (yourT) yourT.style.display = 'block';
    gameStarted = true;
});


socket.on("player_role", (data) => {
    if (data.color == "white")
        isWhite = true;
    else
        isWhite = false;
    kingIndex = findKingIndex();
    oppositeKingIndex = findOppositeKingIndex();
});

socket.on("update_players", (data) => {
    console.log("Updated players:", data.players);
});

socket.on("receive_move", (data) => {
    move(data.piece, data.hitbox);
    moveCount++;
    check = isCheck(pieces[kingIndex].getPosition());
    stealmate = isStealmate();
    gameEnded = isCheckmate(pieces[kingIndex].getPosition());
    if (gameEnded) {
        document.getElementById("lostDiv").style.display = "block";
        document.querySelector('.pause').style.display = 'none';
        document.querySelector('.home-content').style.display = 'block';
        socket.emit("lost");
    }
    else if (stealmate) {
        document.getElementById("drawDiv").style.display = "block";
        document.querySelector('.pause').style.display = 'none';
        document.querySelector('.home-content').style.display = 'block';
        socket.emit("draw");
    }
});

socket.on("receive_promotion", (data) => {
    promotionId = data;
});

socket.on("won", () => {
    gameEnded = true;
    document.getElementById("wonDiv").style.display = "block";
    document.querySelector('.pause').style.display = 'none';
    document.querySelector('.home-content').style.display = 'block';
});

socket.on("draw", () => {
    stealmate = true;
    document.getElementById("drawDiv").style.display = "block";
    document.querySelector('.pause').style.display = 'none';
    document.querySelector('.home-content').style.display = 'block';
})

function makeMove(pieceId, hitboxId) {
    socket.emit("move", { piece: pieceId, hitbox: hitboxId });
    moveCount++;
}

function makePromotion() {
    socket.emit("promote", promotionId);
}
