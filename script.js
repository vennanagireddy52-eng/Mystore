const GITHUB_URL = "https://raw.githubusercontent.com/vennanagireddy52-eng/Mystore/main/store-data.json";
let data = { IND:{}, US:{}, META:{ IND:{}, US:{} } };
let curStore = "", curCat = "", clickTimer, clickCount = 0;

// 1. 🛡️ THE NAVIGATION ENGINE (Handles the Back Button)
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.layer) {
        // Switch to the layer saved in history
        showLayer(event.state.layer, false);
    } else {
        // Default back to the main store selection
        showLayer('storeLayer', false);
    }
});

// 2. 📺 LAYER CONTROLLER
function showLayer(id, pushToHistory = true) {
    // Hide all layers
    document.querySelectorAll('.layer').forEach(l => l.classList.remove('active'));
    
    // Show the target layer
    const target = document.getElementById(id);
    if (target) {
        target.classList.add('active');
        target.scrollTop = 0;
        
        // Hide back arrow on the very first screen
        const backBtn = target.querySelector('.back-icon');
        if (backBtn) backBtn.style.display = (id === 'storeLayer') ? 'none' : 'flex';
    }

    // Add this move to the browser history
    if (pushToHistory) {
        history.pushState({ layer: id }, "");
    }
}

// 3. 🚀 INITIALIZE & PINTEREST FLOW
async function init() {
    try {
        const res = await fetch(GITHUB_URL + "?v=" + Date.now());
        data = await res.json();
    } catch (e) {
        data = JSON.parse(localStorage.getItem('storeData')) || { IND:{}, US:{} };
    }

    // Capture URL parameters (Pinterest deep links)
    const p = new URLSearchParams(window.location.search);
    const s = p.get('store'), c = p.get('cat'), pid = p.get('prod');

    if (s && data[s]) {
        curStore = s; renC();
        if (c && data[s][c]) {
            curCat = c; renP(pid);
            
            // --- THE 3-CLICK BACK FIX ---
            // We manually build the stack: Store -> Category -> Product
            history.replaceState({ layer: 'storeLayer' }, "");
            history.pushState({ layer: 'catLayer' }, "");
            showLayer('pLayer', true); 
        } else {
            showLayer('catLayer', true);
        }
    } else {
        // If no link, just show the home screen
        history.replaceState({ layer: 'storeLayer' }, "");
        showLayer('storeLayer', false);
    }
    if(typeof syncUI === 'function') syncUI();
}

// 4. 🏬 STORE SELECTION
function hStore(s) {
    curStore = s; 
    renC(); 
    showLayer('catLayer'); // This opens the categories
}

// 5. 📂 CATEGORY SELECTION
function openC(c) { 
    curCat = c; 
    renP(); 
    showLayer('pLayer'); // This opens the products
}

// 6. 🖼️ IMAGE HELPER
function getImg(u) {
    if(!u) return "https://via.placeholder.com/300x200?text=No+Image";
    return `https://images.weserv.nl/?url=${encodeURIComponent(u)}&w=400&q=80`;
}

// --- RENDERING FUNCTIONS ---
function renC() {
    const g = document.getElementById('catGrid'); 
    g.innerHTML = "";
    document.getElementById('stTitle').innerText = curStore === "IND" ? "India Store" : "US Store";
    
    Object.keys(data[curStore] || {}).forEach(c => {
        const img = (data.META[curStore] && data.META[curStore][c]?.img) || "https://via.placeholder.com/150";
        g.innerHTML += `<div class="card" onclick="openC('${c}')"><img src="${getImg(img)}"><div class="info"><b>${c}</b></div></div>`;
    });
}

function renP(scrollToId = null) {
    const g = document.getElementById('pGrid'); 
    g.innerHTML = "";
    document.getElementById('ctTitle').innerText = curCat;
    
    data[curStore][curCat].forEach(p => {
        const share = `${location.origin}${location.pathname}?store=${curStore}&cat=${encodeURIComponent(curCat)}&prod=${p.id}`;
        g.innerHTML += `
        <div class="card" id="${p.id}">
            <button class="link-symbol" onclick="cp('${share}',event)">🔗</button>
            <img src="${getImg(p.img)}" onclick="window.open('${p.link}','_blank')">
            <div class="info">
                <b>${p.name}</b>
                <span class="price">${p.price}</span>
            </div>
            <a class="buy-btn" href="${p.link}" target="_blank">Buy Now</a>
        </div>`;
    });
    if(scrollToId) setTimeout(() => document.getElementById(scrollToId)?.scrollIntoView({behavior:'smooth', block:'center'}), 500);
}

// Start the app
window.onload = init;
