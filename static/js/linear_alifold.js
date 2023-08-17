// // Sample data
// const consensusSecondaryStructure = "((((...)))...((((...))))...((((...))))...((((...))))...((((...))))...)";
// const alignedSequences = [
//   "AGCUAUGCAUGCUAAGCUAUGCAUGCUAAGCUAUGCAUGCUAAGCUAUGCAUGCUAAGCUAUGCAUGCUA",
//   "AGCUAUG--UGCUAAGCUAUG--UGCUAAGCUAUG--UGCUAAGCUAUG--UGCUAAGCUAUG--UGCUA",
//   "AGCUAUGCAUGCUAAGCUAUGCAUGCUAAGCUAUGCAUGCUAAGCUAUGCAUGCUAAGCUAUGCAUGCUA",
//   "AGCUAUGCAU--UAAGCUAUGCAU--UAAGCUAUGCAU--UAAGCUAUGCAU--UAAGCUAUGCAU--UA",
// ];

// // Sample sequence names
// const sequenceNames = ["SAq1", "QQeq2", "Deq3", "SFq4"];

// pop last element of consesnsusSecondaryStructure
consensusSecondaryStructure = consensusSecondaryStructure.slice(0, -1);

// Container for sequences and secondary structure
const sequencesContainer = document.getElementById("sequences");
const sequenceCheckboxesContainer = document.getElementById("sequenceCheckboxes");
// Update the allRows variable after rendering sequences
const allRows = document.querySelectorAll(".sequence-row");
const widthAdjuster = document.getElementById("widthAdjuster");

const startInput = document.getElementById("start");
const endInput = document.getElementById("end");
const applyRangeBtn = document.getElementById("applyRange");
const resetRangeBtn = document.getElementById("resetRange");

const charWidth = 15; /* Estimate of width per character, including margins */

// mouse pos
var mouseX;
var mouseY;

// Select Sequences buttons
const selectAllButton = document.getElementById("selectAll");
const deselectAllButton = document.getElementById("deselectAll");

// Highlight and tooltip properties
const tooltip = document.getElementById("tooltip");
const tooltipSampleText =
  "(Sample Tooltip Text)<br>Index: i<br>Pair: (x, y)<br>Distance: d<br><br>Nucleotide Statistics<br>20% A<br>20% C<br>20% G<br>20% U<br>20% -<br><br>Pair Statistics<br>10% GC<br>15% CG<br>20% AU<br>15% UA<br>10% GU<br>10% UG<br>10% --<br> 5% X- or -X<br> 5% unpairable";
const highlightColor = "#f0ad4e";
const tooltipXOffsetSlider = document.getElementById("tooltipXOffset");
const tooltipYOffsetSlider = document.getElementById("tooltipYOffset");
var highlightTooltipOffsetX;
var highlightTooltipOffsetY;

// Function to compute bracket pairs
function computeBracketPairs(sequence) {
  const stack = [];
  const pairs = {};

  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i] === "(") {
      stack.push(i);
    } else if (sequence[i] === ")") {
      const startIndex = stack.pop();
      if (startIndex !== undefined) {
        pairs[startIndex] = i;
        pairs[i] = startIndex;
      }
    }
  }

  return pairs;
}

// Compute the bracket pairs once for the consensus sequence
const bracketPairs = computeBracketPairs(consensusSecondaryStructure);

function adjustSequenceVisibility() {
  const checkboxes = sequenceCheckboxesContainer.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach((checkbox) => {
    const sequenceName = checkbox.id;
    const correspondingRows = document.querySelectorAll(`.sequence-row[data-name='${sequenceName}']`);

    correspondingRows.forEach((row) => {
      row.style.display = checkbox.checked ? "flex" : "none";
    });
  });
}

// ---------------------------------------------------------------

function createRow(sequence, name = null, chunkNum = 0, indexStart = 1, indexEnd = sequence.length) {
  const rowDiv = document.createElement("div");
  rowDiv.className = "sequence-row";
  rowDiv.setAttribute("data-chunk", chunkNum);

  // If name is provided, prepend it to the row
  if (name) {
    const nameDiv = document.createElement("div");
    nameDiv.className = "sequence-name"; // Class for styling
    nameDiv.textContent = `${name} (columns ${indexStart}-${indexEnd})`; // Show indices
    rowDiv.appendChild(nameDiv);
    rowDiv.setAttribute("data-name", name);
  }

  [...sequence].forEach((char, index) => {
    const charDiv = document.createElement("div");
    charDiv.className = "sequence-column";
    charDiv.textContent = char;
    charDiv.setAttribute("sequence-index", indexStart + index); // Assigning the global position
    rowDiv.appendChild(charDiv);
  });
  sequencesContainer.appendChild(rowDiv);
}

function _renderSequencesHelper(chunkSize, rangeStart = 0, rangeEnd = consensusSecondaryStructure.length) {
  // Clear existing sequences
  sequencesContainer.innerHTML = "";

  const numChunks = Math.ceil((rangeEnd - rangeStart) / chunkSize);

  for (let chunk = 0; chunk < numChunks; chunk++) {
    let startIdx = chunk * chunkSize + rangeStart;
    let endIdx = Math.min(startIdx + chunkSize, rangeEnd);

    // Display consensus secondary structure for the current chunk
    let partialConsensus = consensusSecondaryStructure.slice(startIdx, endIdx);
    createRow(partialConsensus, "Consensus Structure", chunk, startIdx + 1, endIdx);

    for (let i = 0; i < alignedSequences.length; i++) {
      let partialSequence = alignedSequences[i].slice(startIdx, endIdx);
      createRow(partialSequence, sequenceNames[i], chunk, startIdx + 1, endIdx);
    }

    // Add a spacer div after each chunk of sequences, except after the last chunk.
    if (chunk < numChunks - 1) {
      const spacerDiv = document.createElement("div");
      spacerDiv.className = "sequence-chunk-spacer";
      sequencesContainer.appendChild(spacerDiv);
    }
  }
}

function updateSequencesDisplay() {
  const newWidth = (sequencesContainer.clientWidth / 1000) * widthAdjuster.value;

  // available width is the width of the container minus the width of the name column
  const availableWidth = sequencesContainer.clientWidth - newWidth;
  const chunkSize = Math.floor(availableWidth / charWidth);

  // Get current range values
  const startIndex = parseInt(startInput.value) - 1;
  const endIndex = parseInt(endInput.value);

  //   Re-render the sequences based on the new chunk size and current range
  if (!isNaN(startIndex) && !isNaN(endIndex) && startIndex < endIndex) {
    _renderSequencesHelper(chunkSize, startIndex, endIndex);
  } else {
    _renderSequencesHelper(chunkSize);
  }

  document.querySelectorAll(".sequence-name").forEach((div) => {
    div.style.setProperty("width", newWidth + "px");
  });

  adjustSequenceVisibility();
}

// ----------------------------------------------------- Hover Tooltip and Highlighting of Columns -----------------------------------------------------

function getColumnStatistics(index) {
  const allNucs = ["A", "C", "G", "U", "-"];
  const columns = Array.from(document.querySelectorAll(`.sequence-column[sequence-index='${index + 1}']`)).slice(1); // Excluding consensus structure
  const counts = {};

  columns.forEach((col) => {
    const char = col.textContent.trim();
    counts[char] = counts[char] ? counts[char] + 1 : 1;
  });

  let percentageStats = "Nucleotide Statistics:<br>";
  const total = columns.length;
  const percentArray = [];
  var maxPercentLength = 0;

  allNucs.forEach((key) => {
    if (counts[key] === undefined) counts[key] = 0;
    var numPercent = ((counts[key] / total) * 100).toFixed(1);
    // if (numPercent.endsWith(".0")) numPercent = numPercent.slice(0, -2); // Remove trailing .0
    maxPercentLength = Math.max(maxPercentLength, numPercent.length);
    percentArray.push(numPercent);
  });

  allNucs.forEach((key, index) => {
    var numPercent = percentArray[index];
    if (numPercent === "0.0") return;
    // If numPercent length is less than maxPercentLength, add spaces to the beginning
    if (numPercent.length < maxPercentLength) numPercent = "&nbsp".repeat(maxPercentLength - numPercent.length) + numPercent;
    percentageStats += `${numPercent}%&nbsp${key}<br>`;
  });

  return percentageStats;
}

function getPairStatistics(index1, index2) {
  if (index2 < index1) return getPairStatistics(index2, index1);
  const allPairsArray = ["GC", "CG", "AU", "UA", "GU", "UG", "--", "X- or -X", "unpairable"];
  const allPairsSet = new Set(allPairsArray.slice(0, -2));
  const columns1 = Array.from(document.querySelectorAll(`.sequence-column[sequence-index='${index1 + 1}']`)).slice(1);
  const columns2 = Array.from(document.querySelectorAll(`.sequence-column[sequence-index='${index2 + 1}']`)).slice(1);
  const counts = {};

  columns1.forEach((col, idx) => {
    const char1 = col.textContent.trim();
    const char2 = columns2[idx].textContent.trim();

    var pair = `${char1}${char2}`;
    if (pair !== "--" && (char1 === "-" || char2 === "-")) pair = "X- or -X"; // gap-nuc or nuc-gap pair
    else if (!allPairsSet.has(pair)) pair = "unpairable"; // not a valid pair, eg: AC

    counts[pair] = counts[pair] ? counts[pair] + 1 : 1;
  });

  let percentageStats = "Pair Statistics:<br>";
  const total = columns1.length;
  const percentArray = [];
  var maxPercentLength = 0;

  allPairsArray.forEach((pair) => {
    if (counts[pair] === undefined) counts[pair] = 0;
    var numPercent = ((counts[pair] / total) * 100).toFixed(1);
    // if (numPercent.endsWith(".0")) numPercent = numPercent.slice(0, -2); // Remove trailing .0
    maxPercentLength = Math.max(maxPercentLength, numPercent.length);
    percentArray.push(numPercent);
  });

  allPairsArray.forEach((pair, index) => {
    var numPercent = percentArray[index];
    if (numPercent === "0.0") return;
    // If numPercent length is less than maxPercentLength, add spaces to the beginning
    if (numPercent.length < maxPercentLength) numPercent = "&nbsp".repeat(maxPercentLength - numPercent.length) + numPercent;
    percentageStats += `${numPercent}%&nbsp${pair}<br>`;
  });

  return percentageStats;
}

function updateTooltipPosition() {
  tooltip.style.left = mouseX + highlightTooltipOffsetX + "px";
  tooltip.style.top = mouseY + highlightTooltipOffsetY + "px";
}

function attachHighlighting() {
  sequencesContainer.addEventListener("mouseover", function (event) {
    if (event.target.classList.contains("sequence-column")) {
      const pairIndex1 = parseInt(event.target.getAttribute("sequence-index")) - 1;
      const pairIndex2 = bracketPairs[pairIndex1];

      document.querySelectorAll(`.sequence-column[sequence-index='${pairIndex1 + 1}']`).forEach((col) => {
        col.style.backgroundColor = highlightColor;
      });

      if (pairIndex2 !== undefined) {
        document.querySelectorAll(`.sequence-column[sequence-index='${pairIndex2 + 1}']`).forEach((col) => {
          col.style.backgroundColor = highlightColor;
        });
      }

      let columnStat = getColumnStatistics(pairIndex1);
      let pairStat = pairIndex2 !== undefined ? getPairStatistics(pairIndex1, pairIndex2) : "";

      tooltip.style.display = "block";
      tooltip.innerHTML = `Index: ${pairIndex1 + 1}<br>`;
      tooltip.innerHTML +=
        pairIndex2 !== undefined
          ? `Pair: (${Math.min(pairIndex1, pairIndex2) + 1}, ${Math.max(pairIndex1, pairIndex2) + 1})<br>Distance: ${Math.abs(
              pairIndex1 - pairIndex2
            )}<br><br>${columnStat}<br>${pairStat}`
          : `<br>${columnStat}`;
    }
  });
}

// ---------------------------------------------------------------Initial Setup ---------------------------------------------------------------
startInput.value = 1;
endInput.value = consensusSecondaryStructure.length;

// Iterate aligned sequences and convert to uppercase
for (let i = 0; i < alignedSequences.length; i++) {
  alignedSequences[i] = alignedSequences[i].toUpperCase();
}

sequenceNames.forEach((name, index) => {
  name = `${index + 1}. ${sequenceNames[index]}`;
  sequenceNames[index] = name;

  let li = document.createElement("li");
  let wrapper = document.createElement("div");
  wrapper.className = "form-check";

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = name;
  checkbox.className = "form-check-input";
  checkbox.checked = true; // By default, all sequences are displayed

  let label = document.createElement("label");
  label.htmlFor = name;
  label.textContent = name;
  label.className = "form-check-label";

  wrapper.appendChild(checkbox);
  wrapper.appendChild(label);
  li.appendChild(wrapper);
  sequenceCheckboxesContainer.appendChild(li);
});

highlightTooltipOffsetX = parseInt(tooltipXOffsetSlider.value);
highlightTooltipOffsetY = parseInt(tooltipYOffsetSlider.value);

_renderSequencesHelper(consensusSecondaryStructure.length);
updateSequencesDisplay();
attachHighlighting();

// --------------------------------------------------------------- Event listeners ---------------------------------------------------------------

document.addEventListener("mousemove", function (e) {
  // Get the page's scroll position
  var scrollX = window.scrollX || document.documentElement.scrollLeft;
  var scrollY = window.scrollY || document.documentElement.scrollTop;

  // Calculate the mouse's absolute X and Y positions on the page
  mouseX = e.clientX + scrollX;
  mouseY = e.clientY + scrollY;
});

widthAdjuster.addEventListener("input", updateSequencesDisplay);

tooltipXOffsetSlider.addEventListener("input", function () {
  highlightTooltipOffsetX = parseInt(this.value);
  tooltip.style.display = "block";
  tooltip.innerHTML = "X Offset: " + this.value;
  tooltip.innerHTML += "<br>" + tooltipSampleText + "<br>";
  updateTooltipPosition();
});

tooltipYOffsetSlider.addEventListener("input", function () {
  highlightTooltipOffsetY = parseInt(this.value);
  tooltip.style.display = "block";
  tooltip.innerHTML = "Y Offset: " + this.value;
  tooltip.innerHTML += "<br>" + tooltipSampleText + "<br>";
  updateTooltipPosition();
});

tooltipXOffsetSlider.addEventListener("mouseout", function () {
  tooltip.style.display = "none";
});

tooltipYOffsetSlider.addEventListener("mouseout", function () {
  tooltip.style.display = "none";
});

sequencesContainer.addEventListener("mousemove", function () {
  updateTooltipPosition();
});

sequencesContainer.addEventListener("mouseout", function (event) {
  if (event.target.classList.contains("sequence-column")) {
    const allColumns = document.querySelectorAll(".sequence-column");
    allColumns.forEach((col) => {
      col.style.backgroundColor = "";
      col.removeAttribute("title");
    });
  }
  tooltip.style.display = "none";
});

// --------------------------------------------------------------- Sequence Search and Visibility Event Listner ---------------------------------------------------------------

document.getElementById("searchSequence").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const checkboxes = document.querySelectorAll("#sequenceCheckboxes li:not(:first-child)");

  checkboxes.forEach((li) => {
    const sequenceName = li.textContent.toLowerCase();
    if (sequenceName.includes(query)) {
      li.style.display = "";
    } else {
      li.style.display = "none";
    }
  });
});

sequenceCheckboxesContainer.addEventListener("change", function (e) {
  const targetCheckbox = e.target;

  if (targetCheckbox.type !== "checkbox") return;

  adjustSequenceVisibility();
});

selectAllButton.addEventListener("click", function () {
  const checkboxes = sequenceCheckboxesContainer.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach((checkbox) => (checkbox.checked = true));
  adjustSequenceVisibility();
});

deselectAllButton.addEventListener("click", function () {
  const checkboxes = sequenceCheckboxesContainer.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach((checkbox) => (checkbox.checked = false));
  adjustSequenceVisibility();
});

// --------------------------------------------------------------- Range Button Event Listners ---------------------------------------------------------------

applyRangeBtn.addEventListener("click", function () {
  var startIndex = parseInt(startInput.value) - 1;
  var endIndex = parseInt(endInput.value);

  if (isNaN(startIndex) || isNaN(endIndex)) {
    alert("Please enter valid start and end indices.");
    return;
  }

  if (startIndex < 1) {
    startIndex = 1;
    startInput.value = startIndex;
  }

  if (endIndex > consensusSecondaryStructure.length) {
    endIndex = consensusSecondaryStructure.length;
    endInput.value = endIndex;
  }

  if (startIndex >= endIndex) {
    alert("Start index must be less than end index.");
    return;
  }

  updateSequencesDisplay();
});

resetRangeBtn.addEventListener("click", function () {
  startInput.value = 1;
  endInput.value = consensusSecondaryStructure.length;
  updateSequencesDisplay();
});
