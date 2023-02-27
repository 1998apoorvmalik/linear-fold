#!/usr/bin/python
# -*- coding: UTF-8 -*-
# server_socket.py

import time
import os
import socket  # import socket module

# directory for user's input and output
from dirs import outDir, create_dirs

s = socket.socket()  # creat socket object
host = socket.gethostname()  # get local host name
port = 11118  # set port
s.bind((host, port))  # bind port

# create dirs if not exist
create_dirs()

s.listen(5)  # wait for users's connect
while True:
    c, addr = s.accept()  # built connection
    inFileName = str(c.recv(1024), encoding="utf-8")

    # inFile = usrDir+inFileName                          # input path
    inFile_fasta = inFileName + ".fasta"  # input path
    inFile_para = inFileName + ".para"  # input path
    if not os.path.exists(inFile_fasta) or not os.path.exists(inFile_para):
        c.send(bytes("no data file found", encoding="utf-8"))
        c.close()
        continue
    try:
        print("input file located at " + inFile_fasta)
        print(time.asctime() + ", client address", addr)
        outDirLTF = outDir + os.path.basename(inFileName)  # output dir for LTF
        print(inFileName, "->", outDirLTF)
        outLTF = os.path.join(outDirLTF, "ltf.out")

        with open(inFile_para) as fileIn:
            usrData = fileIn.readlines()
            b1 = int(usrData[0].strip())
            b2 = int(usrData[1].strip())
            its = int(usrData[2].strip())
            th = float(usrData[3].strip())

        time_s = time.time()

        cmd = "./LinearTurboFold/linearturbofold -i {} -o {} --b1 {} --b2 {} --it {} --th {}".format(
            inFile_fasta, outDirLTF, b1, b2, its, th
        )
        os.system(cmd)
        cmd = "python3 ./LinearTurboFold/combine_results.py {}".format(outDirLTF)
        os.system(cmd)
        os.system("chmod 775 {}".format(outDirLTF))
        # os.system("chmod a+r {}".format(outLTF))
        os.system("chmod 775 {}/*".format(outDirLTF))
        print(outDirLTF)
        time2 = time.time() - time_s

        # c.send(str(time2))
        # c.send(outLTF)
        c.send(bytes(outDirLTF, encoding="utf-8"))
    except Exception:
        c.send(bytes("no result from backend LTF", encoding="utf-8"))
    c.close()  # close connection
