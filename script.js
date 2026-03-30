let categories = JSON.parse(localStorage.getItem("categories")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];

let currentCategory=null;

const storePage=document.getElementById("storePage");
const categoryPage=document.getElementById("categoryPage");
const productPage=document.getElementById("productPage");
const title=document.getElementById("pageTitle");

function save(){
localStorage.setItem("categories",JSON.stringify(categories));
localStorage.setItem("products",JSON.stringify(products));
}

function showPage(page){
storePage.classList.add("hidden");
categoryPage.classList.add("hidden");
productPage.classList.add("hidden");
page.classList.remove("hidden");
}

function renderCategories(){
title.innerText="Categories";
showPage(storePage);

storePage.innerHTML="";

categories.forEach((c,i)=>{
storePage.innerHTML+=`
<div class="card">
<div class="linkIcon" onclick="copyLink('?category=${i}')">🔗</div>
<img src="${c.img}">
<h3 onclick="openCategory(${i})">${c.name}</h3>
</div>`;
});
}

function openCategory(i){
currentCategory=i;
title.innerText=categories[i].name;
showPage(categoryPage);

categoryPage.innerHTML="";

products
.filter(p=>p.category==i)
.forEach((p,index)=>{
categoryPage.innerHTML+=`
<div class="card">
<div class="linkIcon" onclick="copyLink('?product=${index}')">🔗</div>
<img src="${p.img}">
<h3>${p.name}</h3>
<h3 style="color:red">₹${p.price}</h3>
<a class="buy" href="${p.link}" target="_blank">Buy Now</a>
<button onclick="editProduct(${index})">Edit</button>
<button onclick="deleteProduct(${index})">Delete</button>
</div>`;
});
}

function goBack(){
renderCategories();
}

function copyLink(param){
let url=location.origin+location.pathname+param;
navigator.clipboard.writeText(url);
alert("Link Copied");
}

function toggleAdmin(){
document.getElementById("adminPanel").classList.toggle("hidden");
}

function addCategory(){
let name=document.getElementById("catName").value;
let img=document.getElementById("catImg").value;

categories.push({name,img});
save();
renderCategories();
}

function addProduct(){
let name=document.getElementById("prodName").value;
let price=document.getElementById("prodPrice").value;
let img=document.getElementById("prodImg").value;
let link=document.getElementById("prodLink").value;

products.push({
name,price,img,link,
category:currentCategory
});

save();
openCategory(currentCategory);
}

function deleteProduct(i){
products.splice(i,1);
save();
openCategory(currentCategory);
}

function editProduct(i){
let newName=prompt("New name");
if(newName){
products[i].name=newName;
save();
openCategory(currentCategory);
}
}

renderCategories();