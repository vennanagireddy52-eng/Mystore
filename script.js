let currentStore="";
let currentCategory="";

let data={
IND:{},
US:{}
};

/* ---------- NAVIGATION ---------- */

function showPage(id){
document.querySelectorAll(".page")
.forEach(p=>p.classList.remove("active"));
document.getElementById(id).classList.add("active");
}

function openStore(store){
currentStore=store;
renderCategories();
showPage("categoryPage");
}

function goHome(){
showPage("storePage");
}

/* ---------- CATEGORY ---------- */

function addCategory(){
let name=document.getElementById("catName").value;
let img=document.getElementById("catImg").value;

if(!name)return;

data[currentStore][name]=[];

renderCategories();
}

function renderCategories(){
let grid=document.getElementById("categoryGrid");
grid.innerHTML="";

Object.keys(data[currentStore]).forEach(cat=>{

let link=`products.html?store=${currentStore}&cat=${cat}`;

grid.innerHTML+=`
<div class="card">
<div class="linkIcon" onclick="copyLink('${link}')">🔗</div>
<img src="${data[currentStore][cat][0]?.img || 'https://via.placeholder.com/300'}">
<div class="info">
<a href="${link}">${cat}</a>
<button onclick="deleteCategory('${cat}')">Delete</button>
</div>
</div>`;
});
}

function deleteCategory(cat){
delete data[currentStore][cat];
renderCategories();
}

/* ---------- PRODUCTS ---------- */

function addProduct(){

let name=prodName.value;
let img=prodImg.value;
let price=prodPrice.value;
let link=prodLink.value;

let cat=Object.keys(data[currentStore])[0];
if(!cat)return;

data[currentStore][cat].push({
name,img,price,link
});
}

function loadProducts(){

let params=new URLSearchParams(location.search);
let store=params.get("store");
let cat=params.get("cat");

document.getElementById("catTitle").innerText=cat;

let grid=document.getElementById("productGrid");
grid.innerHTML="";

(data[store][cat]||[]).forEach(p=>{

grid.innerHTML+=`
<div class="card">
<div class="linkIcon" onclick="copyLink('${p.link}')">🔗</div>
<img src="${p.img}">
<div class="info">
<b>${p.name}</b><br>
${p.price}
</div>
<a class="buy" href="${p.link}" target="_blank">Buy</a>
</div>`;
});
}

/* ---------- LINK COPY ---------- */

function copyLink(link){
navigator.clipboard.writeText(link);
alert("Link copied!");
}

/* ---------- ADMIN ---------- */

function toggleAdmin(){
let a=document.getElementById("adminPanel");
a.style.display=a.style.display==="block"?"none":"block";
}