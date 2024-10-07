# kill server first
tmux kill-server

# Socket backends
VENV="source /opt/venv/bin/activate"
DIR="./socket_backend/"
tmux set-option -g remain-on-exit on
tmux new-session -d -s lv-backend  "$VENV && python3 ${DIR}server_socket_lv.py; bash"
tmux new-session -d -s lc-backend  "$VENV && python3 ${DIR}server_socket_lc.py; bash"
tmux new-session -d -s lpv-backend "$VENV && python3 ${DIR}server_socket_lp_v.py; bash"
tmux new-session -d -s lpc-backend "$VENV && python3 ${DIR}server_socket_lp_c.py; bash"
tmux new-session -d -s lsv-backend "$VENV && python3 ${DIR}server_socket_ls_v.py; bash"
tmux new-session -d -s ltf-backend "$VENV && python3 ${DIR}server_socket_ltf.py; bash"
tmux new-session -d -s backend-cleaner "$VENV && python3 ${DIR}dirs.py; bash"

# LinearAlifold and LinearSankoff backend 
LSNK_PORT=7943
fuser -k $LSNK_PORT/tcp
tmux new-session -d -s lsnk-backend "$VENV && gunicorn --timeout 600 -w 4 -b 0.0.0.0:$LSNK_PORT 'server:app'"   # linear sankoff backend

# show the server processes
tmux ls