const data={
IND:{
Tech:[
{
name:"JBL Speaker",
img:"https://i.supaimg.com/e6a65bbc-d4e3-4657-8388-0945710f9b08/7bd6dcb8-d791-44a1-895b-78b5e25157f1.webp",
price:"₹2799",
link:"https://amzn.to/40OZeuH"
}
],
Travel:[
{
name:"Travel Bags",
img:"https://i.supaimg.com/e6a65bbc-d4e3-4657-8388-0945710f9b08/32db2e5a-2cad-455e-b073-9f9be1bb940d.jpg",
price:"₹799",
link:"https://amzn.to/47iPnky"
}
]
},
US:{
Tech:[
{
name:"JBL Speaker",
img:"https://i.supaimg.com/e6a65bbc-d4e3-4657-8388-0945710f9b08/fbac8cc5-2800-41cf-9458-3f9bcddfead7.webp",
price:"$97",
link:"https://amzn.to/3PvtdW7"
}
]
}
};

let currentStore="";

function showToast(){
const t=document.getElementById("toast");
t.style.display="block";
setTimeout(()=>t.style.display="none",1500);
}

function copyLink(link,e){
if(e)e.stopPropagation();
navigator.clipboard.writeText(link);
showToast();
}

function openStore(store){
currentStore=store;
document.getElementById("storeLayer").classList.remove("active");
document.getElementById("categoryLayer").classList.add("active");
renderCategories();
}

function goHome(){
document.getElementById("categoryLayer").classList.remove("active");
document.getElementById("storeLayer").classList.add("active");
}

function renderCategories(){
const grid=document.getElementById("categoryGrid");
grid.innerHTML="";

Object.keys(data[currentStore]).forEach(cat=>{

const url=`products.html?store=${currentStore}&cat=${cat}`;

grid.innerHTML+=`
<div class="card" onclick="location.href='${url}'">
<button class="linkBtn"
onclick="copyLink('${location.origin}/${url}',event)">🔗</button>

<img src="${data[currentStore][cat][0].img}">
<div class="info"><b>${cat}</b></div>
</div>`;
});
}

function renderProducts(){
const params=new URLSearchParams(window.location.search);
const store=params.get("store");
const cat=params.get("cat");

if(!store||!cat)return;

const grid=document.getElementById("productGrid");

data[store][cat].forEach(p=>{
grid.innerHTML+=`
<div class="card">
<button class="linkBtn"
onclick="copyLink('${p.link}',event)">🔗</button>

<img src="${p.img}">
<div class="info">
<b>${p.name}</b><br>${p.price}
</div>

<a class="buy" href="${p.link}" target="_blank">Buy Now</a>
</div>`;
});
}

if(document.getElementById("productGrid")){
renderProducts();
}