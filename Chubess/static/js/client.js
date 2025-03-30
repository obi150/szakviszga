const socket = io();
let isWhite = true;
let gameStarted = false, gameEnded = false;
let win = false;
let moveCount = 0;
let kingIndex;

socket.emit("join_game");

socket.on("connect", () => {
    console.log("Connected to server");
});

socket.on("waiting_room", () => {
    let waiting = document.querySelector('.waiting');
    let pause = document.querySelector('.pause');

    if (waiting) waiting.style.display = 'block';
    if (pause) pause.style.display = 'none';
});

socket.on("game_room", () => {
    let waiting = document.querySelector('.waiting');
    let pause = document.querySelector('.pause');

    if (waiting) waiting.style.display = 'none';
    if (pause) pause.style.display = 'block';
    gameStarted = true;
});


socket.on("player_role", (data) => {
    if (data.color == "white")
        isWhite = true;
    else
        isWhite = false;
    kingIndex = findKingIndex();
    console.log(kingIndex);
});

socket.on("update_players", (data) => {
    console.log("Updated players:", data.players);
});

socket.on("receive_move", (data) => {
    move(data.piece, data.hitbox);
    console.log("Got the moves!");
    moveCount++;
    gameEnded = isCheckmate(pieces[kingIndex].getPosition());
});

function makeMove(pieceId, hitboxId) {
    socket.emit("move", { piece: pieceId, hitbox: hitboxId });
    moveCount++;
}


