// ===== SAFE ADMIN + LINK SYSTEM =====

// storage
let storeData = JSON.parse(localStorage.getItem("storeData")) || {
  categories: [],
  products: []
};

function saveData(){
  localStorage.setItem("storeData", JSON.stringify(storeData));
}

// ---------- LINK COPY ----------
function copyLink(url,e){
  if(e) e.stopPropagation();

  const finalLink = url || window.location.href;

  navigator.clipboard.writeText(finalLink)
  .then(()=>alert("Link copied ✅"))
  .catch(()=>alert("Copy failed"));
}

// ---------- ADMIN PANEL ----------
function toggleAdmin(){
  const panel=document.getElementById("adminPanel");
  panel.style.display =
    panel.style.display==="block"?"none":"block";
}

// ---------- CATEGORY ----------
function addCategory(name,img){
  if(!name || !img) return alert("Enter details");

  storeData.categories.push({name,img});
  saveData();

  alert("Category added ✅");
}

// ---------- PRODUCT ----------
function addProduct(name,price,img,link,category){
  if(!name||!price||!img||!link) return alert("Fill all");

  storeData.products.push({
    name,price,img,link,category
  });

  saveData();
  alert("Product added ✅");
}

// ---------- DELETE ----------
function deleteProduct(index){
  storeData.products.splice(index,1);
  saveData();
  location.reload();
}

// ---------- EDIT ----------
function editProduct(index){
  let newName=prompt("New product name");
  if(!newName) return;

  storeData.products[index].name=newName;
  saveData();
  location.reload();
}