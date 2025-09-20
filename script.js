document.getElementById("newsInput").addEventListener("input", () => {
  const input = document.getElementById("newsInput").value;
  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  document.getElementById("wordCount").innerText = `${wordCount}/250 words`;
  if (wordCount > 250) {
    document.getElementById("wordCount").style.color = "red";
  } else {
    document.getElementById("wordCount").style.color = "#666";
  }
});

document.getElementById("submitBtn").addEventListener("click", async () => {
  const input = document.getElementById("newsInput").value.trim();
  const resultDiv = document.getElementById("result");

  if (!input) {
    resultDiv.innerText = "Please enter a statement or URL.";
    return;
  }
  const wordCount = input.split(/\s+/).length;
  if (wordCount > 250) {
    resultDiv.innerText = "Input exceeds 250 words. Please shorten it.";
    return;
  }

  resultDiv.innerHTML = '<span class="spinner"></span> Analyzing...';

  try {
    const response = await fetch("https://oxfcb18s01.execute-api.ap-southeast-1.amazonaws.com/detect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "tiYbk6fnENavq3qwqIM9U5yDHnkNkNnm6zX63OZL"
      },
      body: JSON.stringify({ input })
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    const icons = {
      "True": "✅",
      "Misleading": "⚠️",
      "False": "❌",
      "Opinion/Commentary": "❓",
      "Cannot Determine": "❓"
    };
    resultDiv.innerHTML = `
      <div class="result-card result-${data.verdict.toLowerCase().replace("/", "-")}">
        <p><strong>Classification:</strong> ${icons[data.verdict]} ${data.verdict}</p>
        <p><strong>Explanation:</strong> ${data.explanation || "N/A"}</p>
        ${data.ai_insights?.key_facts ? `<p><strong>Key Facts:</strong> ${data.ai_insights.key_facts.join(", ")}</p>` : ""}
        ${data.ai_insights?.red_flags ? `<p><strong>Red Flags:</strong> ${data.ai_insights.red_flags.join(", ")}</p>` : ""}
        ${data.ai_insights?.confidence ? `<p><strong>Confidence:</strong> ${data.ai_insights.confidence}</p>` : ""}
        <p><strong>ClaimBuster Score:</strong> ${data.claim_score || "N/A"}</p>
        <p><strong>Method:</strong> ${data.method}</p>
        <p><strong>Cost:</strong> ${data.cost}</p>
      </div>
    `;
  } catch (error) {
    resultDiv.innerText = "Error analyzing statement. Please try again.";
    console.error("API Error:", error);
  }
});

document.getElementById("clearBtn").addEventListener("click", () => {
  document.getElementById("newsInput").value = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("wordCount").innerText = "0/250 words";
  document.getElementById("wordCount").style.color = "#666";
});
