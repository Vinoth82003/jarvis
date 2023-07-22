const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", async () => {
  const inputText = userInput.value.trim();
  if (inputText !== "") {
    const userMessage = document.createElement("div");
    userMessage.classList.add("user-message");
    userMessage.innerText = `You: ${inputText}`;
    chatBox.appendChild(userMessage);

    userInput.value = "";
    userInput.focus();

    const response = await askServer(inputText);

    const botMessage = document.createElement("div");
    botMessage.classList.add("bot-message");
    botMessage.innerText = `jarvis: ${response}`;
    chatBox.appendChild(botMessage);

    chatBox.scrollTop = chatBox.scrollHeight;
  } else {
    alert("empty request !");
  }
});

async function askServer(input) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input }),
  };

  const response = await fetch("/api/chat", requestOptions);
  const data = await response.json();
  return data.response;
}
