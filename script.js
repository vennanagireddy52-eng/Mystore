/* =====================================
   MYSTORE FINAL APP.JS
   Router + Pinterest Back Navigation
===================================== */


/* -------------------------------
   STORE DATA (example)
--------------------------------*/
const storeData = {
    Tech:[
        {id:"p1",name:"Wireless Earbuds"},
        {id:"p2",name:"Bluetooth Mouse"}
    ],
    Fashion:[
        {id:"p3",name:"Men Shirt"}
    ]
};


/* -------------------------------
   HELPERS
--------------------------------*/
function qs(){
    return new URLSearchParams(location.search);
}

function fromPinterest(){
    const ref=document.referrer.toLowerCase();
    const ua=navigator.userAgent.toLowerCase();

    return (
        ref.includes("pinterest") ||
        ref.includes("pin.it") ||
        ua.includes("pinterest")
    );
}


/* -------------------------------
   RENDER ROUTER
--------------------------------*/
function render(){

    const params = qs();

    const store = params.get("store");
    const cat   = params.get("cat");
    const prod  = params.get("prod");

    const app   = document.getElementById("app");
    const title = document.getElementById("pageTitle");


    /* ===== STORE PAGE ===== */
    if(!cat && !prod){

        title.innerText="Store";

        app.innerHTML=`
        <div class="card">
            <a href="?store=IND&cat=Tech">Tech</a>
        </div>

        <div class="card">
            <a href="?store=IND&cat=Fashion">Fashion</a>
        </div>`;
        return;
    }


    /* ===== CATEGORY PAGE ===== */
    if(cat && !prod){

        title.innerText=cat+" Category";

        let html="";

        storeData[cat].forEach(p=>{
            html+=`
            <div class="card">
                <a href="?store=IND&cat=${cat}&prod=${p.id}">
                    ${p.name}
                </a>
            </div>`;
        });

        app.innerHTML=html;
        return;
    }


    /* ===== PRODUCT PAGE ===== */
    if(prod){

        title.innerText="Product";

        app.innerHTML=`
        <div class="card">
            <h3>Product ID: ${prod}</h3>
            <p>Opened from Pinterest</p>
        </div>`;


        /* ===========================
           PINTEREST NAVIGATION FIX
        ============================ */

        if(fromPinterest() &&
           !sessionStorage.getItem("pinLayers")){

            sessionStorage.setItem("pinLayers","1");

            /* product layer */
            history.replaceState(
                {page:"product"},
                "",
                `?store=${store}&cat=${cat}&prod=${prod}`
            );

            /* category layer */
            history.pushState(
                {page:"category"},
                "",
                `?store=${store}&cat=${cat}`
            );

            /* store layer */
            history.pushState(
                {page:"store"},
                "",
                `?store=${store}`
            );
        }

        return;
    }
}


/* -------------------------------
   BACK BUTTON CONTROLLER
--------------------------------*/
window.onpopstate = function(e){

    const params = qs();

    if(e.state && e.state.page==="category"){
        params.delete("prod");
        history.replaceState({}, "", "?"+params.toString());
        render();
        return;
    }

    if(e.state && e.state.page==="store"){
        params.delete("prod");
        params.delete("cat");
        history.replaceState({}, "", "?"+params.toString());
        render();
        return;
    }

    render();
};


/* -------------------------------
   INITIAL LOAD
--------------------------------*/
render();