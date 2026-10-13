# LeetCode AI Helper 🚀

**LeetCode AI Helper** is a lightweight, privacy-focused Chrome Extension (Manifest V3) that provides an intelligent **DSA Mentor** directly on LeetCode problem pages, powered by **Google Gemini 1.5 Flash**.

Instead of switching back and forth between LeetCode and external chatbots, you can get progressive hints, data structure suggestions, and complexity insights right next to the code editor—without spoiling the final answer!

---

## ✨ Features

* **In-Page AI Assistant**: Sleek, non-intrusive floating button and dark-themed chat widget integrated directly into LeetCode.
* **Dynamic Problem Scraping**: Automatically and safely extracts the problem title, difficulty level, and description from LeetCode's dynamic SPA layout.
* **Socratic DSA Mentoring**: Powered by Google Gemini with tailored prompt engineering to guide you progressively (intuition ➔ pattern ➔ data structure ➔ edge cases) rather than spitting out complete code.
* **Quick Hint Chips**: One-click prompt chips for:
  * 💡 General Conceptual Hint
  * 🧩 Pattern / Data Structure Suggestions
  * ⚠️ Tricky Edge Cases to Watch Out For
  * ⏱️ Time & Space Complexity Targets
* **Multi-Turn Conversation**: Retains chat history for contextual follow-up questions.
* **Bring-Your-Own-Key (BYOK) Security**: Your Gemini API key is stored safely in your browser's `chrome.storage.local`. It is **never** sent to any third-party server or committed to source control.
* **100% Free**: Uses Google AI Studio's free tier for Gemini 1.5 Flash (15 RPM / 1,500 RPD).

---

## 🛠️ Built With

* **JavaScript (ES6+)** - Async/Await, DOM manipulation, Gemini REST API
* **Chrome Extension Manifest V3** - Content scripts, popup, message passing, Chrome Storage API
* **Google Gemini 1.5 Flash API** - High-speed, free reasoning engine
* **CSS3** - Responsive glass-inspired dark mode UI

---

## 📂 Project Structure

```text
leetcode-ai-helper/
│
├── manifest.json     # Chrome Extension MV3 configuration & permissions
├── content.js        # Dynamic DOM scraper, Gemini API client & floating UI
├── popup.html        # Extension action popup
├── popup.js          # Popup tab detector & API key manager
├── styles.css        # Popup interface styling
└── README.md         # Documentation
```

---

## 🔑 Getting Your Free Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey).
2. Sign in with your Google account.
3. Click **"Create API Key"** (no credit card or billing required).
4. Copy your key (starts with `AIzaSy...`).

---

## 📥 Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/AuroraDangelo/leetcode-ai-helper.git
   ```
2. Open Google Chrome and navigate to:
   ```text
   chrome://extensions
   ```
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the `leetcode-ai-healper` folder.
5. Click on the extension icon in your browser toolbar, paste your free Gemini API key, and click **Save**.
6. Navigate to any problem on [LeetCode](https://leetcode.com/problems/two-sum/) and click the **✨ Ask AI** button!

---

## 🔒 Security & Privacy

* **Local Storage Only**: Your API key is stored in your personal browser profile using `chrome.storage.local`.
* **Direct Communication**: Network calls travel directly from your browser to `generativelanguage.googleapis.com` via HTTPS. No middleman servers exist.
