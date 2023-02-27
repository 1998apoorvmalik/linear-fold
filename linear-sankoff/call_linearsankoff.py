import argparse
import subprocess
import os


def decode_output(output):
    return {
        "VmPeak": float(output.split("VmPeak: ")[1].split("\n")[0]),
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


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--seq", type=str, help="input sequences")
    parser.add_argument("--w", type=float, default=0.3, help="weight on alignment")
    parser.add_argument("--b", type=int, default=100, help="beam size (LinearSankoff), (DEFAULT=100)")
    parser.add_argument("--LFb", type=int, default=100, help="beam size (LinearFold), (DEFAULT=100)")
    parser.add_argument("--LAb", type=int, default=100, help="beam size (LinearAlignment), (DEFAULT=100)")
    parser.add_argument(
        "--LAw", type=int, default=0, help="alignment band width, (DEFAULT=0, posterior probabilistic alignment region)"
    )
    parser.add_argument("--astar", action="store_true", help="use A star heuristic during beam search")
    parser.add_argument("--branch", action="store_true", help="allow to add branch in one sequence")
    parser.add_argument("--energyDiff", type=float, default=0.3, help="maximum energy difference")
    parser.add_argument(
        "--verbose", action="store_true", help="print out energy of each loop in the structure, (DEFAULT=FALSE)"
    )

    args = parser.parse_args()
    path = os.path.dirname(os.path.abspath(__file__))

    cmd = [
        "%s/%s" % (path, "linearsankoff"),
        str(args.w),
        str(args.b),
        str(args.LFb),
        str(args.LAb),
        str(args.LAw),
        "1" if args.astar else "0",
        "1" if args.branch else "0",
        str(args.energyDiff),
        "1" if args.verbose else "0",
    ]

    subprocess.run(cmd, input=str.encode(args.seq))

    # To Debug ---------------------------------------------------------------------------
    # run command => python call_linearsankoff.py --seq "$(cat test_inputs/input3.fasta)"
    # out = subprocess.check_output(cmd, input=str.encode(args.seq), shell=True)
    # print(decode_output(out.decode("utf-8")))
