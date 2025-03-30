from flask import Flask, render_template, redirect, url_for, request
from flask_socketio import SocketIO, join_room, emit

app = Flask(__name__)
socketio = SocketIO(app, host="0.0.0.0", port=5000, debug=True)

players = []

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/game')
def waiting_room():
    return render_template('game.html') 

@socketio.on('join_game')
def handle_join():
    player_id = request.sid
    if len(players) % 2 == 0:
        players.append(player_id)
        emit('player_role', {"color" : "white"}, room=player_id)
        emit('waiting_room', room=player_id)
        print("Player: ", player_id, " joined as white.")
    else:
        players.append(player_id)
        emit('player_role', {"color" : "black"}, room=player_id)
        emit('game_room', room=player_id)
        emit('game_room', room=players[-2])
        print("Player: ", player_id, " joined as black.")

    update_player_list()

@socketio.on('move')
def piece_move(data):
    player_id = request.sid
    print("Recieved move from player: ", player_id)

    piece = data.get("piece")
    hitbox = data.get("hitbox")
    index = players.index(player_id)

    emit('receive_move', {"piece": piece, "hitbox": hitbox}, room=players[index - 2 * (index % 2) + 1])

@socketio.on('disconnect')
def handle_disconnect():
    player_id = request.sid

    if player_id in players:
        index = players.index(player_id)
        if len(players) > index - 2 * (index % 2) + 1:
            print("Players: ", player_id, " and ", players[index - 2 * (index % 2) + 1], " removed")
            emit('result',{"result" : "win"} ,room=players[index - 2 * (index % 2) + 1])
            if index < index - 2 * (index % 2) + 1:
                players.pop(index)
                players.pop(index)
            else:
                players.pop(index - 2 * (index % 2) + 1)
                players.pop(index - 2 * (index % 2) + 1)
        else:
            print("Waiting player removed: ", player_id)
            players.pop(index)

    update_player_list()

def update_player_list():
    emit('update_players', {"players" : players}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)