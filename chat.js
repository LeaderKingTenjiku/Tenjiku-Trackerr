const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");

sendBtn.addEventListener("click", async () => {
  const message = chatInput.value.trim();
  if (!message) return;

  // Show user message
  chatBox.innerHTML += `<div class="user-msg">🧑‍💻 ${message}</div>`;
  chatInput.value = "";

  try {
    const res = await fetch("/api/chatgpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    chatBox.innerHTML += `<div class="ai-msg">🤖 ${data.reply}</div>`;
  } catch (err) {
    chatBox.innerHTML += `<div class="ai-msg error">❌ Server error or no response</div>`;
  }
});
