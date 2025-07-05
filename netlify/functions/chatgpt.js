const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body);

    // Step 1: Get real-time prices from CoinGecko
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd");
    if (!response.ok) {
      throw new Error("Failed to fetch prices");
    }

    const prices = await response.json();
    const btc = prices.bitcoin.usd;
    const eth = prices.ethereum.usd;

    // Step 2: Send to OpenRouter AI for prediction
    const prompt = `
BTC price: $${btc}
ETH price: $${eth}
User Message: ${message}
Based on the above prices and market condition, give a short and useful prediction.
`;

    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistral/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You are a crypto expert AI." },
          { role: "user", content: prompt }
        ]
      })
    });

    const aiData = await aiResponse.json();
    const reply = aiData.choices?.[0]?.message?.content || "AI did not respond.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    console.error("Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Sorry, couldn't fetch crypto or reply." })
    };
  }
};
