const canvas = document.getElementById("eegCanvas");
const ctx = canvas.getContext("2d");

let dataLines = [];
let currentLine = 0;
const refreshRate = 4; // simulate 250Hz (1000ms / 250 = 4ms)

fetch("sample_data.txt")
  .then(response => response.text())
  .then(text => {
    dataLines = text.trim().split("\n").map(line => line.split(',').map(Number));
    startStreaming();
  });

function startStreaming() {
  const channelCount = 20;
  const channelHeight = canvas.height / channelCount;

  setInterval(() => {
    if (currentLine >= dataLines.length) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let ch = 0; ch < channelCount; ch++) {
      ctx.beginPath();
      for (let i = 0; i < 100 && (currentLine + i) < dataLines.length; i++) {
        const x = i * (canvas.width / 100);
        const y = ch * channelHeight + (channelHeight / 2) - dataLines[currentLine + i][ch];
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `hsl(${ch * 18}, 80%, 40%)`;
      ctx.stroke();
    }

    currentLine++;
  }, refreshRate);
}
