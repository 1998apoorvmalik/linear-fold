# Author: Apoorv Malik (malikap@oregonstate.edu)
# Description: Used for generating static plot for Linear Sankoff output

import io

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Arc

# flake8: noqa

#################### load base pair ####################
def load_pairs(structure):
    structure = structure + "."
    pairs = []
    close_pairs = []
    stack = []

    pre_struc = 0  # 0 for ".", 1 for "(", 2 for ")"
    multibranch = 0
    for i, s in enumerate(structure):
        if s == ".":
            continue
        if s == "(":
            stack.append(i)
            if pre_struc == 2:  # ")" closing branch
                close_pairs.append(pairs[-1])
            pre_struc = 1
            multibranch = 0
            continue
        assert s == ")"  # .()

        left = stack.pop()
        if not multibranch and pairs:
            preleft = pairs[-1][0] - 1
            while preleft > left:
                if structure[preleft] != ".":
                    multibranch = 1
                    break
                preleft -= 1
            if multibranch:
                close_pairs.append(pairs[-1])

        pairs.append((left, i))

        pre_struc = 2

    assert not stack
    if pairs and not multibranch:
        close_pairs.append(pairs[-1])

    return pairs, close_pairs


#################### seq ID to align ID ####################
def seq2align(alignment, structure):
    seqID2alignID = {}
    seq_id = 0
    for i, nuc in enumerate(alignment):
        if nuc == "-":
            continue
        seqID2alignID[seq_id] = i
        seq_id += 1

    return seqID2alignID


#################### convert pairs to align ID ####################
def convert_pairs(pairs, seqID2alignID):
    newpairs = set()
    for (left, right) in pairs:
        newpairs.add((seqID2alignID[left], seqID2alignID[right]))
    return newpairs


#################### figure ####################
def draw(align1, struc1, align2, struc2):
    ### data processing
    alnlen = len(align1)
    seq1len = len(struc1)
    seq2len = len(struc2)

    (
        pairs1,
        closepairs1,
    ) = load_pairs(struc1)
    pairs2, closepairs2 = load_pairs(struc2)

    seq12align = seq2align(align1, struc1)
    seq22align = seq2align(align2, struc2)

    pairs1 = convert_pairs(pairs1, seq12align)
    pairs2 = convert_pairs(pairs2, seq22align)

    ### generate alignment and aligned structures
    alignstruc1 = ["-" for _ in range(alnlen)]
    alignstruc2 = ["-" for _ in range(alnlen)]
    alignrow = [" " for _ in range(alnlen)]
    for i in range(seq1len):
        alignstruc1[seq12align[i]] = "."
    for i in range(seq2len):
        alignstruc2[seq22align[i]] = "."
    for (left, right) in pairs1:
        alignstruc1[left] = "("
        alignstruc1[right] = ")"
    for (left, right) in pairs2:
        alignstruc2[left] = "("
        alignstruc2[right] = ")"
    for i, (a1, a2) in enumerate(zip(align1, align2)):
        if a1 != "-" and a2 != "-":
            if a1 == a2:
                alignrow[i] = "|"
            else:
                alignrow[i] = "."

    ### Create figure and axes
    X = np.zeros((int(alnlen / 2), alnlen, 3), dtype=int)  # start from 1, 1-200, 200-700, 799-900le
    X[:, :] = (255, 255, 255)
    fig, ax = plt.subplots()  # figsize=(10, 10)
    ax.imshow(X)

    ### add arches
    for (i, j) in pairs1:
        dis = j - i
        center = (i + j) / 2
        a = Arc(
            (center, alnlen / 4 * 0.95), dis, dis / 2, angle=180, theta1=0, theta2=180, linewidth=0.5, color="#03254c"
        )
        ax.add_artist(a)

    for (i, j) in pairs2:
        dis = j - i
        center = (i + j) / 2
        a = Arc(
            (center, alnlen / 4 * 1.05), dis, dis / 2, angle=0, theta1=0, theta2=180, linewidth=0.5, color="#03254c"
        )
        ax.add_artist(a)

    ### add text
    for i, nuc in enumerate(align1):
        plt.text(i, alnlen / 4 * 0.98, nuc, ha="center", va="center", fontsize=4.5, family="monospace")
    for i, nuc in enumerate(align2):
        plt.text(i, alnlen / 4 * 1.03, nuc, ha="center", va="center", fontsize=4.5, family="monospace")

    ### figure setting
    ax.spines["top"].set_color("none")
    ax.spines["bottom"].set_color("none")
    ax.spines["left"].set_color("none")
    ax.spines["right"].set_color("none")

    ax.get_xaxis().set_visible(False)
    ax.get_yaxis().set_visible(False)

    buf = io.BytesIO()
    plt.savefig(buf, format="png", dpi=250, bbox_inches="tight")
    buf.seek(0)

    ### detect inserted branches usning closepairs
    # print(closepairs1)
    inserted_base_pairs_seq1 = []
    for l1, r1 in closepairs1:

        al1 = seq12align[l1]
        ar1 = seq12align[r1]

        if alignstruc2[al1] != "(" or alignstruc2[ar1] != ")":
            assert alignstruc2[al1] != "(" and alignstruc2[ar1] != ")"
            inserted_base_pairs_seq1.append([al1, ar1])
            # print("Inserted Base Pairs -> Seq 1: [%d, %d]" % (al1, ar1))

    # print(closepairs2)
    inserted_base_pairs_seq2 = []
    for l2, r2 in closepairs2:
        al2 = seq22align[l2]
        ar2 = seq22align[r2]

        if alignstruc1[al2] != "(" or alignstruc1[ar2] != ")":
            assert alignstruc1[al2] != "(" and alignstruc1[ar2] != ")"
            inserted_base_pairs_seq2.append([al2, ar2])
            # print("Inserted Base Pairs -> Seq 2: [%d, %d]" % (al2, ar2))

    plt.close("all")
    return (
        buf.getvalue(),
        ["".join(alignstruc1), align1, "".join(alignrow), align2, "".join(alignstruc2)],
        pairs1,
        pairs2,
        inserted_base_pairs_seq1,
        inserted_base_pairs_seq2,
    )


def load_data(filename):
    data = {}
    with open(filename, "r") as f:
        lines = f.readlines()
        for line in lines:
            if ":" not in line:
                continue
            key, value = line.strip().split(": ")
            key = key.replace(":", "")
            print(key)
            data[key] = value

    return data["alignment 1"], data["structure 1"], data["alignment 2"], data["structure 2"]
