function setPlotsView() {
  const toggler = document.getElementById("toggler");
  const view1 = document.getElementById("image");
  const view2 = document.getElementById("figure");

  toggler.addEventListener("change", function () {
    if (toggler.checked) {
      view1.style.display = "none";
      view2.style.display = "block";
    } else {
      view1.style.display = "block";
      view2.style.display = "none";
    }
  });
  // set defualt view for static plot and interactive plot
  view1.style.display = "none";
  view2.style.display = "block";
}

function getOutput(id) {
  const elements = document.querySelectorAll("#" + id);
  var text = "";
  for (var i = 0; i < elements.length; i++) {
    text += elements[i].innerHTML;
    // add a new line if it is not the last element
    if (i != elements.length - 1) text += "\n";
  }
  return text;
}

function copyOutput(id) {
  // navigator.clipboard.writeText(document.getElementById(id).innerHTML);
  navigator.clipboard.writeText(getOutput(id));
}

function downloadResult() {
  const result = {
    "Alignment 1": "{{ data['alignment 1'] }}",
    "Alignment 2": "{{ data['alignment 2'] }}",
    "Structure 1": "{{ data['structure 1'] }}",
    "Structure 2": "{{ data['structure 2'] }}",
    "Alignment Result": getOutput("result"),
    "Sequence 1 Folding Score":
      "{{ data['sequence 1 folding score'] }} kcal/mol",
    "Sequence 2 Folding Score":
      "{{ data['sequence 2 folding score'] }} kcal/mol",
    "Probability of Alignment Path": "{{ data['probability'] }}",
    Time: "{{ data['time'] }} seconds",
  };

  const data = JSON.stringify(result, null, 2);
  const blob = new Blob([data], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = "result.txt";
  a.href = url;
  a.click();
}

function mouseMoveTooltip(event) {
  var tooltips = document.getElementsByClassName("tooltip");

  tooltips[0].style.left = event.clientX - 65 + "px";
  tooltips[0].style.top = event.clientY - 75 + "px";
}

// JavaScript code for generating the figure

function generateInteractivePlot(topSeq, topPairs, bottomSeq, bottomPairs) {
  // some variables defining properties of the plot
  const fontSize = 16;
  const letterSpacing = 5;
  const arcColor = "#007C80";
  const mouseoverColor = "red";

  // pairs is list of tuple of two numbers, the maximum distance between two numbers in a tuple
  const max_distance = Math.max(
    ...topPairs.concat(bottomPairs).map(function (pair) {
      return Math.abs(pair[0] - pair[1]);
    })
  );

  // set plot height based on the maximum distance
  const plotHeight = max_distance * 8 + 100;
  var svg = d3
    .select("#figure")
    .append("svg")
    .attr("width", topSeq.length * letterSpacing * 3)
    .attr("height", plotHeight);

  // offsets for plot
  var xOffset = 0;
  var yOffset = plotHeight / 2;

  function createPlot(seq, pairs, top) {
    const seqID = top ? "SequenceTop" : "SequenceBottom";

    svg
      .append("text")
      .attr("x", xOffset)
      .attr("y", yOffset)
      .text(seq)
      .attr("id", seqID)
      .style("letter-spacing", letterSpacing.toString() + "px")
      .style("font-family", "monospace")
      .style("font-size", fontSize.toString() + "px");

    // find width of the text in pixels using
    const textWidth = document
      .getElementById(seqID)
      .getBoundingClientRect().width;
    const stepWidth = textWidth / seq.length / 2;

    pairs.forEach(function (pair) {
      const x_start = xOffset + (2 * pair[0] + 1) * stepWidth;
      const x_end = xOffset + (2 * pair[1] + 1) * stepWidth;

      const arc = d3.path();
      const radius = Math.abs(x_end - x_start) / 2;

      arc.moveTo(x_start, yOffset + (top ? -12 : 2));
      arc.quadraticCurveTo(
        x_start + radius,
        yOffset + (top ? -radius : radius),
        x_end,
        yOffset + (top ? -12 : 2)
      );

      // add padding to the arc
      svg
        .append("path")
        .attr("d", arc.toString())
        .attr("stroke", arcColor)
        .attr("stroke-width", 3)
        .attr("fill", "none")
        .attr("id", pair[0] + "-" + pair[1])
        .attr("class", top ? "top-arc" : "bottom-arc")
        .style("margin", "10px");
    });
  }

  createPlot(topSeq, topPairs, true);
  yOffset += fontSize * 1.2;
  createPlot(bottomSeq, bottomPairs, false);

  // change arc color on hover
  d3.selectAll("path").on("mouseover", function () {
    d3.select(this).style("stroke", mouseoverColor);

    const inputString = this.classList.contains("top-arc") ? topSeq : bottomSeq;
    const indices = this.id.split("-");
    const distance = Math.abs(indices[0] - indices[1]);
    const pair = inputString[indices[0]] + inputString[indices[1]];

    // create a tooltip div
    const tooltip = document.createElement("div");

    tooltip.setAttribute("class", "tooltip");
    tooltip.innerHTML =
      pair + ", " + "d=" + distance + ", " + "[" + indices + "]";
    document.body.appendChild(tooltip);

    // add event listener to the tooltip to move it with the mouse
    this.addEventListener("mousemove", mouseMoveTooltip);
    // change the cursor to pointer
    this.style.cursor = "pointer";
  });

  // change arc color on mouse out and remove tooltip
  d3.selectAll("path").on("mouseout", function () {
    d3.select(this).style("stroke", arcColor);
    this.removeEventListener("mousemove", mouseMoveTooltip);
    document.body.removeChild(document.getElementsByClassName("tooltip")[0]);
  });
}
