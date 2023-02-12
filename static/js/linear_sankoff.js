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
  var resultString = getOutput(id);
  resultString = resultString.replace(/&nbsp;/g, " ");
  resultString = resultString.replace(/<br>/g, "\n");
  navigator.clipboard.writeText(resultString);
}

function mouseMoveTooltip(event) {
  var tooltips = document.getElementsByClassName("tooltip_custom");

  // offset fot the scroll bar
  var offset = window.pageYOffset;

  // set the position of the tooltip
  tooltips[0].style.left = event.clientX - 65 + "px";
  tooltips[0].style.top = event.clientY - 75 + offset + "px";
}

// JavaScript code for generating the figure
function generateInteractivePlot(topSeq, topPairs, bottomSeq, bottomPairs, alignmentSeq) {
  // some variables defining properties of the plot
  const fontSize = 16;
  const letterSpacing = 7;
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

  d3.select("svg").attr("height", plotHeight);
  const svg = d3.select("svg g").attr("id", "interactive-plot");

  // offsets for plot
  var xOffset = 0;
  var yOffset = plotHeight / 2;

  function createPlot(seq, pairs, top) {
    for (var i = 0; i < seq.length; i++) {
      const x = xOffset + (2 * i + 1) * letterSpacing;
      const y = yOffset + (top ? -0.1 : 0.1);

      svg
        .append("text")
        .attr("x", x)
        .attr("y", y)
        .text(seq[i])
        .style("font-family", "monospace")
        .style("font-size", fontSize.toString() + "px")
        .attr("id", i.toString())
        .attr("class", top ? "top" : "bottom")
        .on("mouseover", function () {
          d3.select(this).style("fill", mouseoverColor);
        })
        .on("mouseout", function () {
          d3.select(this).style("fill", "black");
        });
    }

    const textWidth = xOffset + (2 * seq.length + 1) * letterSpacing;
    const stepWidth = textWidth / seq.length / 2;

    pairs.forEach(function (pair) {
      const x_start = stepWidth * (0.5 + xOffset + (2 * pair[0] + 1));
      const x_end = xOffset + (2 * pair[1] + 1) * stepWidth;

      const arc = d3.path();
      const radius = Math.abs(x_end - x_start) / 2;
      const yHeight = radius / 1.4;
      const yPadding = top ? -14 : 4;

      arc.moveTo(x_start, yOffset + (top ? -14 : 4));
      arc.bezierCurveTo(
        x_start + radius / 8,
        yOffset + (top ? -yHeight : yHeight),
        x_end - radius / 8,
        yOffset + (top ? -yHeight : yHeight),
        x_end,
        yOffset + yPadding
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
  // create the alignment sequence

  for (var i = 0; i < alignmentSeq.length; i++) {
    const x = xOffset + (2 * i + 1) * letterSpacing;
    const y = yOffset + 0.1;
    svg
      .append("text")
      .attr("x", x)
      .attr("y", y)
      .text(alignmentSeq[i])
      .style("font-family", "monospace")
      .style("font-size", fontSize.toString() + "px")
      .attr("id", i.toString())
      .attr("class", "alignment");
  }
  yOffset += fontSize * 1.2;

  createPlot(bottomSeq, bottomPairs, false);

  function colorChange(id) {
    document.querySelectorAll(`[id='${id}']`).forEach(function (arc) {
      const indices = id.split("-");
      function changeIDColor(id, color) {
        document.querySelectorAll(`[id='${id}']`).forEach(function (letter) {
          letter.style.fill = color;
        });
      }
      if (arc.style.stroke == mouseoverColor) {
        arc.style.stroke = arcColor;
        changeIDColor(indices[0], "black");
        changeIDColor(indices[1], "black");
      } else {
        arc.style.stroke = mouseoverColor;
        changeIDColor(indices[0], mouseoverColor);
        changeIDColor(indices[1], mouseoverColor);
      }
    });
  }

  // change arc color on hover
  d3.selectAll("path").on("mouseover", function () {
    colorChange(this.id);

    const indices = this.id.split("-");
    const distance = Math.abs(indices[0] - indices[1]);
    const topPairs = topSeq[indices[0]] + topSeq[indices[1]];
    const bottomPairs = bottomSeq[indices[0]] + bottomSeq[indices[1]];

    // create a tooltip div
    const tooltip = document.createElement("div");

    tooltip.setAttribute("class", "tooltip_custom");
    tooltip.innerHTML = "[" + topPairs + "," + bottomPairs + "]" + ", " + "d=" + distance + ", " + "[" + indices + "]";
    document.body.appendChild(tooltip);

    // add event listener to the tooltip to move it with the mouse
    this.addEventListener("mousemove", mouseMoveTooltip);
    // change the cursor to pointer
    this.style.cursor = "pointer";
  });

  // change arc color on mouse out and remove tooltip
  d3.selectAll("path").on("mouseout", function () {
    // select the arcs and change the color back to the original
    colorChange(this.id);
    this.removeEventListener("mousemove", mouseMoveTooltip);
    document.body.removeChild(document.getElementsByClassName("tooltip_custom")[0]);
  });

  // call zoom and disable mouse wheel zoom
  d3.select("svg").call(zoom).on("wheel.zoom", null);
}

const zoom = d3.zoom().on("zoom", function (event) {
  d3.select("svg g").attr("transform", event.transform);
});

function zoomIn() {
  d3.select("svg").transition().call(zoom.scaleBy, 2);
}

function zoomOut() {
  d3.select("svg").transition().call(zoom.scaleBy, 0.5);
}

function resetZoom() {
  d3.select("svg").transition().call(zoom.scaleTo, 1);
}

function center() {
  width = document.querySelector("svg").getBoundingClientRect().width;
  height = document.querySelector("svg").getBoundingClientRect().height;

  // get width of svg g element
  d3.select("svg")
    .transition()
    .call(zoom.translateTo, width / 2, height / 2);
}

function panLeft() {
  d3.select("svg").transition().call(zoom.translateBy, -50, 0);
}

function panRight() {
  d3.select("svg").transition().call(zoom.translateBy, 50, 0);
}

function highlightPairs(insertedPairs, seqPairs, topSeq) {
  insertedPairs.forEach(function (pair) {
    const className = topSeq ? "top-arc" : "bottom-arc";

    let elementsWithClass = document.getElementsByClassName(topSeq ? "top-arc" : "bottom-arc");
    for (let i = 0; i < elementsWithClass.length; i++) {
      let element = elementsWithClass[i];
      if (element.id === `${pair[0]}-${pair[1]}`) {
        element.style.fill = "orange";
        break;
      }
    }
  });
}
