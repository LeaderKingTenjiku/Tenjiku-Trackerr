let page=1, perPage=15;
let coins=[], allCoins=[];

async function loadCoins(){
 let res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=250&page=1");
 allCoins = await res.json();
 coins = allCoins;
 render();
}
loadCoins();

function render(){
 let grid=document.getElementById("crypto-grid");
 grid.innerHTML="";
 let start=(page-1)*perPage;
 coins.slice(start,start+perPage).forEach(c=>{
   let d=document.createElement("div");
   d.className="crypto-card";
   d.innerHTML=`<h3>${c.name}</h3><span>$${c.current_price}</span>`;
   d.onclick=()=>location.href="coin.html?id="+c.id;
   grid.appendChild(d);
 });
 document.getElementById("pageNum").innerText=page;
}

document.getElementById("next").onclick=()=>{page++;render();}
document.getElementById("prev").onclick=()=>{if(page>1){page--;render();}}

document.getElementById("search").oninput=(e)=>{
 let q=e.target.value.toLowerCase();
 coins=allCoins.filter(c=>c.name.toLowerCase().includes(q));
 page=1;render();
};

// 🔥 TRUE REALTIME POPUPS (BINANCE WEBSOCKET)
let socket = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");
socket.onmessage=(e)=>{
 let data = JSON.parse(e.data);
 let container=document.getElementById("popup-container");
 container.innerHTML="";

 // Flood 10 updates instantly
 data.slice(0,10).forEach(c=>{
   let p=document.createElement("div");
   p.className="popup";
   p.innerText=`${c.s} → $${parseFloat(c.c).toFixed(2)}`;
   container.appendChild(p);
 });
};

