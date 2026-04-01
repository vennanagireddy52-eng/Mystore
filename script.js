
const GITHUB_URL = "https://raw.githubusercontent.com/vennanagireddy52-eng/Mystore/main/store-data.json";
let data = { IND:{}, US:{}, META:{ IND:{}, US:{} } };
let curStore = "", curCat = "", cc = 0;

function getImg(u) {
    if(!u) return "https://via.placeholder.com/300x200?text=No+Image";
    return `https://images.weserv.nl/?url=${encodeURIComponent(u)}&default=https://via.placeholder.com/300x200?text=Error`;
}

// --- 1. THE NAVIGATION ENGINE (PHYSICAL BACK BUTTON FIX) ---

function show(id, push = true) {
    // Hide all layers, show the target one
    document.querySelectorAll('.layer').forEach(l => l.classList.remove('active'));
    document.getElementById(id).classList.add('active');

    // If we are moving FORWARD, we add a "breadcrumb" to the phone's history
    if (push) {
        window.history.pushState({ layer: id }, "");
    }
}

// This handles the Physical Android Back Button (Triangle)
window.onpopstate = function(event) {
    if (event.state && event.state.layer) {
        // Go to the previous layer without adding a new history entry
        show(event.state.layer, false);
    } else {
        // If no history left, it will naturally exit the site or go to storeLayer
        show('storeLayer', false);
    }
};

// --- 2. INITIALIZATION ---

async function init() {
    try {
        const res = await fetch(GITHUB_URL + "?v=" + Date.now());
        const cloud = await res.json();
        if(cloud && cloud.IND) data = cloud;
    } catch (e) {
        data = JSON.parse(localStorage.getItem('storeData')) || { IND:{}, US:{}, META:{ IND:{}, US:{} } };
    }
    if(!data.META) data.META = { IND:{}, US:{} };
    
    // Set the starting point in the phone's history
    window.history.replaceState({ layer: 'storeLayer' }, "");
    
    saveLoc(); 
    syncUI(); 
    checkLink();
}

// --- 3. RENDERING & CLICKS ---

function hSec(s) {
    cc++;
    setTimeout(() => {
        if(cc >= 3) {
            if(prompt("Admin Pin:") === "1234") document.getElementById('adminPanel').classList.add('active');
        } else if(cc === 1) {
            curStore = s;
            renC();
            show('catLayer'); // This triggers the history push
        }
        cc = 0;
    }, 400);
}

function openC(c) {
    curCat = c;
    renP();
    show('pLayer'); // This triggers the history push
}

function renC() {
    const g = document.getElementById('catGrid'); g.innerHTML = "";
    document.getElementById('stTitle').innerText = curStore === "IND" ? "India Store" : "US Store";
    Object.keys(data[curStore]).forEach(c => {
        const img = (data.META[curStore] && data.META[curStore][c]) ? data.META[curStore][c].img : (data[curStore][c][0]?.img);
        g.innerHTML += `<div class="card" onclick="openC('${c}')"><img src="${getImg(img)}"><div class="info"><b>${c}</b></div></div>`;
    });
}

function renP() {
    const g = document.getElementById('pGrid'); g.innerHTML = "";
    document.getElementById('ctTitle').innerText = curCat;
    (data[curStore][curCat] || []).forEach(p => {
        g.innerHTML += `<div class="card">
            <img src="${getImg(p.img)}">
            <div class="info"><b>${p.name}</b><span class="price">${p.price}</span></div>
            <a class="buy-btn" href="${p.link}" target="_blank">View Product</a>
        </div>`;
    });
}

// --- 4. ADMIN & UTILS ---

function saveLoc() { localStorage.setItem('storeData', JSON.stringify(data)); }
function syncUI() { /* Your existing sync code */ }
function copyForGithub() { navigator.clipboard.writeText(JSON.stringify(data,null,2)); alert("Copied!"); }
function closeAdmin() { document.getElementById('adminPanel').classList.remove('active'); }
function checkLink() {
    const p = new URLSearchParams(location.search);
    const s = p.get('store'), c = p.get('cat');
    if(s && data[s]) {
        curStore = s; renC(); show('catLayer', false);
        if(c && data[s][c]) { curCat = c; renP(); show('pLayer', false); }
    }
}

window.onload = init;
