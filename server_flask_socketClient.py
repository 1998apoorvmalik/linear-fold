#!/nfs/stak/users/liukaib/.virtualenvs/flask/bin/python
# coding-utf8

"""
Developer: Kaibo(lrushx)
Email: liukaib@oregonstate.edu
Created Date: Jan 27, 2018
"""

# flake8: noqa

LOCAL_TESTING = False

import os
import re
import socket  # import socket module
import time

import arc_pairing_single_json
import flask
import flask_cors
import requests
from flask import redirect, request, send_file, url_for
from werkzeug.utils import secure_filename

app = flask.Flask(__name__, static_url_path="", static_folder="static", template_folder="templates")

app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

flask_cors.CORS(app)

fileDir = "/nfs/stak/users/liukaib/public_html/usrData/"
# fileDir = os.path.join(os.getcwd(),"usrData")
# logFile = "/nfs/stak/users/liukaib/public_html/demo_data_run/usrLog.txt"
logFile = "./usrLog.txt"
ironcreekOutDir = "/nfs/stak/users/liukaib/public_html/demo_ironcreekOut/"
ironcreekOutDir_LTF = "/nfs/stak/users/liukaib/public_html/demo_ironcreekOut_LTF/"
# pairingDir = "../demo_data_run/"
pairingDir = "./static/pairingRes/"
pairingName, total_time = "", 0
LTFDir = "./static/LTFDir/"

demoURL = "/"
demoURL_v = "/v"
partitionURL = "/partition"
partitionURL_v = "/partition_v"
samplingURL_v = "/sampling"
sankoffURL = "/linearsankoff"

ltfURL = "/linearturbofold"
turboFoldCOVIDURL = "/linearturbofold_SarsCov2"


# bothCVURL = '/'    # used to keep previous version, 2 circle polts + preset demo
@app.route(demoURL_v)
def my_form_LV():
    # return flask.render_template('myform.html')
    return flask.render_template("interface_linearfold_v.html")


@app.route(partitionURL_v)
def my_form_LP_v():
    return flask.render_template("interface_linearpartition_v.html")


@app.route(partitionURL)
def my_form_LP():
    return flask.render_template("interface_linearpartition2.html")


@app.route(samplingURL_v)
def my_form_LS_v():
    return flask.render_template("interface_linearsampling_v.html")


@app.route(demoURL)
def my_form_old():
    return flask.render_template("interface_linearfold2_old.html")


# Linear Sankoff
@app.route(sankoffURL, methods=("GET", "POST"))
def my_form_LS():
    if request.method == "POST":

        if LOCAL_TESTING:
            url = "http://0.0.0.0:7001/linear-sankoff"  # local server
        else:
            url = "http://10.217.112.122:7001/linear-sankoff"  # remote server

        arguments = {
            "seq": request.form["seqInput"],
            "w": float(request.form["w"]),
            "b": int(request.form["b"]),
            "LFb": int(request.form["LFb"]),
            "LAb": int(request.form["LAb"]),
            "LAw": int(request.form["LAw"]),
            "astar": False,
            "branch": "branch" in request.form,
            "energyDiff": float(request.form["energyDiff"]),
            "verbose": False,
        }

        data = requests.post(url, json=arguments).json()
        return flask.render_template("showResult_linearsankoff.html", data=data)

    return flask.render_template("linear_sankoff.html")


@app.route(os.path.join(demoURL_v, "res_<name>=<dld_cmt>"))
def showRes_LV(name, dld_cmt):
    # global pairingRes
    # return flask.render_template('showResult.html', pairingRes=pairingName, total_time=total_time)
    return flask.render_template("showResult_linearfold_v.html", pairingRes=name + ".pairing.res", dld_cmt=dld_cmt)


@app.route(partitionURL_v + "/res_<name>")
def showRes_LP_v(name):
    return flask.render_template("showResult_linearpartition_v.html", pairingRes=name + ".partition.res")


@app.route(partitionURL + "/res_<name>")
def showRes_LP(name):
    return flask.render_template("showResult_linearpartition2.html", pairingRes=name + ".partition.res")


@app.route(os.path.join(samplingURL_v, "res_<name>=<samplesize>"))
def showRes_LS_v(name, samplesize):
    return flask.render_template(
        "showResult_linearsampling_v.html", pairingRes=name + ".sampling.res", samplesize=samplesize
    )


@app.route(os.path.join(demoURL, "res_<name>=<dld_cmt>"))
def showRes_old(name, dld_cmt):
    return flask.render_template("showResult_linearfold2_old.html", pairingRes=name + ".pairing.res", dld_cmt=dld_cmt)


@app.route(demoURL_v, methods=["GET", "POST"])
def inputSeq_LV():
    if flask.request.method == "POST":
        input_flag = False
        beamsize = flask.request.form["beamSize"]
        if not beamsize:
            beamsize = "100"
        if int(beamsize) > 200:
            beamsize = "200"
        text = flask.request.form["seqInput"]
        filename = str(time.time()) + "_"
        usrIP = flask.request.remote_addr

        if "seqFile" in flask.request.files and flask.request.files["seqFile"].filename != "":
            usrFile = flask.request.files["seqFile"]
            # filename += secure_filename(usrFile.filename)
            # filename = filename[:-4]
            tmpPath = os.path.join(fileDir, "tmp")
            usrFile.save(tmpPath)
            input_flag = True

            with open(tmpPath) as f:
                lines = f.readlines()
                seqName, seq, conSeq, input_flag = postprocessInputSeq(lines, is_constraint)
                if not input_flag:
                    return flask.redirect(flask.url_for("errorPage", text=seq))
                ## text = f.readlines()
                ## if len(text) > 2 or len(text) < 1:
                ##     os.system("rm -f {}".format(tmpPath))
                ##     return 'wrong format in file'
                ## seqName = 'NoName' if len(text)==1 else text[0][1:-1] if text[0][0] == '>' else text[0][:-1]
                ## seq     = text[-1][:-1]
            os.system("rm -f {}".format(tmpPath))
        elif text == "":
            seq = "GGUUAAGCGACUAAGCGUACACGGUGGAUGCCCUGGCAGUCAGAGGCGAUGAAGG"
            seqName = "noName"
            input_flag = True
            # return 'No input, nor selected file'
        # upload part
        else:
            lines = text.split("\n")
            seqName, seq, conSeq, input_flag = postprocessInputSeq(lines, is_constraint)
            if not input_flag:
                return flask.redirect(flask.url_for("errorPage", text=seq))
            ## lineStop = text.find('\n')
            ## if lineStop == -1:
            ##     return flask.redirect(flask.url_for('errorPage',text=text))
            ##     #return 'wrong input, supposed to be FASTA format'
            ## # input part
            ## input_flag = True
            ## seqName = text[1:lineStop]
            ## seq     = text[lineStop+1:]

        if input_flag:
            ## seq0 = seq
            ## seq = seq.replace('\n','')
            ## seq = seq.replace('\r','')
            ## seq = seq.replace(' ','')
            ## wrong_symb = ''.join(re.findall('[^AUCGTNaucgtn]+',seq))
            ## seq = seq.upper()
            ## seq = seq.replace("T", "U")

            ## if wrong_symb:
            ##     return flask.redirect(flask.url_for('errorPage',text='...'+wrong_symb[:1000]+'...'))
            ##     #return 'wrong input, only A/U/C/G is supposed in sequences'
            ## #print('len: {}'.format(len(seq)))
            seqName = secure_filename(seqName)
            filename += seqName
            newPath = os.path.join(fileDir, filename)
            f = open(newPath, "w")
            f.write("{}\n{}\n{}".format(seqName, seq, beamsize))
            f.close()
            T0 = time.time()
            try:
                # print(filename)
                newurl = LF_v_core(filename, seq, seqName, beamsize, T0, usrIP)
                # print(newurl)
                # show(newurl)
                return flask.redirect(newurl)
            except:
                return "Sorry, Something wrong dealing with the sequence (LinearFold-V)"


def LF_v_core(filename, seq, seqName, beamsize, T0, usrIP, conSeq=None, dld_cmt=": "):
    outLv = ironcreekOutDir + filename + ".lv.res"  # output path for linearFold-V
    t2 = request_ironcreek_v(filename)  # call lv functions in ironcreek, save results in files, return time

    f_lv = open(outLv, "r")
    lv = f_lv.readlines()
    f_lv.close()
    print(outLv)

    line_idx_t, line_idx_s, line_idx_res = 1, 2, 3  # Vincent version
    t2 = "".join(re.findall("Time: ([0-9]+[.0-9]{0,3})", lv[line_idx_t]))
    score2 = "".join(re.findall("Score: ([\-0-9]+[.0-9]{0,3})", lv[line_idx_s]))  # Vincent version
    print("[time {}s] [score {}] [b {}] [LF file {}]".format(t2, score2, beamsize, filename))
    # write results of lc, lv to a final pairing.res result
    pairingFile = pairingDir + filename + ".pairing.res"  # output with pairingName
    arc_pairing_single_json.LoadSave_lv(
        pairingFile, seq, lv[line_idx_res][:-1], t2, beamsize, seqName, score2, conSeq
    )  # Vincent version

    T1 = time.time() - T0

    os.system("chmod 644 " + pairingFile)
    logInfo = "[{0}] [len: {1:0>6}] [time: {2:0>12.5f}s] [LF file: {3}] [IP: {4}]".format(
        time.asctime(), len(seq), T1, filename, usrIP
    )
    addlog(logInfo)
    # global pairingName#, total_time         # Kaibo remove 3/11/2019
    # pairingName = filename+'.pairing.res'   # Kaibo remove 3/11/2019

    newurl = flask.url_for("showRes_LV", name=filename, dld_cmt=dld_cmt)
    return newurl


# kaibo added 01/30/2020
@app.route(partitionURL_v, methods=["GET", "POST"])
def inputSeq_LP_v():
    if flask.request.method == "POST":

        T0 = time.time()
        input_flag = False
        # beamsize = flask.request.form['beamSize']
        # if not beamsize: beamsize = '100'
        # if int(beamsize) > 200: beamsize = '200'
        beamsize = 100
        text = flask.request.form["seqInput"]
        filename = str(time.time()) + "_"
        usrIP = flask.request.remote_addr

        if "seqFile" in flask.request.files and flask.request.files["seqFile"].filename != "":
            usrFile = flask.request.files["seqFile"]
            # filename += secure_filename(usrFile.filename)
            # filename = filename[:-4]
            tmpPath = os.path.join(fileDir, "tmp")
            usrFile.save(tmpPath)
            input_flag = True

            with open(tmpPath) as f:
                lines = f.readlines()
                seqName, seq, _, input_flag = postprocessInputSeq(lines, False)
                if not input_flag:
                    return flask.redirect(flask.url_for("errorPage", text=seq + " "))

                ## text = f.readlines()
                ## if len(text) > 2 or len(text) < 1:
                ##     os.system("rm -f {}".format(tmpPath))
                ##     return 'wrong format in file'
                ## seqName = 'NoName' if len(text)==1 else text[0][1:-1] if text[0][0] == '>' else text[0][:-1]
                ## seq     = text[-1][:-1]
            os.system("rm -f {}".format(tmpPath))
        elif text == "":
            seq = "GGUUAAGCGACUAAGCGUACACGGUGGAUGCCCUGGCAGUCAGAGGCGAUGAAGG"
            seqName = "noName"
            input_flag = True
            # return 'No input, nor selected file'
        # upload part
        else:
            lines = text.split("\n")
            seqName, seq, _, input_flag = postprocessInputSeq(lines, False)
            if not input_flag:
                return flask.redirect(flask.url_for("errorPage", text=seq))

            ## lineStop = text.find('\n')
            ## if lineStop == -1:
            ##     return flask.redirect(flask.url_for('errorPage',text=text))
            ##     #return 'wrong input, supposed to be FASTA format'
            ## # input part
            ## input_flag = True
            ## seqName = text[1:lineStop]
            ## seq     = text[lineStop+1:]

        if input_flag:
            ## seq0 = seq
            ## seq = seq.replace('\n','')
            ## seq = seq.replace('\r','')
            ## seq = seq.replace(' ','')
            ## wrong_symb = ''.join(re.findall('[^AUCGTNaucgtn]+',seq))
            ## if wrong_symb:
            ##     return flask.redirect(flask.url_for('errorPage',text='...'+wrong_symb[:1000]+'...'))
            ##     #return 'wrong input, only A/U/C/G is supposed in sequences'
            ## #print('len: {}'.format(len(seq)))
            seqName = secure_filename(seqName)
            filename += seqName

            newPath = os.path.join(fileDir, filename)
            f = open(newPath, "w")
            f.write("{}\n{}\n{}".format(seqName, seq, beamsize))
            f.close()

            # beamsize = 100
            try:
                newurl = LP_v_core(filename, seq, seqName, beamsize, T0, usrIP)
                if newurl == "wrong":
                    flask.flash(
                        "Sorry, Something wrong dealing with the sequence with linearPartition.\nPlease try again"
                    )
                    return flask.render_template("interface_linearpartition_v.html")
                return flask.redirect(newurl)

            except:
                flask.flash("Sorry, Something wrong dealing with the sequence with linearPartition.\nPlease try again")
                return flask.render_template("interface_linearpartition_v.html")


def LP_v_core(filename, seq, seqName, beamsize, T0, usrIP):
    outLPv = ironcreekOutDir + filename + ".lpv.res"  # output path for linearPartition-V
    score2, t2, t3 = request_ironcreek_lp_v(filename)

    if score2 == "wrong":
        return score2

    print("[time {}+{}s] [score {}] [LP file {}]".format(t2, t3, score2, filename))

    lpv_mea = open(outLPv.replace("lpv.res", "lpv.mea.res"), "r").readlines()[1].strip()
    lpv_mea_pairs = arc_pairing_single_json.stru2pair(lpv_mea)
    lst_v_mea = []

    f_lpv = open(outLPv, "r")
    lpv = f_lpv.readlines()
    f_lpv.close()

    lst = []  # lst is the list for all partition pairs [i1,j1,p1,i2,j2,p2,...]
    for line in lpv:
        if len(line.strip()) == 0:
            continue
        a = line.strip().split()
        i, j = int(a[0]), int(a[1])
        if i > j:
            i, j = j, i
        lst += [i, j, float(a[2])]
        if (i - 1, j - 1) in lpv_mea_pairs:
            lst_v_mea += [i, j, float(a[2])]

    # write results of lpv to a final partition.res result (json)
    pairingFile = pairingDir + filename + ".partition.res"  # output with pairingName
    arc_pairing_single_json.LoadSave_lpv(pairingFile, seq, lst, t2, t3, beamsize, seqName, score2)
    pairingFile_mea = pairingDir + filename + ".partition.mea.res"  # output with pairingName
    arc_pairing_single_json.LoadSave_lpv(pairingFile_mea, seq, lst_v_mea, -1, -1, beamsize, seqName, score2, lpv_mea)

    T2 = time.time() - T0

    os.system("chmod 644 " + pairingFile)
    logInfo = "[{0}] [len: {1:0>6}] [time: {2:0>12.5f}s] [LP file: {3}] [IP: {4}]".format(
        time.asctime(), len(seq), T2, filename, usrIP
    )
    addlog(logInfo)

    print("[LP file {}][total time: {:.2f}]".format(filename, time.time() - T0))

    # return "LP"
    newurl = flask.url_for("showRes_LP_v", name=filename)

    return newurl


# kaibo added 06/30/2020
@app.route(partitionURL, methods=["GET", "POST"])
def inputSeq_LP():
    if flask.request.method == "POST":

        T0 = time.time()
        input_flag = False
        # beamsize = flask.request.form['beamSize']
        # if not beamsize: beamsize = '100'
        # if int(beamsize) > 200: beamsize = '200'
        beamsize = 100
        text = flask.request.form["seqInput"]
        filename = str(time.time()) + "_"
        usrIP = flask.request.remote_addr
        LP_v_only = flask.request.form.get("cfbox") == None
        print(LP_v_only)

        if "seqFile" in flask.request.files and flask.request.files["seqFile"].filename != "":
            usrFile = flask.request.files["seqFile"]
            # filename += secure_filename(usrFile.filename)
            # filename = filename[:-4]
            tmpPath = os.path.join(fileDir, "tmp")
            usrFile.save(tmpPath)
            input_flag = True

            with open(tmpPath) as f:
                lines = f.readlines()
                seqName, seq, _, input_flag = postprocessInputSeq(lines)
                if not input_flag:
                    return flask.redirect(flask.url_for("errorPage", text=seq))

                ## text = f.readlines()
                ## if len(text) > 2 or len(text) < 1:
                ##     os.system("rm -f {}".format(tmpPath))
                ##     return 'wrong format in file'
                ## seqName = 'NoName' if len(text)==1 else text[0][1:-1] if text[0][0] == '>' else text[0][:-1]
                ## seq     = text[-1][:-1]
            os.system("rm -f {}".format(tmpPath))
        elif text == "":
            seq = "GGUUAAGCGACUAAGCGUACACGGUGGAUGCCCUGGCAGUCAGAGGCGAUGAAGG"
            seqName = "noName"
            input_flag = True
            # return 'No input, nor selected file'
        # upload part
        else:
            lines = text.split("\n")
            seqName, seq, _, input_flag = postprocessInputSeq(lines)
            if not input_flag:
                return flask.redirect(flask.url_for("errorPage", text=seq))
            ## lineStop = text.find('\n')
            ## if lineStop == -1:
            ##     return flask.redirect(flask.url_for('errorPage',text=text))
            ##     #return 'wrong input, supposed to be FASTA format'
            ## # input part
            ## input_flag = True
            ## seqName = text[1:lineStop]
            ## seq     = text[lineStop+1:]

        if input_flag:
            ## seq0 = seq
            ## seq = seq.replace('\n','')
            ## seq = seq.replace('\r','')
            ## seq = seq.replace(' ','')
            ## wrong_symb = ''.join(re.findall('[^AUCGTNaucgtn]+',seq))
            ## if wrong_symb:
            ##     return flask.redirect(flask.url_for('errorPage',text='...'+wrong_symb[:1000]+'...'))
            ##     #return 'wrong input, only A/U/C/G is supposed in sequences'
            ## #print('len: {}'.format(len(seq)))
            seqName = secure_filename(seqName)
            filename += seqName

            newPath = os.path.join(fileDir, filename)
            f = open(newPath, "w")
            f.write("{}\n{}\n{}".format(seqName, seq, beamsize))
            f.close()

            # beamsize = 100
            if LP_v_only:
                if True:
                    # try:
                    newurl = LP_v_core(filename, seq, seqName, beamsize, T0, usrIP)
                    if newurl == "wrong":
                        flask.flash(
                            "Sorry, Something wrong dealing with the sequence with linearPartition.\nPlease try again"
                        )
                        return flask.render_template("interface_linearpartition2.html")
                    return flask.redirect(newurl)
                # except:
                #    flask.flash("Sorry, Something wrong dealing with the sequence with linearPartition.\nPlease try again")
                #    return flask.render_template('interface_linearpartition2.html')
                # return "Sorry, Something wrong dealing with the sequence during LinearPartition-V only mode"
                # if True:
                # try:
                outLPv = ironcreekOutDir + filename + ".lpv.res"  # output path for linearPartition-V
                outLPc = ironcreekOutDir + filename + ".lpc.res"  # output path for linearPartition-V
                score_c, tc2, tc3, score_v, tv2, tv3 = request_ironcreek_lp(filename)

                if score_c == "wrong" or score_v == "wrong":
                    flask.flash(
                        "Sorry, Something wrong dealing with the sequence with linearPartition.\nPlease try again"
                    )
                    return flask.render_template("interface_linearpartition2.html")

                print("[time {}+{}s] [score {}] [LP2 file {}]".format(tv2, tv3, score_v, filename))

                lpv_mea = open(outLPv.replace("lpv.res", "lpv.mea.res"), "r").readlines()[1].strip()
                lpv_mea_pairs = arc_pairing_single_json.stru2pair(lpv_mea)
                lst_v_mea = []

                f_lpv = open(outLPv, "r")
                lpv = f_lpv.readlines()
                f_lpv.close()

                lst_v = []  # lst is the list for all partition pairs [i1,j1,p1,i2,j2,p2,...]
                for line in lpv:
                    if len(line.strip()) == 0:
                        continue
                    a = line.strip().split()
                    i, j = int(a[0]), int(a[1])
                    if i > j:
                        i, j = j, i
                    lst_v += [i, j, float(a[2])]
                    if (i - 1, j - 1) in lpv_mea_pairs:
                        lst_v_mea += [i, j, float(a[2])]

                lpc_mea = open(outLPc.replace("lpc.res", "lpc.mea.res"), "r").readlines()[1].strip()
                lpc_mea_pairs = arc_pairing_single_json.stru2pair(lpc_mea)
                lst_c_mea = []

                f_lpc = open(outLPc, "r")
                lpc = f_lpc.readlines()
                f_lpc.close()

                lst_c = []  # lst is the list for all partition pairs [i1,j1,p1,i2,j2,p2,...]
                for line in lpc:
                    if len(line.strip()) == 0:
                        continue
                    a = line.strip().split()
                    i, j = int(a[0]), int(a[1])
                    if i > j:
                        i, j = j, i
                    lst_c += [i, j, float(a[2])]
                    if (i - 1, j - 1) in lpc_mea_pairs:
                        lst_c_mea += [i, j, float(a[2])]

                # write results of lpv and lpc to a final partition.res result (json)
                pairingFile = pairingDir + filename + ".partition.res"  # output with pairingName
                # arc_pairing_single_json.LoadSave_lpv(pairingFile,seq,lst,t2,t3,beamsize,seqName,score2)
                arc_pairing_single_json.LoadSave_lp2(
                    pairingFile, seq, lst_c, tc2, tc3, beamsize, seqName, score_c, lst_v, tv2, tv3, score_v
                )
                pairingFile_mea = pairingDir + filename + ".partition.mea.res"  # output with pairingName
                arc_pairing_single_json.LoadSave_lp2(
                    pairingFile_mea,
                    seq,
                    lst_c_mea,
                    -1,
                    -1,
                    beamsize,
                    seqName,
                    score_c,
                    lst_v_mea,
                    -1,
                    -1,
                    score_v,
                    lpc_mea,
                    lpv_mea,
                )

                T2 = time.time() - T0

                os.system("chmod 644 " + pairingFile)
                logInfo = "[{0}] [len: {1:0>6}] [time: {2:0>12.5f}s] [LP2 file: {3}] [IP: {4}]".format(
                    time.asctime(), len(seq), T2, filename, usrIP
                )
                addlog(logInfo)

                print("[LP2 file {}][total time: {:.2f}]".format(filename, time.time() - T0))

                # return "LP"
                newurl = flask.url_for("showRes_LP", name=filename)
                return flask.redirect(newurl)

            # except:
            #    return "Sorry, Something wrong dealing with the sequence (LinearPartition)"


@app.route(demoURL, methods=["GET", "POST"])
def inputSeq():
    if flask.request.method == "POST":
        input_flag = False
        beamsize = flask.request.form["beamSize"]
        if not beamsize:
            beamsize = "100"
        try:
            if int(beamsize) > 200:
                beamsize = "200"
        except:
            return "wrong format for beamsize, please only input numbers"

        conSeq = None
        is_constraint = flask.request.form.get("constrBox") != None
        print("constraint:", is_constraint)

        is_zuker = flask.request.form.get("zukerBox") != None
        if is_constraint:
            is_zuker = False  # only either constraint or zuker allowed
        print("zuker:", is_zuker)
        if is_zuker:
            zuker_delta = flask.request.form["zukerDelta"]
            try:
                if not zuker_delta or float(zuker_delta) > 10:
                    zuker_delta = "5"
            except:
                return "wrong format for &Delta;(score), please only input numbers"

        text = flask.request.form["seqInput"]
        filename = str(time.time()) + "_"
        usrIP = flask.request.remote_addr
        LF_v_only = flask.request.form.get("cfbox") == None
        print(LF_v_only)

        if "seqFile" in flask.request.files and flask.request.files["seqFile"].filename != "":
            usrFile = flask.request.files["seqFile"]
            # filename += secure_filename(usrFile.filename)
            # filename = filename[:-4]
            tmpPath = os.path.join(fileDir, "tmp")
            usrFile.save(tmpPath)
            input_flag = True

            with open(tmpPath) as f:
                lines = f.readlines()
                seqName, seq, conSeq, input_flag = postprocessInputSeq(lines, is_constraint)
                if not input_flag:
                    return flask.redirect(flask.url_for("errorPage", text=seq))
                ## text = f.readlines()
                ## if len(text) > 3 or len(text) < 1:
                ## if len(text) < 1 or not text[0].startswith('>'):
                ##     os.system("rm -f {}".format(tmpPath))
                ##     return 'FASTA format requires a header starting with ">"'
                ##     return 'wrong format in file, 1 line for name, 1 line for sequence please'
                ## seqName = 'NoName' if len(text)==1 else text[0][1:-1] if text[0][0] == '>' else text[0][:-1]
                ## seq     = text[1][:-1]
                ## if is_constraint:
                ##     conSeq = text[2].strip()
            os.system("rm -f {}".format(tmpPath))
        elif text == "":
            seq = "GGUUAAGCGACUAAGCGUACACGGUGGAUGCCCUGGCAGUCAGAGGCGAUGAAGG"
            seqName = "noName"
            is_constraint = False
            input_flag = True
            # return 'No input, nor selected file'
        # upload part
        else:
            lines = text.split("\n")
            seqName, seq, conSeq, input_flag = postprocessInputSeq(lines, is_constraint)
            if not input_flag:
                return flask.redirect(flask.url_for("errorPage", text=seq))
            ## print(len(lines), lines)
            ## #lineStop = text.find('\n')
            ## #if lineStop == -1:
            ## if len(lines) < 1 or len(lines) > 3:
            ##     return flask.redirect(flask.url_for('errorPage',text=text))
            ##     #return 'wrong input, supposed to be FASTA format'
            ## # input part
            ## input_flag = True
            ## #seqName = text[1:lineStop]
            ## #seq     = text[lineStop+1:]
            ## seqName = lines[0]
            ## seq = lines[1].strip()
            ## if is_constraint:
            ##     conSeq = lines[2].strip()
        if input_flag:
            ## seq0 = seq
            ## seq = seq.replace('\n','')
            ## seq = seq.replace('\r','')
            ## seq = seq.replace(' ','')
            ## wrong_symb = ''.join(re.findall('[^AUCGTNaucgtn]+',seq))
            ## if wrong_symb:
            ##     return flask.redirect(flask.url_for('errorPage',text='...'+wrong_symb[:1000]+'...'))
            ##     #return 'wrong input, only A/U/C/G is supposed in sequences'
            ## #print('len: {}'.format(len(seq)))
            if is_constraint:
                conMsg = check_constraint(seq, conSeq)
                if conMsg != 0:
                    return conMsg
            seqName = secure_filename(seqName)
            filename += seqName
            newPath = os.path.join(fileDir, filename)
            f = open(newPath, "w")
            f.write("{}\n{}\n{}".format(seqName, seq, beamsize))
            if is_constraint:
                f.write("\n{}".format(conSeq))
            if is_zuker:
                f.write("\ndelta {}".format(zuker_delta))
            f.close()
            T0 = time.time()
            if LF_v_only:
                # if True:
                try:
                    newurl = LF_v_core(
                        filename,
                        seq,
                        seqName,
                        beamsize,
                        T0,
                        usrIP,
                        conSeq,
                        " with Zuker suboptimal structures: " if is_zuker else ": ",
                    )
                    return flask.redirect(newurl)
                except:
                    return "Sorry, Something wrong dealing with the sequence during LinearFold-V only mode"
            try:
                # if True:
                t1, t2 = request_ironcreek(
                    filename
                )  # call lc/lv functions in ironcreek, save results in files, return time
                # print(filename)

                outLc = ironcreekOutDir + filename + ".lc.res"  # output path for linearFold-C
                outLv = ironcreekOutDir + filename + ".lv.res"  # output path for linearFold-V

                f_lc = open(outLc, "r")
                f_lv = open(outLv, "r")

                lc = f_lc.readlines()
                lv = f_lv.readlines()
                f_lc.close()
                f_lv.close()

                print(outLc)
                # line_idx_t, line_idx_s, line_idx_res = 4, 3, 6  # Dezhong version
                line_idx_t, line_idx_s, line_idx_res = 1, 2, 3  # Vincent version
                t1 = "".join(re.findall("Time: ([0-9]+[.0-9]{0,3})", lc[line_idx_t]))
                t2 = "".join(re.findall("Time: ([0-9]+[.0-9]{0,3})", lv[line_idx_t]))
                score1 = "".join(re.findall("Score: ([\-0-9]+[.0-9]{0,3})", lc[line_idx_s]))
                score2 = "".join(re.findall("Score: ([\-0-9]+[.0-9]{0,3})", lv[line_idx_s]))  # Vincent version
                # score2 = '{0:.2f}'.format(float(''.join(re.findall('score: ([\-0-9]+[.0-9]{0,3})',lv[3])))/(-100)) # Dezhong version
                print(
                    "[time {}/{}s] [score {}/{}] [b {}] [LF file {}]".format(t1, t2, score1, score2, beamsize, filename)
                )
                # write results of lc, lv to a final pairing.res result
                pairingFile = pairingDir + filename + ".pairing.res"  # output with pairingName
                arc_pairing_single_json.LoadSave(
                    pairingFile,
                    seq,
                    lc[line_idx_res][:-1],
                    lv[line_idx_res][:-1],
                    t1,
                    t2,
                    beamsize,
                    seqName,
                    score1,
                    score2,
                    conSeq,
                )  # Vincent version

                # LoadSave(pairingFile,seq,lc[line_idx_res][:-1],lv[line_idx_res][:-1],t1,t2,beamsize,seqName,score1,score2)   # Vincent version

                T1 = time.time() - T0
                # print("total time = {}".format(T1))

                """
                # extract data from json-format pairing file
                # copy pairing date from ~/public_html to local
                with open(pairingFile) as f:
                    pData = json.load(f)
                global pairingName, Beamsize, Lc, Lv, Seq, Info
                pairingName = filename + '.pairing.res'
                Lc, Lv, Seq = pData['pairing'][6], pData['pairing'][7], seq
                Info, Beamsize = ">> linearFold-C\n{}>> linearFold-V\n{}".format(lc[-1],lv[-1]), beamsize
                logInfo = "[{0}] [len: {1:0>7}] [time: {2:0>12.5f}s] [file: {3}]".format(time.asctime(), len(seq) , T1, filename)
                addlog(logInfo, usrIP)
                newpairingFile = './demo_data_run/'+ pairingName
                os.system('cp {} {}'.format(pairingFile,newpairingFile))
                """
                os.system("chmod 644 " + pairingFile)
                logInfo = "[{0}] [len: {1:0>6}] [time: {2:0>12.5f}s] [LF2 file: {3}] [IP: {4}]".format(
                    time.asctime(), len(seq), T1, filename, usrIP
                )
                addlog(logInfo)
                # global pairingName#, total_time         # Kaibo remove 3/11/2019
                # pairingName = filename+'.pairing.res'   # Kaibo remove 3/11/2019

                newurl = flask.url_for(
                    "showRes_old", name=filename, dld_cmt=" with Zuker suboptimal structures: " if is_zuker else ": "
                )
                # print(newurl)
                # show(newurl)
                return flask.redirect(newurl)
            except:
                return "Sorry, Something wrong dealing with the sequence (LinearFold)"

            """
            #show(pairingFile)
            return Info + '<br>name:&nbsp&nbsp' + seqName + '<br>seq:&nbsp&nbsp&nbsp&nbsp' + seq+'<br><br><br>'+resInfo.replace('\n','<br>')+'<br>'+pData['pairing'][6]+'<br><br>'+pData['pairing'][7]
            """


def setsize(data, default=100, limit=200):
    if not data:
        return str(default)
    try:
        data1 = int(data)
    except:
        return str(default)
    return str(min(data1, limit))


# kaibo added 03/30/2021, copied from inputSeq_LP_v
@app.route(samplingURL_v, methods=["GET", "POST"])
def inputSeq_LS_v():
    if flask.request.method == "POST":

        T0 = time.time()
        input_flag = False
        beamsize = setsize(flask.request.form["beamSize"], 100, 200)
        samplesize = setsize(flask.request.form["sampleSize"], 1000, 2000)
        #  beamsize = 100
        text = flask.request.form["seqInput"]
        filename = str(time.time()) + "_"
        usrIP = flask.request.remote_addr

        if "seqFile" in flask.request.files and flask.request.files["seqFile"].filename != "":
            usrFile = flask.request.files["seqFile"]
            # filename += secure_filename(usrFile.filename)
            # filename = filename[:-4]
            tmpPath = os.path.join(fileDir, "tmp")
            usrFile.save(tmpPath)
            input_flag = True

            with open(tmpPath) as f:
                lines = f.readlines()
                seqName, seq, _, input_flag = postprocessInputSeq(lines, False)
                if not input_flag:
                    return flask.redirect(flask.url_for("errorPage", text=seq))

            os.system("rm -f {}".format(tmpPath))
        elif text == "":
            seq = "GGUUAAGCGACUAAGCGUACACGGUGGAUGCCCUGGCAGUCAGAGGCGAUGAAGG"
            seqName = "noName"
            input_flag = True
            # return 'No input, nor selected file'
        # upload part
        else:
            lines = text.split("\n")
            seqName, seq, _, input_flag = postprocessInputSeq(lines, False)
            if not input_flag:
                return flask.redirect(flask.url_for("errorPage", text=seq))

        if input_flag:
            seqName = secure_filename(seqName)
            filename += seqName

            newPath = os.path.join(fileDir, filename)
            f = open(newPath, "w")
            f.write("{}\n{}\n{}\n{}".format(seqName, seq, beamsize, samplesize))
            f.close()

            # beamsize = 100
            try:
                # if True:
                newurl = LS_v_core(filename, seq, seqName, beamsize, samplesize, T0, usrIP)
                if newurl == "wrong":
                    # return "Sorry, Something wrong dealing with the sequence with linearSampling.\nPlease try aga"
                    flask.flash(
                        "Sorry, Something wrong dealing with the sequence with linearSampling.\nPlease try again"
                    )
                    return flask.render_template("interface_linearsampling_v.html")
                return flask.redirect(newurl)

            except:
                flask.flash("Sorry, Something wrong dealing with the sequence with linearSampling.\nPlease try again")
                return flask.render_template("interface_linearsampling_v.html")


def LS_v_core(filename, seq, seqName, beamsize, samplesize, T0, usrIP):
    outLSv = ironcreekOutDir + filename + ".lsv.res"  # output path for linearSampling-V
    t = request_ironcreek_ls_v(filename)
    if t == "wrong" or t.startswith("error"):
        return "wrong"
    t = round(float(t), 2)

    # logInfo(f'{score}+{t}')
    print("[time {}s] [LS file {}]".format(t, filename))

    # write results of lsv to a final sampling.res result (json)
    pairingFile = pairingDir + filename + ".sampling.res"  # output with pairingName
    arc_pairing_single_json.LoadSave_ls(
        pairingFile, seq, outLSv, t, beamsize, seqName, samplesize, nDisp=min(18, samplesize)
    )

    T2 = time.time() - T0

    os.system("chmod 644 " + pairingFile)
    logInfo = "[{0}] [len: {1:0>6}] [time: {2:0>12.5f}s] [LS file: {3}] [IP: {4}]".format(
        time.asctime(), len(seq), T2, filename, usrIP
    )
    addlog(logInfo)

    print("[LS file {}][total time: {:.2f}]".format(filename, time.time() - T0))

    # return "LP"
    newurl = flask.url_for("showRes_LS_v", name=filename, samplesize=str(samplesize))

    return newurl


@app.route("/invalid_<text>")
def errorPage(text):
    return flask.render_template("errorpage.html", text=text)


@app.route("/preset.html")
def preset():
    return app.send_static_file("preset.html")
    # Function used internally to send static files from the static folder to the browser.


@app.route("/preset_all.html")
def preset_all():
    return app.send_static_file("preset_all.html")
    # Function used internally to send static files from the static folder to the browser.


def addlog(logInfo):
    os.system("echo {} >> {}".format(logInfo, logFile))
    ### os.system("echo {} >> {}".format(logInfo, logFile))
    ### try:
    ###     os.system("cp {} {}".format(logFile, logFile2))
    ### except:
    ###     print('cannot cp log from home to here')


def request_ironcreek(seqfile):
    s1, s2 = socket.socket(), socket.socket()  # creat socket object
    host = "ironcreek.eecs.oregonstate.edu"
    port1, port2 = 11110, 11111  # set port

    s1.connect((host, port1))
    s2.connect((host, port2))
    # seqfile_s = bytes(seqfile,'UTF-8')
    s1.send(seqfile)
    s2.send(seqfile)
    t1 = s1.recv(1024)
    t2 = s2.recv(1024)

    s1.close()
    s2.close()

    return t1, t2


def request_ironcreek_v(seqfile):
    s2 = socket.socket()  # creat socket object
    host = "ironcreek.eecs.oregonstate.edu"
    port2 = 11111  # set port

    s2.connect((host, port2))
    # seqfile_s = bytes(seqfile,'UTF-8')
    s2.send(seqfile)
    t2 = s2.recv(1024)

    s2.close()

    return t2


def request_ironcreek_lp(seqfile):
    s3, s4 = socket.socket(), socket.socket()  # creat socket object
    host = "ironcreek.eecs.oregonstate.edu"
    port3, port4 = 21110, 21111  # set port

    s3.connect((host, port3))
    s4.connect((host, port4))

    # seqfile_s = bytes(seqfile,'UTF-8')
    s3.send(seqfile)
    s4.send(seqfile)
    rec3 = s3.recv(1024)
    rec4 = s4.recv(1024)

    s3.close()
    s4.close()

    score3, t3_2, t3_3 = rec3.decode("utf-8").split("|")
    score4, t4_2, t4_3 = rec4.decode("utf-8").split("|")
    return score3, t3_2, t3_3, score4, t4_2, t4_3


def request_ironcreek_lp_v(seqfile):
    s4 = socket.socket()  # creat socket object
    host = "ironcreek.eecs.oregonstate.edu"
    port4 = 21111  # set port

    s4.connect((host, port4))
    # seqfile_s = bytes(seqfile,'UTF-8')
    s4.send(seqfile)
    rec = s4.recv(1024)

    s4.close()

    score, t2, t3 = rec.decode("utf-8").split("|")
    return score, t2, t3


def request_ironcreek_ls_v(seqfile):
    s4 = socket.socket()  # creat socket object
    host = "ironcreek.eecs.oregonstate.edu"
    port4 = 31111  # set port

    s4.connect((host, port4))
    # seqfile_s = bytes(seqfile,'UTF-8')
    s4.send(seqfile)
    rec = s4.recv(1024)

    s4.close()

    # score, t = rec.decode("utf-8").split('|')
    t = rec.decode("utf-8")
    return t


consSet = {"?", ".", "(", ")"}
pairSet = {"AU", "UA", "GU", "UG", "GC", "CG"}


def check_constraint(seq, conSeq):
    if not seq.isalpha():
        return "Unrecognized sequence."

    if len(seq) != len(conSeq):
        return "The lengths don't match between sequence and constraints"

    check = []
    pairs = set()
    for i, c in enumerate(conSeq):
        if c not in consSet:
            return "Unrecognized constraint character, should be ? . ( or )"

        if c == "(":
            check.append(i)
        elif c == ")":
            if len(check) == 0:
                return "Constraint has unbalanced brackets."
            left = check.pop()
            if seq[left] + seq[i] not in pairSet:
                return "Constrains on non-classical base pairs (non AU, CG, GU pairs) in constraints"
            # pairs.add(seq[left] + seq[i])

    if check:
        return "Constraint has unbalanced brackets."
    # for p in pairs:
    #    if p not in pairSet:
    #        return "Constrains on non-classical base pairs (non AU, CG, GU pairs)"

    return 0


# @app.route('/download/<name>')
# def downloadFile (name):
#     #abs_path = "static/pairingRes/q1.orf.res"
#     #return flask.send_file(abs_path, as_attachment=True)
#     return flask.send_from_directory(directory='static/pairingRes', filename=name, as_attachment=True)

# kaibo added for linearfold - zuker
@app.route(os.path.join(demoURL, "down_<name>=<cv>"))
def downloadRes(name, cv):
    # cv = 'c', or 'v', extension is .lc.res or .lv.res
    name0 = name.replace(".pairing.res", "")
    attachfile = "{}{}.l{}.res".format(ironcreekOutDir, name0, cv)
    clean_name = name0[name0.find("_") + 1 :] + "_linearfold-" + cv + ".txt"
    return flask.send_file(attachfile, mimetype="text/plain", attachment_filename=clean_name, as_attachment=True)


# kaibo added for linearsampling 03/30/2021
@app.route(os.path.join(samplingURL_v, "down_<name>"))
def downloadLSRes(name):
    name0 = name.replace(".sampling.res", "")
    attachfile = "{}{}.lsv.res".format(ironcreekOutDir, name0)
    clean_name = name0[name0.find("_") + 1 :] + "_linearsampling.txt"
    return flask.send_file(attachfile, mimetype="text/plain", attachment_filename=clean_name, as_attachment=True)


def postprocessInputSeq(lines, is_constraint=False):
    if len(lines) < 1:
        return None, "empty", None, False
    print(len(lines), lines)

    line1 = lines[0].strip()
    if len("".join(re.findall("[^AUCGTNaucgtn]+", line1))) > 0:  # check if lines[0] is seqName
        seqName = line1[1:] if line1.startswith(">") else line1
        seqLineId = 1
    else:
        seqName = "NoName"
        seqLineId = 0
    # lineStop = text.find('\n')
    # if lineStop == -1:
    # if len(lines) < 1 or len(lines) > 3:
    #     return flask.redirect(flask.url_for('errorPage',text=text))
    #     #return 'wrong input, supposed to be FASTA format'
    # # input part
    # input_flag = True
    conSeq = None
    if not is_constraint:  # multi-line is ok
        seq = "".join([x.strip() for x in lines[seqLineId:]])
        seq = seq.replace("\n", "")
        seq = seq.replace("\r", "")
        seq = seq.replace(" ", "")
        seq = seq.split(">")[0]
    else:  # no linebreak allowed for seq and seqCons
        seq = lines[seqLineId].strip()
        conSeq = lines[seqLineId + 1].strip()
    wrong_symb = "".join(re.findall("[^AUCGTNaucgtn]+", seq))
    if len(seq) == 0 or len(wrong_symb) > 0:
        return None, seq, None, False
    seq = seq.upper()
    seq = seq.replace("T", "U")
    return seqName, seq, conSeq, True


### LinearTurboFold / LTF part, mostly from Evan Yang
@app.route(ltfURL)  # static page, loads template
def my_form_LTF():
    return flask.render_template("interface_linearturbofold.html")


from datetime import datetime


@app.route(ltfURL, methods=["GET", "POST"])  # edits static page
def inputSeq_LTF():  # purpose- create an output file to do what?
    foldingBeam = flask.request.form["foldingBeam"]
    alignmentBeam = flask.request.form["alignmentBeam"]
    iteration = flask.request.form["iterationNum"]
    Threshknot = flask.request.form["ThreshknotNum"]
    texts = flask.request.form["seqInput"]  # if left empty, will return a default string
    jobID = flask.request.form["jobID"]  # .decode('utf-8')

    # print("This is output:"   ,texts)
    # print(foldingBeam, alignmentBeam)
    # print(alignmentBeam is None, alignmentBeam== "") #returns empty string
    # checks for foldingbeam
    if foldingBeam == "":
        foldingBeam = 100
    try:
        foldingBeam = int(foldingBeam)
    except:
        return "Folding Beam should be an integer"
    if foldingBeam < -1:
        return "Folding Beam should a positive value"

    # checks for alignment beam
    if alignmentBeam == "":
        alignmentBeam = 100
    try:
        alignmentBeam = int(alignmentBeam)
    except:
        return "Alignment beam should be an integer"
    if alignmentBeam < 0:
        return "Alignment Beam should be a positive value"

    # checks for iteration
    if iteration == "":
        iteration = 3
    try:
        iteration = int(iteration)
    except:
        return "Iteration should be an integer"
    if iteration < 0:
        return "Iteration should be a positive value"

    # checks for threshknot value
    if Threshknot == "":
        Threshknot = 0.3
    try:
        Threshknot = float(Threshknot)
    except:
        return "Threshknot Threshold should be a float"
    if Threshknot < 0:
        return "Threshknot Threshold should be a positive value"
    if Threshknot > 1:
        return "Threshknot Threshold should be less than 1"

    # file upload part
    # uploadedFile=flask.request.files["seqFile"]
    # if(uploadedFile== ''): #how to check if file is not loaded
    #    print("Works!!!")
    # print("hello",  uploadedFile)
    # readFileName=flask.request.files['seqFile'].filename # kaibo removed
    # print(readFileName)

    # ltfBaseName = secure_filename(os.path.join(fileDir, 'LTF', jobID))
    ltfBaseName = os.path.join(fileDir, "LTF", jobID)
    print(ltfBaseName)
    upload_flag = False
    if "seqFile" in flask.request.files and flask.request.files["seqFile"].filename != "":
        usrFile = flask.request.files["seqFile"]
        # filename += secure_filename(usrFile.filename)
        # filename = filename[:-4]

        usrFile.save(ltfBaseName + ".fasta")
        upload_flag = True

        # print("relax")

        with open(ltfBaseName + ".fasta") as f:
            fileLines = f.readlines()
            # print(fileLines)
            texts = ""
            texts = texts.join(fileLines)

    # check texts
    # #end file upload part
    # #checks and validates text sequence
    # print("texts", texts)
    # texts=str(texts)
    # testArray=['hey','hello']
    # textArray=texts.split('/')
    # print(testArray)
    # print('textArray',texts)
    # return texts

    # end text validation

    # #start file storage section
    # #creates random user ID
    # import random
    # userID= random.randint(1,10000)
    # print("userID is ", userID)
    # now= datetime.now()
    # #print(texts)
    # ltfFileName= str(userID)+"TestingLTF" + now.strftime("%m/%d/%Y, %H:%M:%S")
    # ltfFileName=ltfFileName.replace("/",'').replace(" ",'').replace(",",'').replace(":",'')
    # print("File Name", ltfFileName)

    if not upload_flag:
        with open(ltfBaseName + ".fasta", "w") as f:
            # f.write("{}\n{}\n{}\n{}\n{}".format(texts, foldingBeam, alignmentBeam,iteration,Threshknot))
            # f.write("{}\n".format(texts))
            f.write(texts)

    with open(ltfBaseName + ".para", "w") as f:
        f.write("{}\n{}\n{}\n{}\n".format(foldingBeam, alignmentBeam, iteration, Threshknot))

    outDirLTF1 = request_ironcreek_LTF(ltfBaseName)  # call this line 173
    assert outDirLTF1 == ironcreekOutDir_LTF + jobID, "output to {}, not {}".format(
        outDirLTF1, ironcreekOutDir_LTF + jobID
    )
    print(outDirLTF1, LTFDir + "/" + jobID)
    # os.system('cp -r {} {}'.format(outDirLTF1, LTFDir))
    cmd = "cp -r {} {}".format(outDirLTF1, LTFDir)
    print("+++" + cmd)
    os.system(cmd)
    # os.system('chmod 755 {}{}; chmod 744 {}{}/*'.format(LTFDir, jobID, LTFDir, jobID))
    cmd = "chmod 755 {}{}; chmod 744 {}{}/*".format(LTFDir, jobID, LTFDir, jobID)
    os.system(cmd)
    print("+++" + cmd)
    # jobres is the output dir/ltfBaseName/out
    # important: Evan- save files here <osu_server>:~/public_html
    return flask.redirect(flask.url_for("showRes_LTF", jobname=jobID))


def request_ironcreek_LTF(seqfile):
    s2 = socket.socket()
    host = "ironcreek.eecs.oregonstate.edu"
    port2 = 11118
    s2.connect((host, port2))
    s2.send(seqfile)
    outDirLTF1 = s2.recv(1024)
    s2.close()
    return outDirLTF1
    # what is the purpose of this function?


# @app.route(ltfURL)
# def my_form_LTF():
#     return flask.redirect(flask.url_for('showRes_LTF'))


@app.route(os.path.join(ltfURL, "res=<jobname>"))
def showRes_LTF(jobname):
    # return flask.render_template('showResult_linearturbofold.html',jobname=jobname) #original, Evan
    return flask.render_template("showResult_linearturbofold.html", jobname=jobname)  # dynamic one


@app.route(os.path.join(ltfURL, "res=precomputedSARSCoV2"))
def showRes_LTF_preset():
    return flask.render_template("showResult_linearturbofold_preset.html")  # original, Evan
    # return flask.render_template('showResult_Evan.html')


if __name__ == "__main__":
    # app.logger.debug('message processed')
    app.logger.info("message processed")
    # app.run(host='128.193.36.41', port=8001) #, debug=True) # flip.engr.oregonstate.edu
    # app.run(host='73.67.241.185', port=8080) #, debug=True) # flop.engr.oregonstate.edu
    # app.run(host='128.193.40.12', port=22) #, debug=True)  # web.engr.oregonstate.edu
    # app.debug = True

    if LOCAL_TESTING:
        app.run(port=8080)  # local machine
    else:
        app.run(host="128.193.38.37", port=8080)  # linearfoldtest.eecs.oregonstate.edu

    # app.run(host='0.0.0.0', port=8080 , debug=True)
    # app.run(host='0.0.0.0') #, debug=True)
    # app.run()
