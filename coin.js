let id = new URLSearchParams(location.search).get("id");

// Load name
async function loadInfo(){
 let c = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`).then(r=>r.json());
 document.getElementById("coinName").innerText=c.name;
}
loadInfo();

// Fake AI Risk (demo)
document.getElementById("riskFill").style.height="65%";
document.getElementById("safeFill").style.height="35%";

// TradingView chart
let script=document.createElement("script");
script.src="https://s3.tradingview.com/tv.js";
script.onload=()=>{
 new TradingView.widget({
  container_id:"tv-chart",
  symbol:"BINANCE:BTCUSDT",
  interval:"D",
  theme:"light",
  autosize:true
 });
};
document.body.appendChild(script);
