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
host = socket.gethostname()  # get local host name
port = 21111  # set port
s.bind((host, port))  # bind port

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

    cmd = 'sed -n "2p" {} | /scratch/liukaib/call_linearpartition -V -r {} --MEA --MEA_output {} --verbose -c 0.01'.format(
        inFile, outLPv, outLPvMEA
    )
    vb = subprocess.check_output(cmd, shell=True).decode("utf-8")

    try:
        score = re.findall("Ensemble: ([\-0-9]+[.0-9]{0,3})", vb)[0]
        t2 = re.findall("Function Calculation Time: ([0-9]+[.0-9]{0,3})", vb)[0]
        t3 = re.findall("Probabilities Calculation Time: ([0-9]+[.0-9]{0,3})", vb)[0]
        os.system("chmod a+r {}".format(outLPv))
        os.system("chmod a+r {}".format(outLPvMEA))

        c.send(bytes(str(score + "|" + t2 + "|" + t3), encoding="utf-8"))
    except Exception:
        c.send(bytes("wrong|0|0", encoding="utf-8"))
        print("subprocess failed: " + cmd)

    c.close()  # close connection

    print("total time: {:.2f}".format(time.time() - t0))
