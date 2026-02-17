const App={
candles:[],
indicators:{},
equity:100000,
peakEquity:100000,
positions:[]
};

function avg(arr){return arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:0;}
function std(arr){
if(!arr.length) return 0;
const m=avg(arr);
return Math.sqrt(avg(arr.map(x=>(x-m)**2)));
}

function calculateRSI(prices,period=14){
let rsi=[];
for(let i=period;i<prices.length;i++){
let gains=0,losses=0;
for(let j=i-period+1;j<=i;j++){
let diff=prices[j]-prices[j-1];
if(diff>=0) gains+=diff;
else losses-=diff;
}
let rs=gains/(losses||1);
rsi[i]=100-100/(1+rs);
}
return rsi;
}

const Strategy={
rsiBuy:30,
rsiSell:70,
signal(i){
let r=App.indicators.rsi[i];
if(!r) return null;
if(r<this.rsiBuy) return "buy";
if(r>this.rsiSell) return "sell";
return null;
}
};

function backtest(){
let equity=100000,position=null,returns=[];
App.candles.forEach((c,i)=>{
let sig=Strategy.signal(i);
if(sig==="buy"&&!position) position=+c.close;
if(sig==="sell"&&position){
let pnl=+c.close-position;
equity+=pnl;
returns.push(pnl);
position=null;
}
});
return{
final:equity,
sharpe:avg(returns)/(std(returns)||1)
};
}

function generateHeatmap(data){
let container=document.getElementById("heatmap");
container.innerHTML="";
data.forEach(v=>{
let d=document.createElement("div");
d.className="heat-cell";
let intensity=Math.min(Math.abs(v)/10,1);
d.style.background=v>0?
`rgba(16,185,129,${intensity})`:
`rgba(239,68,68,${intensity})`;
d.textContent=v.toFixed(1)+"%";
container.appendChild(d);
});
}

async function loadDemoData(){
const res=await fetch("https://api.twelvedata.com/time_series?symbol=AAPL&interval=1day&apikey=demo");
const data=await res.json();
App.candles=data.values.reverse();
const closes=App.candles.map(c=>+c.close);
App.indicators.rsi=calculateRSI(closes);
renderCharts();
generateHeatmap(closes.slice(-12).map(()=>Math.random()*10-5));
}

function renderCharts(){
const ctx=document.getElementById("stockChart").getContext("2d");
new Chart(ctx,{
type:"line",
data:{
labels:App.candles.map(c=>c.datetime),
datasets:[{
label:"Close Price",
data:App.candles.map(c=>+c.close),
borderColor:"#3b82f6"
}]
}
});
}

document.addEventListener("DOMContentLoaded",()=>{
loadDemoData();
document.getElementById("runBacktest").onclick=()=>{
let r=backtest();
document.getElementById("analyticsOutput")
.innerHTML=`Final: ${r.final} | Sharpe: ${r.sharpe.toFixed(2)}`;
};
});