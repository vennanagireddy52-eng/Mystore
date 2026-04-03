const GITHUB_URL = "https://raw.githubusercontent.com/vennanagireddy52-eng/Mystore/main/store-data.json";
let data = { IND:{}, US:{}, META:{ IND:{}, US:{} } };
let curStore = "", curCat = "", clickTimer, clickCount = 0;

// 🛡️ PINTEREST BACK-BUTTON NAVIGATION LOGIC
window.addEventListener('popstate', e => {
    if (e.state && e.state.layer) {
        renderLayer(e.state.layer, false);
    } else {
        renderLayer('storeLayer', false);
    }
});

function renderLayer(id, push = true) {
    document.querySelectorAll('.layer').forEach(l => l.classList.remove('active'));
    const target = document.getElementById(id);
    if(target) {
        target.classList.add('active');
        target.scrollTop = 0;
        // Show back icon only if not on the main store selection
        target.querySelectorAll('.back-icon').forEach(btn => {
            btn.style.display = (id === 'storeLayer') ? 'none' : 'flex';
        });
    }
    // Push state so mobile back button works correctly
    if(push) history.pushState({layer: id}, "");
}

// 🚀 INITIALIZE STORE
async function init() {
    try {
        const res = await fetch(GITHUB_URL + "?v=" + Date.now());
        data = await res.json();
    } catch (e) {
        console.warn("Using offline data");
        data = JSON.parse(localStorage.getItem('storeData')) || { IND:{}, US:{} };
    }

    // Set root history state
    history.replaceState({layer: 'storeLayer'}, "");
    
    // Check URL for Deep Linking (from Pinterest)
    const p = new URLSearchParams(window.location.search);
    const s = p.get('store'), c = p.get('cat'), pid = p.get('prod');
    
    if (s && data[s]) {
        curStore = s; renC();
        if (c && data[s][c]) { 
            curCat = c; renP(pid); 
            // THE TRICK: Manually build the history stack so "Back" goes step-by-step
            renderLayer('catLayer', true); 
            renderLayer('pLayer', true);   
        } else {
            renderLayer('catLayer', true);
        }
    } else {
        renderLayer('storeLayer', false);
    }
}

// 🏬 RENDER CATEGORIES
function renC() {
    const g = document.getElementById('catGrid'); g.innerHTML = "";
    document.getElementById('stTitle').innerText = curStore === "IND" ? "India Store" : "US Store";
    
    Object.keys(data[curStore] || {}).forEach(c => {
        const img = (data.META[curStore] && data.META[curStore][c]?.img) || "https://via.placeholder.com/150";
        g.innerHTML += `
            <div class="card" onclick="openC('${c}')">
                <img src="${getImg(img)}">
                <div class="info"><b>${c}</b></div>
            </div>`;
    });
}

// 📦 RENDER PRODUCTS
function renP(scrollToId = null) {
    const g = document.getElementById('pGrid'); g.innerHTML = "";
    document.getElementById('ctTitle').innerText = curCat;
    
    data[curStore][curCat].forEach(p => {
        const share = `${location.origin}${location.pathname}?store=${curStore}&cat=${encodeURIComponent(curCat)}&prod=${p.id}`;
        g.innerHTML += `
            <div class="card" id="${p.id}">
                <button class="link-symbol" onclick="cp('${share}',event)">🔗</button>
                <img src="${getImg(p.img)}" onclick="window.open('${p.link}','_blank')">
                <div class="info">
                    <b>${p.name}</b>
                    <div class="p-desc">${p.desc || ""}</div>
                    <span class="price">${p.price}</span>
                </div>
                <a class="buy-btn" href="${p.link}" target="_blank">Buy Now</a>
            </div>`;
    });

    if(scrollToId) {
        setTimeout(() => {
            document.getElementById(scrollToId)?.scrollIntoView({behavior:'smooth', block:'center'});
        }, 500);
    }
}

// 🛠️ UTILITIES
function openC(c) { curCat = c; renP(); renderLayer('pLayer'); }

function getImg(u) {
    if(!u) return "https://via.placeholder.com/300";
    return `https://images.weserv.nl/?url=${encodeURIComponent(u)}&w=400&q=80`;
}

function cp(txt, e) {
    e.stopPropagation();
    navigator.clipboard.writeText(txt);
    const t = document.getElementById('toast');
    t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 2000);
}

// Run init on load
window.onload = init;
