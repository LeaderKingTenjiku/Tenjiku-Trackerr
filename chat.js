document.getElementById("send").addEventListener("click", async () => {
  const input = document.getElementById("msg");
  const userMessage = input.value.trim();
  if (!userMessage) return;

  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
  input.value = "";

  try {
    // 🔁 Step 1: Try extracting coin name from user question
    const coinMatch = userMessage.match(/\b(bitcoin|ethereum|solana|dogecoin|bnb|xrp|cardano)\b/i);
    let coin = coinMatch ? coinMatch[0].toLowerCase() : null;

    let coinDataText = "No specific coin mentioned.";

    if (coin) {
      // 🔁 Step 2: Fetch crypto data from CoinGecko
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}`);
      const data = await res.json();

      const price = data.market_data.current_price.usd;
      const change = data.market_data.price_change_percentage_24h;
      const volume = data.market_data.total_volume.usd;

      coinDataText = `
      Coin: ${data.name}
      Price: $${price.toLocaleString()}
      24h Change: ${change.toFixed(2)}%
      24h Volume: $${volume.toLocaleString()}
      `;
    }

    // 🧠 Step 3: Send to AI Assistant
    const res2 = await fetch("/api/chatgpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `You are a crypto expert. Use the following data and the user's question to reply smartly.

        DATA:
        ${coinDataText}

        USER QUESTION:
        ${userMessage}
        `
      })
    });

    const data2 = await res2.json();
    chatBox.innerHTML += `<p><strong>AI:</strong> ${data2.reply}</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (err) {
    chatBox.innerHTML += `<p><strong>AI:</strong> Sorry, couldn't fetch crypto info or reply.</p>`;
    console.error(err);
  }
});
