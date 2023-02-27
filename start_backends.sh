PORT=7001
source venv/bin/activate
fuser -k $PORT/tcp

tmux kill-server

tmux new-session -d -s lsnk-backend "gunicorn --timeout 600 -w 4 -b 0.0.0.0:$PORT 'server:app'"   # linear sankoff backend
tmux attach-session -t lsnk-backend

cd socket_backend

tmux new-session -d -s lv-backend "python server_socket_lv.py"
tmux new-session -d -s lc-backend "python server_socket_lc.py"
tmux new-session -d -s lpv-backend "python server_socket_lp_v.py"
tmux new-session -d -s lpc-backend "python server_socket_lp_c.py"
tmux new-session -d -s lsv-backend "python server_socket_ls_v.py"
tmux new-session -d -s ltf-backend "python server_socket_ltf.py"
tmux new-session -d -s backend-cleaner "python dirs.py"

tmux attach-session -t lv-backend
tmux attach-session -t lc-backend
tmux attach-session -t lpv-backend
tmux attach-session -t lpc-backend
tmux attach-session -t lsv-backend
tmux attach-session -t ltf-backend
tmux attach-session -t backend-cleaner

