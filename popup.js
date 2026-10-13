// LeetCode AI Helper - Popup Script

document.addEventListener("DOMContentLoaded", async () => {
  const probInfoDiv = document.getElementById("problem-info");
  const notLeetcodeDiv = document.getElementById("not-on-leetcode");
  const probTitleEl = document.getElementById("prob-title");
  const probDiffEl = document.getElementById("prob-diff");
  const openPanelBtn = document.getElementById("open-panel-btn");
  const apiKeyInput = document.getElementById("popup-api-key");
  const saveKeyBtn = document.getElementById("save-key-btn");
  const keyBadge = document.getElementById("key-badge");

  // Load existing API key
  const stored = await chrome.storage.local.get(["geminiApiKey", "openaiApiKey"]);
  const existingKey = stored.geminiApiKey || stored.openaiApiKey || "";
  if (existingKey) {
    apiKeyInput.value = existingKey;
    keyBadge.textContent = "Configured";
    keyBadge.className = "key-badge configured";
  } else {
    keyBadge.textContent = "Not set";
    keyBadge.className = "key-badge not-configured";
  }

  // Save key button handler
  saveKeyBtn.addEventListener("click", async () => {
    const key = apiKeyInput.value.trim();
    if (!key) {
      alert("Please enter a valid Gemini API Key.");
      return;
    }
    await chrome.storage.local.set({ geminiApiKey: key });
    keyBadge.textContent = "Saved ✓";
    keyBadge.className = "key-badge configured";
    setTimeout(() => {
      keyBadge.textContent = "Configured";
    }, 2000);
  });

  // Query active tab
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab && tab.url && tab.url.includes("leetcode.com/problems/")) {
      // Send message to content script
      chrome.tabs.sendMessage(tab.id, { type: "GET_PROBLEM_DATA" }, (response) => {
        if (chrome.runtime.lastError || !response) {
          // Content script not loaded yet or page still loading
          probInfoDiv.style.display = "block";
          notLeetcodeDiv.style.display = "none";
          probTitleEl.textContent = "LeetCode Problem Detected";
          probDiffEl.textContent = "Active";
          probDiffEl.className = "prob-diff diff-medium";
        } else {
          probInfoDiv.style.display = "block";
          notLeetcodeDiv.style.display = "none";
          probTitleEl.textContent = response.title || "LeetCode Problem";

          const diff = response.difficulty || "Medium";
          probDiffEl.textContent = diff;
          const diffLower = diff.toLowerCase();
          if (diffLower.includes("easy")) {
            probDiffEl.className = "prob-diff diff-easy";
          } else if (diffLower.includes("hard")) {
            probDiffEl.className = "prob-diff diff-hard";
          } else {
            probDiffEl.className = "prob-diff diff-medium";
          }
        }
      });

      // Handle Open Assistant button
      openPanelBtn.addEventListener("click", () => {
        chrome.tabs.sendMessage(tab.id, { type: "OPEN_PANEL" }, () => {
          window.close(); // Close popup once panel is opened on page
        });
      });
    } else {
      probInfoDiv.style.display = "none";
      notLeetcodeDiv.style.display = "block";
    }
  } catch (err) {
    console.error("Popup initialization error:", err);
    probInfoDiv.style.display = "none";
    notLeetcodeDiv.style.display = "block";
  }
});