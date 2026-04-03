const GITHUB_URL = "https://raw.githubusercontent.com/vennanagireddy52-eng/Mystore/main/store-data.json";
let data = { IND:{}, US:{}, META:{ IND:{}, US:{} } };
let curStore = "", curCat = "", clickTimer, clickCount = 0;

// 1. 🛡️ NAVIGATION ENGINE
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.layer) {
        showLayer(event.state.layer, false);
    } else {
        showLayer('storeLayer', false);
    }
});

function showLayer(id, pushToHistory = true) {
    document.querySelectorAll('.layer').forEach(l => l.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) {
        target.classList.add('active');
        target.scrollTop = 0;
        const backBtn = target.querySelector('.back-icon');
        if (backBtn) backBtn.style.display = (id === 'storeLayer') ? 'none' : 'flex';
    }
    if (pushToHistory) history.pushState({ layer: id }, "");
}

// 2. 🚀 INITIALIZE
async function init() {
    try {
        const res = await fetch(GITHUB_URL + "?v=" + Date.now());
        data = await res.json();
    } catch (e) {
        data = JSON.parse(localStorage.getItem('storeData')) || { IND:{}, US:{}, META:{IND:{}, US:{}} };
    }
    if(!data.META) data.META = { IND:{}, US:{} };

    const p = new URLSearchParams(window.location.search);
    const s = p.get('store'), c = p.get('cat'), pid = p.get('prod');

    if (s && data[s]) {
        curStore = s; renC();
        if (c && data[s][c]) {
            curCat = c; renP(pid);
            history.replaceState({ layer: 'storeLayer' }, "");
            history.pushState({ layer: 'catLayer' }, "");
            showLayer('pLayer', true); 
        } else {
            showLayer('catLayer', true);
        }
    } else {
        history.replaceState({ layer: 'storeLayer' }, "");
        showLayer('storeLayer', false);
    }
    syncUI();
}

// 3. 🏬 STORE & CATEGORY LOGIC
function hStore(s) {
    clickCount++;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
        if (clickCount >= 3) {
            let pin = prompt("Admin Pin:");
            if (pin === "1234") document.getElementById('adminPanel').classList.add('active');
        } else {
            curStore = s; 
            renC(); 
            showLayer('catLayer');
            gtag('event', 'select_store', {'store': s});
        }
        clickCount = 0;
    }, 300);
}

function openC(c) { 
    curCat = c; 
    renP(); 
    showLayer('pLayer'); 
    gtag('event','view_cat',{'cat':c});
}

function renC() {
    const g = document.getElementById('catGrid'); g.innerHTML = "";
    document.getElementById('stTitle').innerText = curStore === "IND" ? "India Store" : "US Store";
    Object.keys(data[curStore] || {}).forEach(c => {
        const img = (data.META[curStore] && data.META[curStore][c]?.img) || (data[curStore][c][0]?.img);
        g.innerHTML += `<div class="card" onclick="openC('${c}')"><img src="${getImg(img)}"><div class="info"><b>${c}</b></div></div>`;
    });
}

function renP(scrollToId = null) {
    const g = document.getElementById('pGrid'); g.innerHTML = "";
    document.getElementById('ctTitle').innerText = curCat;
    if(!data[curStore] || !data[curStore][curCat]) return;
    data[curStore][curCat].forEach(p => {
        const share = `${location.origin}${location.pathname}?store=${curStore}&cat=${encodeURIComponent(curCat)}&prod=${p.id}`;
        g.innerHTML += `
        <div class="card" id="${p.id}">
            <button class="link-symbol" onclick="cp('${share}',event)">🔗</button>
            <img src="${getImg(p.img)}" onclick="window.open('${p.link}','_blank');gtag('event','p_view',{'name':'${p.name}'});">
            <div class="info">
                <b>${p.name}</b>
                <span class="price">${p.price}</span>
            </div>
            <a class="buy-btn" href="${p.link}" target="_blank">Buy Now</a>
        </div>`;
    });
    if(scrollToId) setTimeout(() => document.getElementById(scrollToId)?.scrollIntoView({behavior:'smooth', block:'center'}), 800);
}

function getImg(u) {
    if(!u) return "https://via.placeholder.com/300x200?text=No+Image";
    return `https://images.weserv.nl/?url=${encodeURIComponent(u)}&w=400&q=80`;
}

function cp(txt, e) {
    e.stopPropagation();
    navigator.clipboard.writeText(txt);
    const t = document.getElementById('toast');
    t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 2000);
}

// 4. ⚙️ ADMIN PANEL FUNCTIONS
function closeAdmin() { document.getElementById('adminPanel').classList.remove('active'); }

function syncUI() {
    const s = document.getElementById('manageStore').value;
    const cSel = document.getElementById('editCatSelect'), pCSel = document.getElementById('pCatSel');
    let h = '<option value="">-- Select --</option>';
    if(data[s]) Object.keys(data[s]).forEach(c => h += `<option value="${c}">${c}</option>`);
    cSel.innerHTML = h; pCSel.innerHTML = h;
}

function syncPList() {
    const s = document.getElementById('manageStore').value, c = document.getElementById('pCatSel').value;
    const pSel = document.getElementById('editPSel'); pSel.innerHTML = '<option value="">-- New Product --</option>';
    if(c && data[s][c]) data[s][c].forEach(p => pSel.innerHTML += `<option value="${p.id}">${p.name}</option>`);
}

function loadCat() {
    const s = document.getElementById('manageStore').value, c = document.getElementById('editCatSelect').value;
    document.getElementById('catInp').value = c;
    document.getElementById('catImgInp').value = (data.META[s] && data.META[s][c]) ? (data.META[s][c].img || "") : "";
}

function saveCat() {
    const s = document.getElementById('manageStore').value, oldC = document.getElementById('editCatSelect').value, newC = document.getElementById('catInp').value;
    if(!newC) return;
    if(!data[s]) data[s] = {};
    if(oldC && oldC !== newC) { data[s][newC] = data[s][oldC]; delete data[s][oldC]; }
    if(!data[s][newC]) data[s][newC] = [];
    if(!data.META[s]) data.META[s] = {};
    data.META[s][newC] = { img: document.getElementById('catImgInp').value };
    localStorage.setItem('storeData', JSON.stringify(data));
    syncUI(); alert("Category Saved Locally!");
}

function deleteCat() {
    const s = document.getElementById('manageStore').value, c = document.getElementById('editCatSelect').value;
    if(c && confirm("Delete Category?")) { delete data[s][c]; localStorage.setItem('storeData', JSON.stringify(data)); syncUI(); }
}

function loadP() {
    const s = document.getElementById('manageStore').value, c = document.getElementById('pCatSel').value, pid = document.getElementById('editPSel').value;
    if(!pid) { ["pName", "pDesc", "pPrice", "pImg", "pLink"].forEach(i => document.getElementById(i).value = ""); return; }
    const p = data[s][c].find(x => x.id == pid);
    document.getElementById("pName").value = p.name; document.getElementById("pDesc").value = p.desc;
    document.getElementById("pPrice").value = p.price; document.getElementById("pImg").value = p.img;
    document.getElementById("pLink").value = p.link;
}

function saveP() {
    const s = document.getElementById('manageStore').value, c = document.getElementById('pCatSel').value, pid = document.getElementById('editPSel').value;
    if(!c) return alert("Select Category!");
    const pObj = { id: pid || Date.now(), name: document.getElementById("pName").value, desc: document.getElementById("pDesc").value, price: document.getElementById("pPrice").value, img: document.getElementById("pImg").value, link: document.getElementById("pLink").value };
    if(!pid) data[s][c].push(pObj);
    else { const idx = data[s][c].findIndex(x => x.id == pid); data[s][c][idx] = pObj; }
    localStorage.setItem('storeData', JSON.stringify(data));
    syncPList(); alert("Product Saved Locally!");
}

function deleteP() {
    const s = document.getElementById('manageStore').value, c = document.getElementById('pCatSel').value, pid = document.getElementById('editPSel').value;
    if(pid && confirm("Delete Product?")) { data[s][c] = data[s][c].filter(x => x.id != pid); localStorage.setItem('storeData', JSON.stringify(data)); syncPList(); }
}

function copyForGithub() {
    const blob = new Blob([JSON.stringify(data, null, 2)], {type : 'application/json'});
    const el = document.createElement('textarea');
    el.value = JSON.stringify(data, null, 2);
    document.body.appendChild(el); el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert("Data copied! Paste this into your store-data.json on GitHub.");
}

window.onload = init;
