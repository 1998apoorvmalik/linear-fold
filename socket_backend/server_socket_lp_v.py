#!/usr/bin/python
# -*- coding: UTF-8 -*-
# server_socket.py
# flake8: noqa

import time
import os
import socket  # import socket module
import subprocess
import re

# directory for user's input and output
from dirs import usrDir, outDir, create_dirs

s = socket.socket()  # creat socket object
# Set the SO_REUSEADDR option to force binding
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
host = socket.gethostname()  # get local host name
port = 21111  # set port

# clear port
os.system("fuser -k %d/tcp" % port)

# bind port
s.bind((host, port))

# create dirs if not exist
create_dirs()

beamsize = 100
s.listen(5)  # wait for users's connect
while True:

    c, addr = s.accept()  # built connection
    t0 = time.time()
    inFileName = str(c.recv(1024), encoding="utf-8")

    inFile = usrDir + inFileName  # input path
    print("input file located at " + inFile)
    print(time.asctime() + ", client address", addr)
    # c.send('Hello world, it\'s Kaibo, from server: %s: %s\nYour address is: %s' %(host, port, addr))
    outLPv = outDir + inFileName + ".lpv.res"  # output path for linearPartition-V
    outLPvMEA = outDir + inFileName + ".lpv.mea.res"  # output path for linearPartition-V MEA
    """
    fileIn  = open(inFile)                              # read seq information from input
    usrData = fileIn.readlines()
    seqName = usrData[0][:-1]
    seq = usrData[1][:-1]
    beamsize = int(usrData[2])
    fileIn.close()
    """

    cmd = 'sed -n "2p" {} | ./programs/LinearPartition/linearpartition -V -r {} --mea --mea_prefix {} --verbose -c 0.01'.format(
        inFile, outLPv, outLPvMEA
    )

    process = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, stdin=subprocess.PIPE)
    stdout, stderr = process.communicate()  # Communicates with the process (send/receive data)
    vb = stdout.decode("utf-8") + stderr.decode("utf-8")

    score_pattern = r"Free Energy of Ensemble:\s*(-?\d+\.\d+)\s*kcal/mol"
    t2_pattern = r"Partition Function Calculation Time:\s*(\d+\.\d+)\s*seconds"
    t3_pattern = r"Base Pairing Probabilities Calculation Time:\s*(\d+\.\d+)\s*seconds"

    try:
        score = re.findall(score_pattern, vb)[0]
        t2 = re.findall(t2_pattern, vb)[0]
        t3 = re.findall(t3_pattern, vb)[0]

        os.system("chmod a+r {}".format(outLPv))
        os.rename(f"{outLPvMEA}_1", outLPvMEA)  # rename the output
        os.system("chmod a+r {}".format(outLPvMEA))

        c.send(bytes(str(score + "|" + t2 + "|" + t3), encoding="utf-8"))
    except Exception:
        c.send(bytes("wrong|0|0", encoding="utf-8"))
        print("subprocess failed: " + cmd)

    c.close()  # close connection

    print("total time: {:.2f}".format(time.time() - t0))
