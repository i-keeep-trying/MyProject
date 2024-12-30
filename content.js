const AIassistantImgURL = chrome.runtime.getURL("assets/robot.png");
const AZ_PROBLEM_KEY = "AZ_PROBLEM_KEY";

let lastVisitedPage = "";

//check if we are on the same page
function isPageChange() {
    const currentPath = window.location.pathname;
    if(lastVisitedPage === currentPath) return false;
    lastVisitedPage = currentPath;
    return true;
}

function isProblemsRoute() {
    const pathname = window.location.pathname;
    return pathname.startsWith("/problems/") && pathname.length > "/problems/".length;
}

function observePageChange() {
    console.log("observing page change");
    const existingButton = document.getElementById("add-AIassistant-button");
    if(!isPageChange()) {
        console.log("Page not changed");
        return;
    }
    else {
        console.log("Page changed");
    }
    if (existingButton) {
        console.log("Button already exists, so not adding again");
        return;
    }
    if(isProblemsRoute()) {
        console.log("On problems route");
        addAIAssistantButton();
    }
}

setInterval(observePageChange, 500);

function addAIAssistantButton() {
    console.log("adding button");
    const AIAssistantButton = document.createElement('img');
    AIAssistantButton.id = "add-AIassistant-button";
    AIAssistantButton.src = AIassistantImgURL;
    AIAssistantButton.style.height = "32px";
    AIAssistantButton.style.width = "32px";
    AIAssistantButton.style.backgroundColor = "white";
    AIAssistantButton.style.borderRadius = "6px";
    // AIAssistantButton.style.border = "2px solid #007BFF"; // Add a blue border
    AIAssistantButton.style.padding = "5px";
    AIAssistantButton.style.cursor = "pointer"; // Change the cursor to pointer
    AIAssistantButton.style.transition = "transform 0.2s, box-shadow 0.2s"; // Smooth transitions

    // Add hover effects using JavaScript
    AIAssistantButton.addEventListener("mouseenter", () => {
        // AIAssistantButton.style.transform = "scale(1.1)"; // Slightly enlarge on hover
        // AIAssistantButton.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)"; // Add a shadow
        AIAssistantButton.style.border = "1px solid rgb(69, 121, 163)";
    });

    AIAssistantButton.addEventListener("mouseleave", () => {
        // AIAssistantButton.style.transform = "scale(1.0)"; // Reset size on hover out
        // AIAssistantButton.style.boxShadow = "none"; // Remove the shadow
        AIAssistantButton.style.border = "none";
    });
    
    const refreshButton = document.getElementsByClassName("coding_refresh_button__ROLfK")[0];

    refreshButton.insertAdjacentElement("beforebegin", AIAssistantButton);

    AIAssistantButton.addEventListener("click", openChatboxHandler);
}

function openChatboxHandler() {

    const existingAPIKeyInput = document.getElementById("ai-api-key-input");
    const existingChatbox = document.getElementById("ai-assistant-chatbox");

    // If either the input box or chatbox already exists, don't recreate them
    if (existingAPIKeyInput || existingChatbox) {
        console.log("Either API key input or chatbox already exists");
        return;
    }

    // Create an input box for the API key
    const apiKeyContainer = document.createElement("div");
    apiKeyContainer.id = "ai-api-key-input-container";
    apiKeyContainer.style.position = "fixed";
    apiKeyContainer.style.bottom = "20px";
    apiKeyContainer.style.right = "20px";
    apiKeyContainer.style.width = "300px";
    apiKeyContainer.style.height = "150px";
    apiKeyContainer.style.backgroundColor = "white";
    apiKeyContainer.style.border = "2px solid #007BFF";
    apiKeyContainer.style.borderRadius = "8px";
    apiKeyContainer.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
    apiKeyContainer.style.display = "flex";
    apiKeyContainer.style.flexDirection = "column";
    apiKeyContainer.style.alignItems = "center";
    apiKeyContainer.style.justifyContent = "center";
    apiKeyContainer.style.zIndex = "1000";

    const apiKeyInput = document.createElement("input");
    apiKeyInput.id = "ai-api-key-input";
    apiKeyInput.type = "text";
    apiKeyInput.placeholder = "Enter your API key";
    apiKeyInput.style.padding = "10px";
    apiKeyInput.style.width = "80%";
    apiKeyInput.style.border = "1px solid #ccc";
    apiKeyInput.style.borderRadius = "4px";
    apiKeyInput.style.marginBottom = "10px";

    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.style.padding = "10px 20px";
    submitButton.style.backgroundColor = "#007BFF";
    submitButton.style.color = "white";
    submitButton.style.border = "none";
    submitButton.style.borderRadius = "4px";
    submitButton.style.cursor = "pointer";

    submitButton.addEventListener("click", () => {
        const enteredAPIKey = apiKeyInput.value.trim();
        if (!enteredAPIKey) {
            alert("Please enter a valid API key.");
            return;
        }

        // Store the entered API key
        localStorage.setItem("AI_API_KEY", enteredAPIKey);

        // Remove the API key input box and open the chatbox
        apiKeyContainer.remove();
        console.log("API key saved. Opening chatbox...");
        createChatbox(enteredAPIKey); // Pass the API key to the chatbox
    });

    apiKeyContainer.appendChild(apiKeyInput);
    apiKeyContainer.appendChild(submitButton);
    document.body.appendChild(apiKeyContainer);
}



function createChatbox(apiKey) {
    const azProblemUrl = window.location.href;
    const uniqueID = extractUniqueID(azProblemUrl);
    // const problemName = document.getElementsByClassName("Header_resource_heading__cpRp1");
    // const problemDescription = document.getElementsByClassName("coding_desc__pltWY ");

    // const chatboxObj = {
    //     id: uniqueID,
    //     name: problemName,
    //     description: problemDescription,
    //     url: azProblemUrl
    // }
    const existingChatbox = document.getElementById("ai-assistant-chatbox");
    if (existingChatbox) {
        //checking if chatbox exists
        console.log("Chatbox already exists");
        return;
    }

    // Create a chatbox container
    const chatbox = document.createElement("div");
    chatbox.id = "ai-assistant-chatbox";
    chatbox.style.position = "fixed";
    chatbox.style.bottom = "20px";
    chatbox.style.right = "20px";
    chatbox.style.width = "300px";
    chatbox.style.height = "400px";
    chatbox.style.backgroundColor = "white";
    chatbox.style.border = "2px solid #007BFF";
    chatbox.style.borderRadius = "8px";
    chatbox.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
    chatbox.style.display = "flex";
    chatbox.style.flexDirection = "column";
    chatbox.style.zIndex = "1000";

    // Add a header for the chatbox
    const chatboxHeader = document.createElement("div");
    chatboxHeader.style.backgroundColor = "#007BFF";
    chatboxHeader.style.color = "white";
    chatboxHeader.style.padding = "10px";
    chatboxHeader.style.borderTopLeftRadius = "8px";
    chatboxHeader.style.borderTopRightRadius = "8px";
    chatboxHeader.style.display = "flex";
    chatboxHeader.style.justifyContent = "space-between";
    chatboxHeader.style.alignItems = "center";

    const headerTitle = document.createElement("span");
    headerTitle.textContent = "AI Assistant";
    chatboxHeader.appendChild(headerTitle);

    // Add a close button to the header
    const closeButton = document.createElement("button");
    closeButton.textContent = "✕";
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.border = "none";
    closeButton.style.color = "white";
    closeButton.style.fontSize = "16px";
    closeButton.style.cursor = "pointer";

    closeButton.addEventListener("click", () => {
        chatbox.remove(); // Remove the chatbox from the DOM
    });

    chatboxHeader.appendChild(closeButton);
    chatbox.appendChild(chatboxHeader);


    // Add a chat content area
    const chatContent = document.createElement("div");
    chatContent.style.flex = "1";
    chatContent.style.padding = "10px";
    chatContent.style.overflowY = "auto";
    chatContent.style.backgroundColor = "#f9f9f9";
    chatbox.appendChild(chatContent);

    // Add an input area
    const chatInputContainer = document.createElement("div");
    chatInputContainer.style.display = "flex";
    chatInputContainer.style.padding = "10px";
    chatInputContainer.style.borderTop = "1px solid #ddd";

    const chatInput = document.createElement("input");
    chatInput.type = "text";
    chatInput.placeholder = "Type a message...";
    chatInput.style.flex = "1";
    chatInput.style.padding = "8px";
    chatInput.style.border = "1px solid #ccc";
    chatInput.style.borderRadius = "4px";
    chatInput.style.outline = "none";

    const sendButton = document.createElement("button");
    sendButton.textContent = "Send";
    sendButton.style.marginLeft = "10px";
    sendButton.style.padding = "8px 16px";
    sendButton.style.backgroundColor = "#007BFF";
    sendButton.style.color = "white";
    sendButton.style.border = "none";
    sendButton.style.borderRadius = "4px";
    sendButton.style.cursor = "pointer";

    const sendMessage = () => {
        console.log("sendMessage function triggered");
        const message = chatInput.value.trim();
        console.log("User input:", message);
        if (message) {
            const userMessage = document.createElement("div");
            userMessage.style.marginBottom = "10px";
            userMessage.style.textAlign = "right";
            userMessage.textContent = message;
            chatContent.appendChild(userMessage);
    
            // Clear the input field
            chatInput.value = "";
            chatContent.scrollTop = chatContent.scrollHeight; // Scroll to the latest message
    
            // Make the API call
            console.log("Making API call");
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            const requestBody = {
                contents: [{
                    parts: [{ text: message }]
                }]
            };

            console.log("Making API call with message:", message);
    
            fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            })
            .then(response => response.json())
            .then(data => {
                if (data && data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
                    const aiResponse = data.candidates[0].content.parts[0].text;
                    console.log("AI Response:", aiResponse);
    
                    // Optionally, display the AI response in the chat
                    const aiMessage = document.createElement("div");
                    aiMessage.style.marginBottom = "10px";
                    aiMessage.style.textAlign = "left";
                    aiMessage.style.backgroundColor = "#f1f1f1";
                    aiMessage.style.padding = "8px";
                    aiMessage.style.borderRadius = "6px";
                    aiMessage.textContent = aiResponse;
                    chatContent.appendChild(aiMessage);
                    chatContent.scrollTop = chatContent.scrollHeight;
                } else {
                    console.error("Unexpected API response:", data);
                }
            })
            .catch(error => {
                console.error("Error calling the API:", error);
            });
        }
    };

    sendButton.addEventListener("click", sendMessage);

    // Allow sending messages by pressing the "Enter" key
    chatInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    chatInputContainer.appendChild(chatInput);
    chatInputContainer.appendChild(sendButton);
    chatbox.appendChild(chatInputContainer);

    document.body.appendChild(chatbox);
}

const extractUniqueID = (url) => {
    const start = url.indexOf("problems/") + "problems/".length; // Find the start position
    const end = url.indexOf("?", start); // Find the end position
    return end !== -1 ? url.substring(start, end) : url.substring(start); // Extract portion
};

function getCurrentChats() {
    chrome.storage.sync.get([AZ_PROBLEM_KEY])
}