// print current url

let pageName = window.location.href.split("/").pop();

const LS_SAMPLES = [
  ">tdbD00005111.dotbracket\nGCCGUGAUAGCUCAGUUGGGAGAGCGUCAGACUGAAGAUCUGAAGGUCCCUGGUUCGAUCCCUGGUCACGGCA\n>tdbD00001770.dotbracket\nGUCAGGAUGGCCGAGUGGUCUAAGGCGCUGCGUUCAGGUCGCAGUCUACUCUGUAGGCGUGGGUUCGAAUCCCACUUCUGACA",
  ">seq1\nGUUCCCGUCUAUUGCAAGACACCAGUUACUGAAUGUGUUCUGUUGGAAAGAGAACAUAUUGAAGUAAUAAUGAACUGCAAAC\n>seq2\nGCUGUCUGGCGCGGGCGGGAGUCGUCCUUGGUGGCCUUCCGUAGGGGAGGCUUCCGGGUCGUUGAAUGCGGCGUACCGCUUC",
  ">seq1\nGUUCCCGUCUAUUGCAAGACACCAGU\n>seq2\nGCUGUCUGGCGCGGGCGGGAGUCGU",
  ">B00650 118\nGCCUGGUGGCUAUGGCGAGGAGGCCUAACCCGAUCCCAUCCCGAACUCGGCCGUUAAACUCCUCAGUGCCGAUGGUACUAUGUCUUAAGACCUGGGAGAGUAGGUCGUCGCCAGGCCU\n>B01704 115\nCCUGGCGGCGAUAGUGCGGUGGACCCACCUGAGACCAUACCGAACUCAGAAGUGAAACGCUGUAAUGCCGAUGGUAGUGUGGGGUUUCCCCAUGUGAGAGUAGGGCACCGCCGGG",
];

const pageElement = document.getElementById(pageName);
// check is page exist
if (pageElement) {
  // add class active to page
  pageElement.classList.add("active");
} else {
  // add class active to home page
  document.getElementById("linearfold").classList.add("active");
}

// if page is linearsankoff
if (pageName == "linearsankoff") {
  document.getElementById("footer").classList.add("disabled");
}

// check if page containes an id 'result'
if (document.getElementById("result-page")) {
  // disable id cluster map
  document.getElementById("footer").classList.add("disabled");
}

function loadLinearSankoffSample(index) {
  if (index < LS_SAMPLES.length) {
    document.getElementById("seqInput").value = LS_SAMPLES[index];
  } else {
    document.getElementById("seqInput").value = index;
  }
}

function fileUploadListener() {
  const fileUpload = document.getElementById("SeqFile");
  const fileContents = document.getElementById("seqInput");

  if (fileUpload) {
    fileUpload.addEventListener("change", function () {
      const file = fileUpload.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", function () {
        if (fileContents) {
          fileContents.value = reader.result;
        }
      });
      reader.readAsText(file);
    });
  }
}
