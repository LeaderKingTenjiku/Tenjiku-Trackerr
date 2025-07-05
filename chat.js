document.getElementById("send").addEventListener("click", async () => {
  const input = document.getElementById("msg");
  const chatBox = document.getElementById("chat-box");

  const userMessage = input.value.trim();
  if (!userMessage) return;

  chatBox.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
  input.value = "";

  const res = await fetch("/api/chatgpt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage })
  });

  const data = await res.json();

  chatBox.innerHTML += `<p><strong>AI:</strong> ${data.reply}</p>`;
  chatBox.scrollTop = chatBox.scrollHeight;
});
