# LeetCode AI Helper

LeetCode AI Helper is a Chrome extension built to make solving LeetCode problems more interactive. Instead of repeatedly switching between LeetCode and an AI chatbot for hints, the extension provides a floating AI assistant directly on the problem page.

It automatically extracts the problem title, difficulty, and description, then analyzes the problem to generate context-aware hints without revealing the complete solution. The project is currently powered by a rule-based hint engine and has been designed so that it can be upgraded to use Large Language Models (LLMs) like Gemini or OpenAI in the future.

---

## Features

* Floating AI Assistant integrated directly into LeetCode
* Automatically extracts problem details from the page

  * Problem title
  * Difficulty
  * Description
* Interactive chat-style interface
* Context-aware hint generation based on the problem statement
* Chrome Storage API support for securely saving an API key
* Architecture prepared for future Gemini/OpenAI integration

---

## 🛠️ Built With

* JavaScript (ES6)
* HTML
* CSS
* Chrome Extension Manifest V3
* Chrome Storage API

---

## Project Structure

```text
leetcode-ai-helper/
│
├── content.js        # Main extension logic
├── manifest.json     # Chrome extension configuration
├── popup.html
├── popup.js
├── styles.css
└── README.md
```

---

## How It Works

1. Open any LeetCode problem.
2. Click the **Ask AI** button.
3. The extension extracts the problem title, difficulty, and description.
4. A built-in hint engine analyzes the problem statement.
5. A relevant hint is displayed inside the assistant without revealing the complete solution.

The goal is to guide the user toward the solution rather than directly providing the answer.

---

## Hint Generation

Instead of using a fixed response for every question, the extension analyzes the problem description to identify common problem categories such as:

* Arrays
* Strings
* Binary Search
* Linked Lists
* Trees
* Graphs
* Dynamic Programming
* Matrices
* Hash Maps

Based on the detected category, it generates a hint that helps the user think about the right approach.

---

## API Key Support

The extension includes an interface for storing an API key using the Chrome Storage API.

At the moment, the project uses a rule-based hint engine for generating responses. The architecture has been intentionally kept modular so that the same interface can later be connected to services such as Google Gemini or OpenAI with minimal changes.

---

## Future Improvements

Some ideas planned for future versions include:

* Gemini API integration
* OpenAI integration
* Multiple hint levels
* Time and space complexity suggestions
* Algorithm recommendations
* Better UI animations
* Conversation history
* Light and dark themes

---

## Installation

Clone the repository:

```bash
git clone https://github.com/AuroraDangelo/leetcode-ai-helper.git
```

Open Chrome and go to:

```text
chrome://extensions
```

* Enable **Developer Mode**
* Click **Load unpacked**
* Select the project folder
* Open any LeetCode problem
* Start using the AI assistant

---

## 📌 Note

This project was built to explore Chrome Extension development, DOM manipulation, browser storage, and AI-assisted learning tools. While the current version uses a rule-based hint engine, it has been designed with future LLM integration in mind.
