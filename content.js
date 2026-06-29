const currentURL=window.location.href;

const urlParts=currentURL.split("/");

const problemSlug=urlParts[4];

const selector=
`a[href="/problems/${problemSlug}/"]`;

const titleElement=
document.querySelector(selector);

const difficultyElement=document.querySelector(
    '[class*="text-difficulty"]'
);

const descriptionElement=document.querySelector(
    '[data-track-load="description_content"]'
);

const problemData={
    title: titleElement.textContent,
    difficulty: difficultyElement.textContent,
    description:descriptionElement.innerText
};

console.log(problemData);

chrome.runtime.onMessage.addListener(
    (request,sender,sendResponse) => {
        if(request.type === "GET_PROBLEM_DATA") {
            sendResponse(problemData);

        }
        return true;
    }
);

const aiButton =
  document.createElement("button");

aiButton.innerText = "Ask AI";

aiButton.style.position = "fixed";

aiButton.style.bottom = "20px";

aiButton.style.right = "20px";

aiButton.style.zIndex = "9999";

aiButton.style.padding =
  "12px 20px";

aiButton.style.backgroundColor =
  "#2563eb";

aiButton.style.color = "white";

aiButton.style.border = "none";

aiButton.style.borderRadius =
  "10px";

aiButton.style.cursor = "pointer";

document.body.appendChild(aiButton);

const aiPanel =
  document.createElement("div");

aiPanel.style.position = "fixed";

aiPanel.style.bottom = "80px";

aiPanel.style.right = "20px";

aiPanel.style.width = "350px";

aiPanel.style.height = "450px";

aiPanel.style.backgroundColor =
  "#111827";

aiPanel.style.color = "white";

aiPanel.style.borderRadius =
  "16px";

aiPanel.style.padding = "16px";

aiPanel.style.zIndex = "9999";

aiPanel.style.boxShadow =
  "0 0 20px rgba(0,0,0,0.3)";

aiPanel.style.display = "none";

aiPanel.innerHTML = `
  <div style="
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:16px;
  ">

    <h2 style="margin:0;">
      AI Assistant
    </h2>

    <button id="close-ai-panel">
      X
    </button>

  </div>

  <h3>${problemData.title}</h3>

  <p>
    Difficulty:
    ${problemData.difficulty}
  </p>

  <div style="
    margin-top:20px;
  ">

    <div style="
  margin-top:20px;
">

  <input
    id="api-key-input"
    type="password"
    placeholder="Enter OpenAI API Key"
    style="
      width:100%;
      padding:10px;
      border-radius:8px;
      border:none;
      margin-bottom:10px;
    "
  />

  <button id="save-api-key">
    Save API Key
  </button>

</div>

<div style="
  margin-top:20px;
">

 <div
  id="chat-messages"
  style="
    height:220px;
    overflow-y:auto;
    margin-top:20px;
    padding:10px;
    background:#1f2937;
    border-radius:10px;
  "
>
</div>

<div style="margin-top:10px;">

  <input
    id="chat-input"
    placeholder="Ask for a hint..."
    style="
      width:100%;
      padding:10px;
      border-radius:8px;
      border:none;
    "
  />

  <button
    id="send-message"
    style="
      margin-top:10px;
      width:100%;
    "
  >
    Send
  </button>

</div>

</div>

  </div>
`;

document.body.appendChild(aiPanel);

aiButton.addEventListener(
  "click",
  () => {

  aiPanel.style.display="block";

  }
);

const closeButton =
  document.getElementById(
    "close-ai-panel"
  );

closeButton.addEventListener(
  "click",
  () => {

    aiPanel.style.display =
      "none";

  }
);
const saveButton =
  document.getElementById(
    "save-api-key"
  );

saveButton.addEventListener(
  "click",
  () => {

    const apiKeyInput =
      document.getElementById(
        "api-key-input"
      );

    const apiKey =
      apiKeyInput.value;

    chrome.storage.local.set(
      {
        openaiApiKey: apiKey
      },

      () => {

        alert(
          "API Key Saved!"
        );

      }
    );

  }
);
chrome.storage.local.get(
  ["openaiApiKey"],

  (result) => {

    if (result.openaiApiKey) {

      const apiKeyInput =
        document.getElementById(
          "api-key-input"
        );

      apiKeyInput.value =
        result.openaiApiKey;

    }

  }
);
const sendButton =
  document.getElementById(
    "send-message"
  );

sendButton.addEventListener(
  "click",
  async () => {

    const chatInput =
      document.getElementById(
        "chat-input"
      );

    const chatMessages =
      document.getElementById(
        "chat-messages"
      );

    const userMessage =
      chatInput.value;

    if (!userMessage) return;

    chatMessages.innerHTML+=`
    <div style="
      display:flex;
      justify-content:flex-end;
      margin-bottom:10px;
      ">
      <div style="background:#2563eb;
      color:white;
      padding:10px;
      border-radius:12px;
      max-width:80%;
      ">
      ${userMessage}
      </div>
      </div>
      `;
      const aiHint =
  await generateAIHint(
    userMessage
  );
      chatMessages.innerHTML += `
  <div
    style="
      display:flex;
      justify-content:flex-start;
      margin-bottom:10px;
    "
  >
    <div
      style="
        background:#374151;
        color:white;
        padding:10px;
        border-radius:12px;
        max-width:80%;
      "
    >
      ${aiHint}
    </div>
  </div>
`;

    chatInput.value = "";
    chatMessages.scrollTop=chatMessages.scrollHeight;

  }
);
async function generateAIHint(userMessage) {

  const text = (
    problemData.title +
    " " +
    problemData.description
  ).toLowerCase();

  const hintDatabase = [

    {
      keywords: [
        "linked list",
        "listnode"
      ],

      hint: `💡 Linked List Hint

• Think about pointer manipulation.

• Would using a dummy node simplify the solution?

• Be careful while updating next pointers.`
    },

    {
      keywords: [
        "binary tree",
        "tree node",
        "bst"
      ],

      hint: `🌳 Tree Hint

• Think about DFS or BFS.

• Can recursion simplify the traversal?

• Consider preorder, inorder or postorder.`
    },

    {
      keywords: [
        "graph",
        "edge",
        "vertex"
      ],

      hint: `🕸️ Graph Hint

• Does this require BFS or DFS?

• Could Union-Find help?

• Watch for visited nodes.`
    },

    {
      keywords: [
        "matrix",
        "grid"
      ],

      hint: `🟦 Matrix Hint

• Carefully handle boundaries.

• Direction arrays can simplify movement.

• Think row-wise and column-wise.`
    },

    {
      keywords: [
        "string"
      ],

      hint: `🔤 String Hint

• Would two pointers help?

• Can Sliding Window solve it?

• Frequency maps are often useful.`
    },

    {
      keywords: [
        "array"
      ],

      hint: `📦 Array Hint

• Hash Maps are common.

• Two Pointers may reduce complexity.

• Think about the constraints.`
    },

    {
      keywords: [
        "dynamic programming",
        "dp"
      ],

      hint: `⚡ DP Hint

• Define your state.

• Find the transition.

• Consider memoization first.`
    },

    {
      keywords: [
        "stack"
      ],

      hint: `📚 Stack Hint

• Ask yourself:

Can the last inserted element
help solve this problem?`
    },

    {
      keywords: [
        "queue"
      ],

      hint: `🚶 Queue Hint

• FIFO behaviour may be useful.

• Consider level-order traversal.`
    },

    {
      keywords: [
        "heap",
        "priority queue"
      ],

      hint: `🏔️ Heap Hint

• Do you repeatedly need
the smallest or largest element?

• A priority queue may help.`
    },

    {
      keywords: [
        "binary search",
        "sorted"
      ],

      hint: `🔍 Binary Search Hint

• The input is sorted.

• Can you eliminate half
the search space each step?`
    }

  ];

  for (const topic of hintDatabase) {

    for (const keyword of topic.keywords) {

      if (text.includes(keyword)) {

        return topic.hint;

      }

    }

  }

  return `💡 General Hint

• Read the constraints carefully.

• Think about the required
time complexity.

• Which data structure
fits this problem best?`;

}

const chatInput =
  document.getElementById(
    "chat-input"
  );

chatInput.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Enter") {

      sendButton.click();

    }

  }
);
