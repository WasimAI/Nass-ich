const resultDiv = document.getElementById("analysis-result");
const logList = document.getElementById("log-list");

async function analyzeImages() {
  const input = document.getElementById("image-upload");
  if (!input.files.length) {
    resultDiv.textContent = "الرجاء تحميل صورة واحدة على الأقل.";
    return;
  }

  resultDiv.textContent = "جاري التحليل...";
  let finalText = "";

  for (const file of input.files) {
    const image = URL.createObjectURL(file);
    try {
      const { data: { text } } = await Tesseract.recognize(image, 'eng');
      finalText += `\n--- تحليل صورة ---\n${text.trim()}\n`;
    } catch (err) {
      finalText += `\n--- فشل تحليل الصورة ---\n`;
    }
  }

  resultDiv.textContent = finalText;
  saveToLog(finalText);
}

function saveToLog(text) {
  const now = new Date();
  const li = document.createElement("li");
  li.textContent = `${now.toLocaleString()} -\n${text.substring(0, 100)}...`;
  logList.appendChild(li);

  const logs = JSON.parse(localStorage.getItem("golden_logs") || "[]");
  logs.push({ date: now.toISOString(), text });
  localStorage.setItem("golden_logs", JSON.stringify(logs));
}

window.onload = () => {
  const logs = JSON.parse(localStorage.getItem("golden_logs") || "[]");
  logs.forEach(log => {
    const li = document.createElement("li");
    li.textContent = `${new Date(log.date).toLocaleString()} -\n${log.text.substring(0, 100)}...`;
    logList.appendChild(li);
  });
};
