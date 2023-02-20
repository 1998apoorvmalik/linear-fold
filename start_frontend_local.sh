IP=0.0.0.0
PORT=8090

source venv/bin/activate

fuser -k $PORT/tcp
gunicorn --timeout 600 -w 4 -b $IP:$PORT "server_flask_socketClient:app"