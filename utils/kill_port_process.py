import os
import subprocess

def kill_processes_using_port(port):
    try:
        # Find processes using the specified port
        find_process_cmd = f"lsof -i:{port}"
        process = subprocess.Popen(find_process_cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        output, error = process.communicate()

        if output:
            # Decode and split the output into lines
            lines = output.decode().strip().split('\n')

            # Extract the first column (PID) from each line after skipping the header
            pids = []
            for line in lines[1:]:  # Skip the first line (header)
                pids.append(line.split("\t")[0])
                
            # Kill each process by its PID
            for pid in pids:
                os.kill(int(pid), 9)  # Send SIGKILL
                print(f"Killed process with PID: {pid}")
        else:
            print(f"No processes found using port {port}")

    except Exception as e:
        print(f"Error: {e}")
        