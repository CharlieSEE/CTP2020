// import { Chart } from "chart.js";
import { saveAs } from "file-saver";
const csvForm = document.getElementById("csvForm");
const csvFileInput = document.getElementById("csvFile");
const drawChartButton = document.getElementById("draw");
const canvasContainer = document.getElementById("canvasConatiner");

let labelArr = [];
let xArr = [];
let yArr = [];

/**
 * Utility funcion that swaps commas for dots in desired string
 * @param {String} string
 * @returns original string with swapped commas to dots
 */
const swapCommaToDot = (string) => {
  const stringArray = string.split("");
  const commaIndex = stringArray.findIndex((el) => el === ",");
  if (commaIndex === -1) return string;
  stringArray[commaIndex] = ".";
  return stringArray.join("");
};

// TODO SIM draw
/**
 * Function draws chart to screen
 */
const drawChart = () => {
  canvasContainer.innerHTML = "";
  const canvas = document.createElement("canvas");
  canvas.style.width = "90vw";
  canvas.style.height = "50vh";
  canvasContainer.appendChild(canvas);
  createChart(canvas, labelArr, xArr);
};

drawChartButton.addEventListener("click", drawChart, false);

csvForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const csvFile = csvFileInput.files[0];
  const csvReader = new FileReader();
  csvReader.onload = (e) => {
    const data = e.target.result.trim();
    const [labelValuesArr, xValuesArr, yValuesArr] = convertCsv(data);
    labelArr = labelValuesArr;
    xArr = xValuesArr;
    yArr = yValuesArr;
  };
  csvReader.readAsText(csvFile);
});

/**
 *  Function converts csv data in string form to 3 seprate arrays
 * @param {String} csvData String containing CSV data
 * @returns Three arrays conaning label, x, y values
 */
const convertCsv = (csvData) => {
  const labelValuesArr = [];
  const xValuesArr = [];
  const yValuesArr = [];
  const rows = csvData.split("\n");
  for (let row of rows) {
    const [label, xValue, yValue] = row.trim().split(/\s+/g);
    labelValuesArr.push(parseFloat(swapCommaToDot(label)));
    xValuesArr.push(parseFloat(swapCommaToDot(xValue)));
    yValuesArr.push(parseFloat(swapCommaToDot(yValue)));
  }
  // Remove shit show from first row
  labelValuesArr.shift();
  xValuesArr.shift();
  yValuesArr.shift();
  return [labelValuesArr, xValuesArr, yValuesArr];
};

/**
 * Create chart from chart.js library
 * @param {HTMLElement} canvas
 * @param {Array} labels Array containing values for labels on X axis
 * @param {Array} data Array of points to be placed on chart
 */
const createChart = (canvas, labels, data) => {
  const ctx = canvas.getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels.map((value) => value.toFixed(3)),
      datasets: [
        {
          label: "X",
          data: data,
          backgroundColor: "rgb(75, 192, 192)",
          spanGaps: true,
          borderColor: "rgb(75, 192, 192)",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
        // x: {
        //   ticks: {
        //     callback: function (value) {
        //       console.log(value);
        //       return value.toFixed(3);
        //     },
        //   },
        // },
      },
      // Optimization of chart drawing
      normalized: true,
      animation: false,
      responsive: false,
      // Disable points drawing
      datasets: {
        line: {
          pointRadius: 0,
        },
      },
      elements: {
        point: {
          radius: 0,
        },
      },
    },
  });
};

const saveToFile = () => {
  let data = "T[s]  Ux[V] Uy[V]\n";
  for (let i = 0; i < labelArr.length; i++) {
    console.log(i);
    data += `${labelArr[i]} ${xArr[i]}  ${yArr[i]}\n`;
  }
  const blob = new Blob([data], {
    type: "text/csv;charset=utf-8",
  });
  saveAs(blob, "dane.csv");
};

document.getElementById("save").addEventListener("click", saveToFile);
