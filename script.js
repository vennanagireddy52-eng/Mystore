/* ================= STATE ================= */

let currentStore=null;
let currentCategory=null;
let currentProduct=null;


/* ================= HISTORY PUSH ================= */

function push(state,url){
history.pushState(state,"",url);
}


/* ================= PAGE SHOW ================= */

function show(store,category,product){

document.getElementById("storePage").style.display =
store && !category ? "block":"none";

document.getElementById("categoryPage").style.display =
category && !product ? "block":"none";

document.getElementById("productPage").style.display =
product ? "block":"none";
}


/* ================= STORE ================= */

function openStore(store){

currentStore=store;
currentCategory=null;
currentProduct=null;

show(true,false,false);

push(
{page:"store",store},
`?store=${store}`
);
}


/* ================= CATEGORY ================= */

function openCategory(store,cat){

currentStore=store;
currentCategory=cat;
currentProduct=null;

document.getElementById("categoryTitle").innerText=cat;

show(false,true,false);

push(
{page:"category",store,cat},
`?store=${store}&cat=${cat}`
);
}


/* ================= PRODUCT ================= */

function openProduct(store,cat,prod){

currentStore=store;
currentCategory=cat;
currentProduct=prod;

show(false,false,true);

push(
{page:"product",store,cat,prod},
`?store=${store}&cat=${cat}&prod=${prod}`
);
}


/* ================= BACK BUTTONS ================= */

function goStore(){
history.back();
}

function goCategory(){
history.back();
}


/* ================= ANDROID BACK SUPPORT ================= */

window.onpopstate=function(e){

if(!e.state){
location.reload();
return;
}

const s=e.state;

if(s.page==="store") openStore(s.store);
if(s.page==="category") openCategory(s.store,s.cat);
if(s.page==="product") openProduct(s.store,s.cat,s.prod);
};


/* ================= PINTEREST DIRECT LOAD ================= */

window.onload=function(){

const p=new URLSearchParams(location.search);

const store=p.get("store");
const cat=p.get("cat");
const prod=p.get("prod");

if(store && cat && prod){
openStore(store);
openCategory(store,cat);
openProduct(store,cat,prod);
return;
}

if(store && cat){
openStore(store);
openCategory(store,cat);
return;
}

if(store){
openStore(store);
}
};


/* ================= DATA SAVE ================= */

function saveData(){

localStorage.setItem(
"savedProduct",
currentProduct
);

document.getElementById("saveStatus").innerText="Saved ✅";
}