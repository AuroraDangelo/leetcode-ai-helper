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

  <h3>AI Hint</h3>

  <p>
    Try thinking about
    hashmap-based approaches.
  </p>

</div>

  </div>
`;

document.body.appendChild(aiPanel);

aiButton.addEventListener(
  "click",
  () => {

    aiPanel.style.display =
      "block";

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