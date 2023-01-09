#!/nfs/stak/users/liukaib/.virtualenvs/flask/bin/python
# coding-utf8
import flask
import flask_cors
from werkzeug.utils import secure_filename
import os
import time
import re
import json
import arc_pairing_single_json
import socket

logFile = "./usrLog.txt"
ironcreekOutDir = "/nfs/stak/users/liukaib/public_html/demo_ironcreekOut/"
pairingDir = "./static/pairingRes/"


def addlog(logInfo):
    os.system("echo {} >> {}".format(logInfo, logFile))
    ### os.system("echo {} >> {}".format(logInfo, logFile))
    ### try:
    ###     os.system("cp {} {}".format(logFile, logFile2))
    ### except:
    ###     print('cannot cp log from home to here')

def request_ironcreek_v(seqfile):
    s2 = socket.socket()         # creat socket object
    host = 'ironcreek.eecs.oregonstate.edu'
    port2 = 11111                # set port

    s2.connect((host, port2))
    #seqfile_s = bytes(seqfile,'UTF-8')
    s2.send(seqfile)
    t2 = s2.recv(1024)

    s2.close()

    return t2


def LF_v_core(filename, seq, seqName, beamsize, T0, usrIP, conSeq=None, dld_cmt=': '):
    outLv = ironcreekOutDir + filename + '.lv.res'             # output path for linearFold-V
    t2 = request_ironcreek_v(filename)    # call lv functions in ironcreek, save results in files, return time

    f_lv = open(outLv,'r')
    lv = f_lv.readlines()
    f_lv.close()
    print(outLv)

    line_idx_t, line_idx_s, line_idx_res = 1, 2, 3  # Vincent version
    t2 = ''.join(re.findall('Time: ([0-9]+[.0-9]{0,3})',lv[line_idx_t]))
    score2 = ''.join(re.findall('Score: ([\-0-9]+[.0-9]{0,3})',lv[line_idx_s]))# Vincent version
    print('[time {}s] [score {}] [b {}] [LF file {}]'.format(t2,score2,beamsize,filename))
    #write results of lc, lv to a final pairing.res result
    pairingFile = pairingDir + filename + '.pairing.res'   #output with pairingName
    arc_pairing_single_json.LoadSave_lv(pairingFile,seq,lv[line_idx_res][:-1],t2,beamsize,seqName,score2,conSeq)   # Vincent version

    T1 = time.time() - T0

    os.system('chmod 644 '+pairingFile)
    logInfo = "[{0}] [len: {1:0>6}] [time: {2:0>12.5f}s] [LF file: {3}] [IP: {4}]".format(time.asctime(), len(seq) , T1, filename, usrIP)
    addlog(logInfo)
    #global pairingName#, total_time         # Kaibo remove 3/11/2019
    #pairingName = filename+'.pairing.res'   # Kaibo remove 3/11/2019

    newurl = flask.url_for('showRes_LV',name=filename, dld_cmt=dld_cmt)
    return newurl

filename = '1670867831._name'
seq = "GCUCUGUUGGUGUAGUCCGGCCAAUCAUAUCACCCUCU"
seqName = "name"
beamsize = 100
T0 = 0.0
usrIP = ""
LF_v_core(filename, seq, seqName, beamsize, T0, usrIP)
