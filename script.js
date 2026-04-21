const GITHUB_URL = "https://raw.githubusercontent.com/vennanagireddy52-eng/Mystore/main/store-data.json";
let data = { IND:{}, US:{}, META:{ IND:{}, US:{} } };
let curStore = "", curCat = "", cc = 0;

function showToast(m) { const t = document.getElementById('toast'); t.innerText = m; t.style.display='block'; setTimeout(()=>t.style.display='none', 2000); }

// --- FIXED: Amazon US Redirect (Cache Buster) ---
function fastRedirect(url) { 
    if(!url) return;
    const time = new Date().getTime();
    const separator = url.includes('?') ? '&' : '?';
    const freshUrl = url + separator + 'cb=' + time;
    window.location.replace(freshUrl); 
}

// --- FIXED: JSON Safety ---
const safe = (str) => str.replace(/"/g, '\\"').trim();

async function init() {
    const local = localStorage.getItem('storeData');
    if(local) data = JSON.parse(local);
    try {
        const res = await fetch(GITHUB_URL + "?v=" + Date.now());
        if(res.ok) { data = await res.json(); localStorage.setItem('storeData', JSON.stringify(data)); }
    } catch (e) { console.warn("Using local data"); }
    if(!data.META) data.META = { IND:{}, US:{} };
    syncUI();
    document.getElementById('loader').style.display = 'none';
}

function saveP() {
    const s = document.getElementById('manageStore').value, c = document.getElementById('pCatSel').value, id = document.getElementById('editPSel').value;
    if(!c) return alert("Select Category!");
    
    let u = document.getElementById('pImg').value.trim();
    if(u.includes("amazon") && u.includes("/I/")) {
        try { let idPart = u.split("/I/")[1].split(".")[0]; u = `https://m.media-amazon.com/images/I/${idPart}.jpg`; } catch(e) { u = u.split('?')[0]; }
    }

    let p = { id: id || "p"+Date.now(), name: safe(document.getElementById('pName').value), price: safe(document.getElementById('pPrice').value), img: u, link: document.getElementById('pLink').value.trim() };
    if(id) { const i = data[s][c].findIndex(x=>x.id===id); data[s][c][i]=p; } else { if(!data[s][c]) data[s][c] = []; data[s][c].push(p); }
    localStorage.setItem('storeData', JSON.stringify(data)); 
    syncPList(); if(curCat === c) renP();
    showToast("Product Saved!");
}

function renC() {
    const g = document.getElementById('catGrid'); g.innerHTML = "";
    if(!data[curStore]) return;
    Object.keys(data[curStore]).forEach(c => {
        const img = (data.META && data.META[curStore] && data.META[curStore][c]?.img) || data[curStore][c][0]?.img;
        g.innerHTML += `<div class="card" onclick="openC('${c}')"><img src="${img || 'https://via.placeholder.com/150'}" onerror="fixImg(this)"><div class="info"><b>${c}</b></div></div>`;
    });
}

function renP() {
    const g = document.getElementById('pGrid'); g.innerHTML = "";
    if(!data[curStore] || !data[curStore][curCat]) return;
    data[curStore][curCat].forEach(p => {
        g.innerHTML += `
        <div class="card" id="${p.id}">
            <button class="link-symbol" onclick="navigator.clipboard.writeText(location.href); showToast('Link Copied!'); event.stopPropagation();">🔗</button>
            <div onclick="fastRedirect('${p.link}')">
                <img src="${p.img}" onerror="fixImg(this)">
                <div class="info"><b>${p.name}</b><span class="price">${p.price}</span></div>
            </div>
            <div class="buy-btn" onclick="fastRedirect('${p.link}')">Buy Now</div>
        </div>`;
    });
}

// --- REMAINING FUNCTIONS (Keep these as they were) ---
function syncUI() { /* ...Your existing code... */ }
function syncPList() { /* ...Your existing code... */ }
function loadCat() { /* ...Your existing code... */ }
function saveCat() { /* ...Your existing code... */ }
function loadP() { /* ...Your existing code... */ }
function hSec(s) { cc++; setTimeout(() => { if(cc >= 3) { if(prompt("Pin:") === "1234") document.getElementById('adminPanel').classList.add('active'); } else if(cc === 1) { curStore = s; renC(); showLayer('catLayer'); } cc = 0; }, 400); }
function openC(c) { curCat = c; renP(); showLayer('pLayer'); }
function fixImg(el) { el.src = "https://via.placeholder.com/300x200?text=Reload+Page"; }
function filterItems(gridId, val) { const q = val.toLowerCase(); document.querySelectorAll(`#${gridId} .card`).forEach(c => c.style.display = c.innerText.toLowerCase().includes(q) ? "block" : "none"); }
function closeAdmin() { document.getElementById('adminPanel').classList.remove('active'); }
function deletePManual() { /* ...Your existing code... */ }
// Fix the history issue:
function showLayer(id) { document.querySelectorAll('.layer').forEach(l => l.classList.remove('active')); document.getElementById(id).classList.add('active'); }
window.onload = init;
