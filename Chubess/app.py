from flask import Flask, render_template, redirect, url_for, request
from flask_socketio import SocketIO, join_room, emit

app = Flask(__name__)
socketio = SocketIO(app)

waiting_players = []  # Queue for waiting players
rooms = {}  # Dictionary to track active rooms

@app.route('/')
def home():
    return render_template('index.html')  # Redirect to waiting room

@app.route('/waiting')
def waiting_room():
    return render_template('waiting.html')  # Show waiting room

@app.route('/game/<room_id>')
def game_room(room_id):
    """ Serve the game room page even if it's not in rooms dictionary yet """
    return render_template('game.html', room_id=room_id)  # Show game room

@socketio.on('join_waiting_room')
def handle_join_waiting():
    global waiting_players, rooms
    player_id = request.sid  # Use WebSocket session ID

    if player_id in waiting_players:
        return  # Prevent duplicate entries

    waiting_players.append(player_id)

    if len(waiting_players) >= 2:
        # Pair two players into a new room
        player1 = waiting_players[0]
        player2 = waiting_players[1]
        room_name = f'room_{len(rooms) + 1}'

        rooms[room_name] = [player1, player2]
        print(len(rooms))

        # Both players join the room
        join_room(room_name, sid=player1)
        join_room(room_name, sid=player2)

        # Redirect both players to the game room
        emit('redirect_to_game', {'url': url_for('game_room', room_id=room_name)}, to=player1)
        emit('redirect_to_game', {'url': url_for('game_room', room_id=room_name)}, to=player2)

@socketio.on('disconnect')
def handle_disconnect():
    global waiting_players, rooms
    player_id = request.sid

    print("Out")

    # Safe removal from waiting list
    if player_id in waiting_players:
        waiting_players.remove(player_id)
    else:
        for room, players in list(rooms.items()):
            if player_id in players:
                players.remove(player_id)
                print(f"Player {player_id} disconnected from room {room}.")
                if not players:  # Remove empty room
                    del rooms[room]
                    print(f"Room {room} deleted because all players disconnected.")
                break

if __name__ == '__main__':
    socketio.run(app, debug=True)