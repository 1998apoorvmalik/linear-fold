# flake8: noqa

import base64
import os
import subprocess
import sys
import re

from flask import Flask, jsonify, request

from utils.generate_linear_plot import draw  # noqa

port = 7001
os.system("fuser -k %d/tcp" % port)

app = Flask(__name__)


@app.route("/linear-sankoff", methods=["POST"])
def linear_sankoff():
    data = request.get_json()
    cmd = "echo '%s' | python3 %s --w %s --b %s --LFb %s --LAb %s --LAw %s --energyDiff %s %s %s %s" % (
        data["seq"],
        "./linearsankoff",
        data["w"],
        data["b"],
        data["LFb"],
        data["LAb"],
        data["LAw"],
        data["energyDiff"],
        "--astar" if data["astar"] else "",
        "--branch" if data["branch"] else "",
        "--verbose" if data["verbose"] else "",
    )


    # Run the command with the correct working directory
    working_directory = './programs/LinearSankoff'
    process = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=working_directory)

    # Communicate with the process to get stdout and stderr
    stdout, stderr = process.communicate()
    exit_code = process.returncode

    # Check if the process exited with an error
    if exit_code != 0:
        print(f"Error: The process exited with code {exit_code}")
        print(stderr.decode("utf-8"))  # Print the error message
    else:
        print("[LinearSankoff] Process completed successfully")

    # Decode and print the output
    output = stdout.decode("utf-8") 

    out = decode_linear_sankoff_output(output)
    img_buf, align_res, pairs1, pairs2, inserted_base_pairs_seq1, inserted_base_pairs_seq2 = draw(
        out["alignment 1"], out["structure 1"], out["alignment 2"], out["structure 2"]
    )
    image_content_base64 = base64.b64encode(img_buf).decode("utf-8")
    out["plot"] = image_content_base64
    out["alignment_result"] = align_res
    out["pairs1"] = list(pairs1)
    out["pairs2"] = list(pairs2)
    out["inserted_base_pairs_seq1"] = inserted_base_pairs_seq1
    out["inserted_base_pairs_seq2"] = inserted_base_pairs_seq2

    return jsonify(out)

@app.route("/linear-alifold", methods=["POST"])
def linear_alifold():
    data = request.get_json()
    cmd = "echo '%s' | python3 %s -b %s -e %s %s" % (
        data["seq"],
        "./programs/LinearAlifold/linearalifold.py",
        data["beamSize"],
        1 if data["energyModel"] == "em1" else 2,
        '-p' if (data["mode"] == "threshknot" or data["mode"] == "mea") else '',
    )

    # to debug, uncomment the following line
    # print(cmd)

    out = decode_LAF_output(subprocess.check_output(cmd, shell=True).decode("utf-8"), data["mode"])
    return jsonify(out)



# ------------------------------ utility functions to decode the server ouputs ------------------------------

def decode_linear_sankoff_output(output):
    return {
        # "VmPeak": float(output.split("VmPeak: ")[1].split("\n")[0]),
        "inside score": float(output.split("inside score: ")[1].split("\n")[0]),
        "sequence 1 folding score": float(output.split("sequence 1 folding score: ")[1].split("\n")[0]),
        "sequence 2 folding score": float(output.split("sequence 2 folding score: ")[1].split("\n")[0]),
        "probability": float(output.split("probability of alignment path: ")[1].split("\n")[0]),
        "structure 1": output.split("structure 1: ")[1].split("\n")[0],
        "structure 2": output.split("structure 2: ")[1].split("\n")[0],
        "alignment 1": output.split("alignment 1: ")[1].split("\n")[0],
        "alignment 2": output.split("alignment 2: ")[1].split("\n")[0],
        "time": output.split("time: ")[1].split(" ")[0],
    }


def decode_LAF_output(output, output_type="mfe"):
    # Split by newline to get individual lines
    lines = output.split('\n')

    # score is in the first line
    score = float(lines[0].split()[-2])
    
    structure = None 
    if output_type == "mfe":
        # find the line that starts with '.' or '('
        for i, line in enumerate(lines):
            if line.startswith('MFE'):
                structure = lines[i+1].split()[0]
                break
    elif output_type == "threshknot":
        # find the line that starts with 'threshnot' and get the next line
        for i, line in enumerate(lines):
            if line.startswith('Threshknot'):
                structure = lines[i+1].split()[0]
                break
    else:
        # find the line that starts with 'mea' and get the next line
        for i, line in enumerate(lines):
            if line.startswith('MEA'):
                structure = lines[i+1].split()[0]
                break
        
    return {"consensusStructure": structure, "score": score}
