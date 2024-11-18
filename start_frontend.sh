IP=127.0.0.1
PORT=8090

fuser -k $PORT/tcp

source ./venv/bin/activate

tmux new-session -d -s linearx-frontend "gunicorn --timeout 600 -w 4 -b $IP:$PORT 'server_flask_socketClient:app'"
tmux new-session -d -s cleaner "python3 dirs.py"