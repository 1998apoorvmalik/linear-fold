#!/usr/bin/python
# -*- coding: UTF-8 -*-
# server_socket.py
# flake8: noqa

import time
import os
import socket  # import socket module

# directory for user's input and output
from dirs import usrDir, outDir, create_dirs

# print python version
print("python version: ", end="")
os.system("python3 --version")

s = socket.socket()  # creat socket object
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
host = socket.gethostname()  # get local host name
port = 11111  # set port

# clear port
os.system("fuser -k %d/tcp" % port)

# bind port
s.bind((host, port))

# create dirs if not exist
create_dirs()

beamsize = 100

# LD = "export CXX=/usr/local/common/gcc-4.9.0/bin/g++; export CC=/usr/local/common/gcc-4.9.0/bin/gcc; export LD_LIBRARY_PATH=/usr/local/common/gcc-4.9.0/lib64"
s.listen(5)  # wait for users's connect
while True:
    c, addr = s.accept()  # built connection
    inFileName = str(c.recv(1024), encoding="utf-8")

    inFile = usrDir + inFileName  # input path
    print("input file located at " + inFile)
    print(time.asctime() + ", client address", addr)
    # c.send('Hello world, it\'s Kaibo, from server: %s: %s\nYour address is: %s' %(host, port, addr))
    outLv = outDir + inFileName + ".lv.res"  # output path for linearFold-V

    fileIn = open(inFile)  # read seq information from input
    usrData = fileIn.readlines()
    seqName = usrData[0][:-1]
    seq = usrData[1][:-1]
    beamsize = int(usrData[2])
    conSeq = None
    is_zuker = ""
    if len(usrData) >= 4:
        conSeq = usrData[3].strip()
        if conSeq[:5] == "delta":
            is_zuker = "--zuker --" + conSeq
            conSeq = None
            print(is_zuker)
        else:
            print("constraint,", conSeq)
    fileIn.close()

    time_s = time.time()
    # no need in Vincent's version
    # tmpSeqFile = "{}[{}-{}]{}_2.seq".format(tmpDir, addr[0], addr[1], inFile.split('/')[-1])
    # os.system("echo %s > %s" % (seq, tmpSeqFile))    # save seq to the file for running in linearFold programs

    # do the linearfold-v
    # os.system("{}; /scratch/dengde/fastdecode/fastcky_vienna/fastcky/build/beamckypar -f {} -b {} > {}".format(LD, tmpSeqFile, beamsize, outLv) ) ## linearfold-v
    # os.system("cat {} | /scratch/liukaib/call_linearfold_v -b {} > {}".format(tmpSeqFile, beamsize, outLv) ) ## linearfold-v, Vincent version
    if conSeq is None:
        os.system("echo {} | ./programs/LinearFold/linearfold -v -V -b {} {} > {}".format(seq, beamsize, is_zuker, outLv))
    else:
        os.system(
            'echo -e "{}\n{}" | ./programs/LinearFold/linearfold -v -V -b {} --constraints > {}'.format(
                seq, conSeq, beamsize, outLv
            )
        )
    os.system("chmod a+r {}".format(outLv))
    print(outLv)
    time2 = time.time() - time_s

    c.send(bytes(str(time2), encoding="utf-8"))
    c.close()  # close connection
