tmux kill-session -t lsnk-backend
tmux kill-session -t lv-backend
tmux kill-session -t lc-backend
tmux kill-session -t lpv-backend
tmux kill-session -t lpc-backend
tmux kill-session -t lsv-backend
tmux kill-session -t ltf-backend
tmux kill-session -t backend-cleaner

LSNK_PORT=7001
fuser -k $LSNK_PORT/tcp
pkill gunicorn