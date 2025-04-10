from flask import Flask, render_template, redirect, url_for, request, flash
from flask_socketio import SocketIO, join_room, emit
from models import db, bcrypt, User, login_manager
from forms import SignupForm, LoginForm
from flask_login import login_user, logout_user, login_required, current_user

app = Flask(__name__)
app.config.from_object('config.Config')
socketio = SocketIO(app, host="0.0.0.0", port=5000, debug=True)

db.init_app(app)
bcrypt.init_app(app)
login_manager.init_app(app)

with app.app_context():
    db.create_all()

players = []

@app.route('/')
def start():
    return redirect(url_for('login'))

@app.route('/main')
@login_required
def home():
    return render_template('index.html')


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = SignupForm()
    if form.validate_on_submit():
        hashed_pw = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, email=form.email.data, password=hashed_pw)
        db.session.add(user)
        db.session.commit()
        flash('Account created! You can now log in.', 'success')
        return redirect(url_for('login'))
    return render_template('signup.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user)
            return redirect(url_for('home'))
        else:
            flash('Login unsuccessful. Check email and password.', 'danger')
    return render_template('login.html', form=form)


@app.route('/game')
@login_required
def waiting_room():
    return render_template('game.html')

@app.route('/moves')
@login_required
def moves_room():
    return render_template('moves.html') 

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

@socketio.on('promote')
def piece_promote(data):
   player_id = request.sid

   promoteId = data
   index = players.index(player_id)
   emit('receive_promotion', promoteId, room=players[index - 2 * (index % 2) + 1])


@socketio.on('lost')
def game_end():
    player_id = request.sid
    print("Game Ended!")

    if player_id in players:
        index = players.index(player_id)

        emit('won', room=players[index - 2 * (index % 2) + 1])
        if index < index - 2 * (index % 2) + 1:
            players.pop(index)
            players.pop(index)
        else:
            players.pop(index - 2 * (index % 2) + 1)
            players.pop(index - 2 * (index % 2) + 1)

        update_player_list();

@socketio.on('draw')
def game_end():
    player_id = request.sid
    print("Game Ended!")

    if player_id in players:
        index = players.index(player_id)

        emit('draw', room=players[index - 2 * (index % 2) + 1])
        if index < index - 2 * (index % 2) + 1:
            players.pop(index)
            players.pop(index)
        else:
            players.pop(index - 2 * (index % 2) + 1)
            players.pop(index - 2 * (index % 2) + 1)

        update_player_list();    

@socketio.on('disconnect')
def handle_disconnect():
    player_id = request.sid

    if player_id in players:
        index = players.index(player_id)
        if len(players) > index - 2 * (index % 2) + 1:
            print("Players: ", player_id, " and ", players[index - 2 * (index % 2) + 1], " removed")
            emit('won' ,room=players[index - 2 * (index % 2) + 1])
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

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('login'))

def update_player_list():
    emit('update_players', {"players" : players}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)