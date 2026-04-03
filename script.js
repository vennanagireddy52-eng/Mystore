/* ===============================
   PAGE ELEMENTS
================================*/

const storePage = document.getElementById("storePage");
const categoryPage = document.getElementById("categoryPage");
const productPage = document.getElementById("productPage");

let currentStore=null;
let currentCategory=null;
let currentProduct=null;


/* ===============================
   SHOW PAGES (FIXED)
================================*/

function showStore(){
    storePage.style.display="block";
    categoryPage.style.display="none";
    productPage.style.display="none";
}

function showCategory(){
    storePage.style.display="none";
    categoryPage.style.display="block";
    productPage.style.display="none";
}

function showProduct(){
    storePage.style.display="none";
    categoryPage.style.display="none";
    productPage.style.display="block";
}


/* ===============================
   HISTORY PUSH
================================*/

function push(state,url){
    history.pushState(state,"",url);
}


/* ===============================
   OPEN STORE
================================*/

function openStore(store){

    currentStore=store;
    currentCategory=null;
    currentProduct=null;

    showStore();

    push(
        {page:"store",store},
        `?store=${store}`
    );
}


/* ===============================
   OPEN CATEGORY
================================*/

function openCategory(store,cat){

    currentStore=store;
    currentCategory=cat;
    currentProduct=null;

    document.getElementById("categoryTitle").innerText=cat;

    showCategory();

    push(
        {page:"category",store,cat},
        `?store=${store}&cat=${cat}`
    );
}


/* ===============================
   OPEN PRODUCT
================================*/

function openProduct(store,cat,prod){

    currentStore=store;
    currentCategory=cat;
    currentProduct=prod;

    showProduct();

    push(
        {page:"product",store,cat,prod},
        `?store=${store}&cat=${cat}&prod=${prod}`
    );
}


/* ===============================
   BACK BUTTON SUPPORT
================================*/

function goStore(){
    history.back();
}

function goCategory(){
    history.back();
}


/* ===============================
   ANDROID BACK BUTTON
================================*/

window.onpopstate=function(e){

    if(!e.state){
        location.reload();
        return;
    }

    const s=e.state;

    if(s.page==="store"){
        showStore();
    }

    if(s.page==="category"){
        document.getElementById("categoryTitle").innerText=s.cat;
        showCategory();
    }

    if(s.page==="product"){
        showProduct();
    }
};


/* ===============================
   PINTEREST DIRECT LINK LOAD
================================*/

window.onload=function(){

    const p=new URLSearchParams(location.search);

    const store=p.get("store");
    const cat=p.get("cat");
    const prod=p.get("prod");

    if(store && cat && prod){
        showStore();
        showCategory();
        showProduct();

        history.replaceState(
            {page:"product",store,cat,prod},
            "",
            location.href
        );
        return;
    }

    if(store && cat){
        showStore();
        showCategory();

        history.replaceState(
            {page:"category",store,cat},
            "",
            location.href
        );
        return;
    }

    if(store){
        showStore();

        history.replaceState(
            {page:"store",store},
            "",
            location.href
        );
    }
};


/* ===============================
   DATA SAVE (WORKING)
================================*/

function saveData(){

    localStorage.setItem(
        "savedProduct",
        currentProduct
    );

    document.getElementById("saveStatus").innerText="Saved ✅";
}