const button=document.getElementById("hint-btn");

button.addEventListener("click",async () => {
    
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true 
    });
    chrome.tabs.sendMessage(
        tab.id,
        { type:"GET_PROBLEM_DATA"  },
        (response) => {
            console.log(response);

            alert(response.title);
        }
    );
    
});