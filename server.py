# flake8: noqa

import base64
import os
import subprocess
import sys

from flask import Flask, jsonify, request

sys.path.append("./linear-sankoff/")

from call_linearsankoff import decode_output  # noqa
from generate_linear_plot import draw  # noqa

app = Flask(__name__)


@app.route("/linear-sankoff", methods=["POST"])
def linear_sankoff():
    data = request.get_json()
    path = os.path.dirname(os.path.abspath(__file__))

    cmd = "python3 %s/%s --seq '%s' --w %s --b %s --LFb %s --LAb %s --LAw %s --energyDiff %s %s %s %s" % (
        path,
        "linear-sankoff/call_linearsankoff.py",
        data["seq"],
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

    out = decode_output(subprocess.check_output(cmd, shell=True).decode("utf-8"))
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
