// --- 1. SCRAPE LEETCODE PROBLEM DATA ---
function getProblemData() {
  const urlParts = window.location.pathname.split("/");
  const slug = urlParts[2] || ""; // e.g. "two-sum"

  // Title selector with fallbacks
  const titleEl =
    document.querySelector(`a[href*="/problems/${slug}"]`) ||
    document.querySelector('[data-cy="question-title"]') ||
    document.querySelector("h1");

  // Difficulty selector
  const diffEl = document.querySelector('[class*="text-difficulty"]');

  // Description selector
  const descEl = document.querySelector('[data-track-load="description_content"]');

  return {
    title: titleEl ? titleEl.textContent.trim() : slug,
    difficulty: diffEl ? diffEl.textContent.trim() : "Medium",
    description: descEl ? descEl.innerText.trim() : ""
  };
}

// Escape HTML to display AI text safely
function escapeHtml(text) {
  const div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
}

// --- 2. CREATE FLOATING AI BUTTON ---
const aiButton = document.createElement("button");
aiButton.innerText = "✨ Ask AI";
aiButton.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  padding: 12px 20px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
`;
document.body.appendChild(aiButton);

// --- 3. CREATE CHAT PANEL ---
const aiPanel = document.createElement("div");
aiPanel.style.cssText = `
  position: fixed;
  bottom: 75px;
  right: 20px;
  width: 360px;
  height: 500px;
  background-color: #111827;
  color: white;
  border-radius: 16px;
  padding: 16px;
  z-index: 9999;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  display: none;
  flex-direction: column;
  font-family: sans-serif;
`;

aiPanel.innerHTML = `
  <!-- Header -->
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
    <h3 style="margin: 0; font-size: 16px;">AI LeetCode Mentor</h3>
    <button id="close-ai-panel" style="background:none; border:none; color:#9ca3af; font-size:16px; cursor:pointer;">✕</button>
  </div>

  <!-- Problem Info -->
  <div style="background: #1f2937; padding: 8px 12px; border-radius: 8px; margin-bottom: 12px; font-size: 13px;">
    <strong id="problem-title">Problem Title</strong>
    <span id="problem-difficulty" style="float: right; color: #facc15;">Difficulty</span>
  </div>

  <!-- API Key Setup -->
  <div style="margin-bottom: 12px;">
    <div style="display: flex; gap: 8px;">
      <input
        id="api-key-input"
        type="password"
        placeholder="Enter Gemini API Key"
        style="flex: 1; padding: 8px; border-radius: 6px; border: 1px solid #374151; background: #1f2937; color: white; font-size: 12px;"
      />
      <button id="save-api-key" style="padding: 8px 12px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">
        Save
      </button>
    </div>
    <small style="color: #9ca3af; font-size: 11px;">
      Get free key at <a href="https://aistudio.google.com/apikey" target="_blank" style="color: #60a5fa;">Google AI Studio</a>
    </small>
  </div>

  <!-- Chat Messages -->
  <div
    id="chat-messages"
    style="flex: 1; overflow-y: auto; padding: 10px; background: #1f2937; border-radius: 8px; margin-bottom: 12px; font-size: 13px;"
  >
    <div style="color: #9ca3af;">Ask for a hint without spoiling the solution!</div>
  </div>

  <!-- Input Box -->
  <div style="display: flex; gap: 8px;">
    <input
      id="chat-input"
      placeholder="Ask for a hint..."
      style="flex: 1; padding: 10px; border-radius: 6px; border: 1px solid #374151; background: #1f2937; color: white; font-size: 13px;"
    />
    <button id="send-message" style="padding: 10px 16px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
      Send
    </button>
  </div>
`;
document.body.appendChild(aiPanel);

// --- 4. LOAD & SAVE GEMINI API KEY ---
let apiKey = "";

chrome.storage.local.get(["geminiApiKey"], (result) => {
  if (result.geminiApiKey) {
    apiKey = result.geminiApiKey;
    document.getElementById("api-key-input").value = apiKey;
  }
});

document.getElementById("save-api-key").addEventListener("click", () => {
  apiKey = document.getElementById("api-key-input").value.trim();
  chrome.storage.local.set({ geminiApiKey: apiKey }, () => {
    alert("Gemini API Key Saved!");
  });
});

// --- 5. PANEL TOGGLE ---
aiButton.addEventListener("click", () => {
  const isHidden = aiPanel.style.display === "none";
  aiPanel.style.display = isHidden ? "flex" : "none";

  if (isHidden) {
    const problem = getProblemData();
    document.getElementById("problem-title").textContent = problem.title;
    document.getElementById("problem-difficulty").textContent = problem.difficulty;
  }
});

document.getElementById("close-ai-panel").addEventListener("click", () => {
  aiPanel.style.display = "none";
});

// --- 6. DISPLAY MESSAGES IN CHAT ---
const chatMessages = document.getElementById("chat-messages");

function appendMessage(text, sender, id = "") {
  const msg = document.createElement("div");
  if (id) msg.id = id;

  const isUser = sender === "user";
  msg.style.cssText = `
    display: flex;
    justify-content: ${isUser ? "flex-end" : "flex-start"};
    margin-bottom: 10px;
  `;

  msg.innerHTML = `
    <div style="
      background: ${isUser ? "#2563eb" : "#374151"};
      color: white;
      padding: 8px 12px;
      border-radius: 10px;
      max-width: 85%;
      white-space: pre-wrap;
      line-height: 1.4;
    ">${escapeHtml(text)}</div>
  `;

  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// --- 7. GEMINI AI API CALL ---
async function generateAIHint(userMessage) {
  if (!apiKey) {
    return "Please enter and save your Gemini API Key first above.";
  }

  const problem = getProblemData();

  const prompt = `You are a helpful DSA coding mentor.
The student is solving this LeetCode problem:
Title: ${problem.title} (${problem.difficulty})
Description: ${problem.description}

Student Question: "${userMessage}"

IMPORTANT: Give a helpful progressive hint (intuition, pattern, data structure, or edge case). Do NOT reveal the full solution code unless the student explicitly asks for complete code.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return `Error: ${data.error?.message || "Failed to call Gemini API"}`;
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    return `Network Error: ${error.message}`;
  }
}

// --- 8. SEND MESSAGE HANDLER ---
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-message");

async function handleSendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  chatInput.value = "";
  appendMessage(message, "user");

  // Show loading indicator
  appendMessage("Thinking...", "ai", "loading-msg");

  const hint = await generateAIHint(message);

  // Remove loading indicator & show AI response
  const loading = document.getElementById("loading-msg");
  if (loading) loading.remove();

  appendMessage(hint, "ai");
}

sendButton.addEventListener("click", handleSendMessage);

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSendMessage();
  }
});

// --- 9. LISTEN FOR POPUP REQUESTS ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_PROBLEM_DATA") {
    sendResponse(getProblemData());
  } else if (request.type === "OPEN_PANEL") {
    aiPanel.style.display = "flex";
    const problem = getProblemData();
    document.getElementById("problem-title").textContent = problem.title;
    document.getElementById("problem-difficulty").textContent = problem.difficulty;
    sendResponse({ success: true });
  }
  return true;
});
