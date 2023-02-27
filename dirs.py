import os
import shutil
import time

CLEAN_FREQUENCY = 3600  # seconds


# backend output directories
user_data_directory = "/nfs/stak/users/malikap/linear-fold/backend/socket_backend/tmp/user_data/"
server_output_directory = "/nfs/stak/users/malikap/linear-fold/backend/socket_backend/tmp/server_output/"

# get current path
current_path = os.path.dirname(os.path.realpath(__file__))

# frontend data directories
LTF_data_directory = os.path.join(current_path, "static/LTFDir/")
pairing_result_directory = os.path.join(current_path, "static/pairingRes/")

# log file path
user_log_file = os.path.join(current_path, "user_log.txt")


def create_dirs():
    try:
        if not os.path.exists(LTF_data_directory):
            os.makedirs(LTF_data_directory)
        if not os.path.exists(pairing_result_directory):
            os.makedirs(pairing_result_directory)
        if not os.path.exists(user_log_file):
            open(user_log_file, "w").close()
    except Exception:
        print("Tmp Directory creation failed or directory already exists")


def cleaner():
    while True:
        create_dirs()
        time.sleep(CLEAN_FREQUENCY)
        shutil.rmtree(LTF_data_directory)
        shutil.rmtree(pairing_result_directory)
        print("[INFO] tmp directory cleaned successfully")


if __name__ == "__main__":
    cleaner()
