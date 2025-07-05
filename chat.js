const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body);

    // Step 1: Realtime crypto price fetch from CoinGecko
    const cryptoResponse = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
    );

    if (!cryptoResponse.ok) {
      throw new Error("CoinGecko API failed");
    }

    const cryptoData = await cryptoResponse.json();
    const btcPrice = cryptoData.bitcoin.usd;
    const ethPrice = cryptoData.ethereum.usd;

    // Step 2: Create AI Prompt with live price
    const aiPrompt = `
BTC current price: $${btcPrice}
ETH current price: $${ethPrice}
User asked: ${message}
Now, predict market movement for next 24 hours and suggest good crypto to watch.
    `;

    // Step 3: Call OpenRouter AI
    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistral/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You are a crypto expert AI who predicts future trends based on live price." },
          { role: "user", content: aiPrompt }
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
