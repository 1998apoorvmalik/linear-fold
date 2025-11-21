# Kill any existing server first
fuser -k 7001/tcp
pkill gunicorn

# Activate virtual environment
source /opt/venv/bin/activate

# Run the socket backends in the background
python3 ./socket_backend/server_socket_lv.py &
python3 ./socket_backend/server_socket_lc.py &
python3 ./socket_backend/server_socket_lp_v.py &
python3 ./socket_backend/server_socket_lp_c.py &
python3 ./socket_backend/server_socket_ls_v.py &
python3 ./socket_backend/server_socket_ltf.py &
python3 ./socket_backend/dirs.py &

# Run the gunicorn process for LinearSankoff backend
gunicorn --timeout 600 -w 4 -b 0.0.0.0:7001 'server:app' &

# Show the running processes
ps aux | grep python3
