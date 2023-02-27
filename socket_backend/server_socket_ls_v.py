#!/usr/bin/python
# -*- coding: UTF-8 -*-
# server_socket.py

import time
import os
import socket  # import socket module

# directory for user's input and output
from dirs import usrDir, outDir, create_dirs

s = socket.socket()  # creat socket object
host = socket.gethostname()  # get local host name
port = 31111  # set port
s.bind((host, port))  # bind port

# create dirs if not exist
create_dirs()

beamsize = 100

s.listen(5)  # wait for users's connect
while True:
    c, addr = s.accept()  # built connection
    inFileName = str(c.recv(1024), encoding="utf-8")

    inFile = usrDir + inFileName  # input path
    print("input file located at " + inFile)
    print(time.asctime() + ", client address", addr)
    # c.send('Hello world, it\'s Kaibo, from server: %s: %s\nYour address is: %s' %(host, port, addr))
    outLs = outDir + inFileName + ".lsv.res"  # output path for linearFold-V

    fileIn = open(inFile)  # read seq information from input
    usrData = fileIn.readlines()
    try:
        seqName = usrData[0][:-1]
        seq = usrData[1][:-1]
        beamsize = int(usrData[2])
        samplesize = int(usrData[3])
        fileIn.close()
    except Exception:
        print("exception in reading " + inFile)
        time2 = "error reading " + inFile
        fileIn.close()
        c.send(bytes(str(time2), encoding="utf-8"))
        c.close()  # close connection

    time_s = time.time()
    cmd = "echo {} | /scratch/liukaib/call_linearsampling -b {} -k {} --verbose > {}".format(
        seq, beamsize, samplesize, outLs
    )

    try:
        os.system(cmd)
        os.system("chmod a+r {}".format(outLs))
        print(outLs)
        time2 = time.time() - time_s
        c.send(bytes(str(time2), encoding="utf-8"))
    except Exception:
        time2 = "wrong"
        c.send(bytes(str(time2), encoding="utf-8"))
        print("sth wrong for {}".format(cmd))

    c.close()  # close connection
