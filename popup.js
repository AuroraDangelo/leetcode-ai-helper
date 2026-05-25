const button =
  document.getElementById("hint-btn");

const resultDiv =
  document.getElementById("result");

button.addEventListener("click", async () => {

  const [tab] =
    await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

  chrome.tabs.sendMessage(
    tab.id,
    { type: "GET_PROBLEM_DATA" },

    (response) => {

      resultDiv.innerHTML = `
        <h2>${response.title}</h2>

        <p>
          Difficulty:
          ${response.difficulty}
        </p>
      `;

    }
  );

});