#!/bin/bash
PORT=8081

# Kill processes using this port
echo "Killing Any Processes Using Port $PORT"
fuser -k ${PORT}/tcp
if [ $? -eq 0 ]; then
    echo "Processes using port $PORT have been killed"
else
    echo "No processes were using port $PORT"
fi

# Find and display the Gunicorn processes
echo "Found the following existing Gunicorn processes:"
ps aux | grep gunicorn | grep -v grep

# Kill the Gunicorn processes
PIDS=$(ps aux | grep gunicorn | grep -v grep | awk '{print $2}')

if [ -z "$PIDS" ]; then
    echo "No Gunicorn processes found"
else
    echo "Killing the following PIDs: $PIDS"
    echo "$PIDS" | xargs kill -9
    echo "Gunicorn processes killed"
fi
