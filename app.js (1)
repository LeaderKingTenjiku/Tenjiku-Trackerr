let page=1, perPage=15;
let allCoins=[], coins=[];

// Load coins
async function loadCoins(){
 let res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=250&page=1");
 allCoins = await res.json();
 coins = allCoins;
 render();
}
loadCoins();

// Render
function render(){
 let grid=document.getElementById("crypto-grid");
 grid.innerHTML="";
 let start=(page-1)*perPage;
 coins.slice(start,start+perPage).forEach(c=>{
   let d=document.createElement("div");
   d.className="coin-card";
   d.innerHTML=`
     <img src="${c.image}">
     <div>
       <h3>${c.name}</h3>
       <p>$${c.current_price}</p>
     </div>
   `;
   d.onclick=()=>location.href="coin.html?id="+c.id;
   grid.appendChild(d);
 });
 document.getElementById("pageNum").innerText=page;
}

document.getElementById("next").onclick=()=>{page++;render();}
document.getElementById("prev").onclick=()=>{if(page>1){page--;render();}}

// Search
document.getElementById("search").oninput=(e)=>{
 let q=e.target.value.toLowerCase();
 coins=allCoins.filter(c=>c.name.toLowerCase().includes(q));
 page=1;render();
};

// MENU
let menu=document.querySelector(".menu");
let panel=document.getElementById("menuPanel");
menu.onclick=()=>panel.style.display = panel.style.display==="flex"?"none":"flex";

//////////////////////////////////////////////////////////////
// POPUP BATCH SYSTEM (4 at once)
let popupQueue=[], showing=false;
const BATCH_SIZE=4;

function showBatch(){
 if(popupQueue.length==0){showing=false;return;}
 showing=true;
 let c=document.getElementById("popup-container");
 c.innerHTML="";
 popupQueue.splice(0,BATCH_SIZE).forEach(msg=>{
  let p=document.createElement("div");
  p.className="popup";
  p.innerText=msg;
  c.appendChild(p);
 });
 setTimeout(showBatch,2000);
}

function pushPopup(msg){
 popupQueue.push(msg);
 if(!showing) showBatch();
}

// Binance realtime
let ws=new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");
ws.onmessage=(e)=>{
 let data=JSON.parse(e.data);
 data.slice(0,30).forEach(c=>{
  pushPopup(`${c.s} → $${parseFloat(c.c).toFixed(2)}`);
 });
};
