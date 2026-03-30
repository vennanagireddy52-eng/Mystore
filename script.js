let categories = JSON.parse(localStorage.getItem("categories")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];

let selectedCategory = null;

function save(){
localStorage.setItem("categories",JSON.stringify(categories));
localStorage.setItem("products",JSON.stringify(products));
renderCategories();
}

function renderCategories(){

document.getElementById("pageTitle").innerText="Categories";

let box=document.getElementById("categoryPage");
box.style.display="grid";
document.getElementById("productPage").style.display="none";

box.innerHTML="";

categories.forEach((c,i)=>{

box.innerHTML+=`
<div class="card" onclick="openProducts('${c.name}')">

<img src="${c.image}">

<div class="title">${c.name}</div>

<div class="linkIcon"
onclick="event.stopPropagation();copyLink('${location.href}?category=${c.name}')">
🔗
</div>

</div>
`;
});

updateSelects();
}

function openProducts(name){

selectedCategory=name;

document.getElementById("pageTitle").innerText=name+" Products";

let box=document.getElementById("productPage");
box.style.display="grid";
document.getElementById("categoryPage").style.display="none";

box.innerHTML="";

products
.filter(p=>p.category===name)
.forEach(p=>{

box.innerHTML+=`
<div class="card">

<img src="${p.image}">

<div class="title">${p.name}</div>
<div class="price">₹${p.price}</div>

<div class="buy" onclick="window.open('${p.link}')">
Buy Now
</div>

<div class="linkIcon"
onclick="copyLink('${p.link}')">
🔗
</div>

</div>
`;
});
}

function copyLink(link){
navigator.clipboard.writeText(link);
alert("Link copied!");
}

function openAdmin(){
document.getElementById("adminPanel").style.display="block";
}

function closeAdmin(){
document.getElementById("adminPanel").style.display="none";
}

function updateSelects(){

let cs=document.getElementById("categorySelect");
let pc=document.getElementById("productCategory");

cs.innerHTML="";
pc.innerHTML="";

categories.forEach(c=>{
cs.innerHTML+=`<option>${c.name}</option>`;
pc.innerHTML+=`<option>${c.name}</option>`;
});
}

/* CATEGORY */

function addCategory(){
categories.push({
name:document.getElementById("newCategory").value,
image:document.getElementById("categoryImage").value
});
save();
}

function updateCategory(){

let name=document.getElementById("categorySelect").value;

let c=categories.find(x=>x.name===name);

c.name=document.getElementById("newCategory").value||c.name;
c.image=document.getElementById("categoryImage").value||c.image;

save();
}

function deleteCategory(){

let name=document.getElementById("categorySelect").value;

categories=categories.filter(c=>c.name!==name);
products=products.filter(p=>p.category!==name);

save();
}

/* PRODUCTS */

function addProduct(){

products.push({
category:document.getElementById("productCategory").value,
name:document.getElementById("productName").value,
price:document.getElementById("productPrice").value,
image:document.getElementById("productImage").value,
link:document.getElementById("productLink").value
});

save();
}

function updateProduct(){

let name=document.getElementById("productName").value;

let p=products.find(x=>x.name===name);
if(!p)return;

p.price=document.getElementById("productPrice").value||p.price;
p.image=document.getElementById("productImage").value||p.image;
p.link=document.getElementById("productLink").value||p.link;

save();
}

function deleteProduct(){

let name=document.getElementById("productName").value;
products=products.filter(p=>p.name!==name);

save();
}

renderCategories();