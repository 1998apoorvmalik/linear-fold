import os
import shutil
import time

CLEAN_FREQUENCY = 3600  # seconds

# get current path
curPath = os.path.dirname(os.path.realpath(__file__))

usrDir = os.path.join(curPath, "tmp/user_data/")
tmpDir = os.path.join(curPath, "tmp/")
outDir = os.path.join(curPath, "tmp/server_output/")
usrLTFDir = os.path.join(usrDir, "LTF/")


def create_dirs():
    try:
        if not os.path.exists(usrDir):
            os.makedirs(usrDir)
        if not os.path.exists(tmpDir):
            os.makedirs(tmpDir)
        if not os.path.exists(outDir):
            os.makedirs(outDir)
        if not os.path.exists(usrLTFDir):
            os.makedirs(usrLTFDir)
    except Exception:
        print("Tmp Directory creation failed or directory already exists")


def cleaner():
    while True:
        create_dirs()
        time.sleep(CLEAN_FREQUENCY)
        shutil.rmtree(tmpDir)
        print("[INFO] tmp directory cleaned successfully")
        
if __name__ == "__main__":
    cleaner()
