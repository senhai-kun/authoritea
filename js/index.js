
var bestList = document.getElementById("best-seller-list");

fetch("https://authoritea-server.vercel.app/product/best_sellers").then( res => res.json() )
.then( res => {
    bestList.innerHTML = res.map( data => `
        <div class="d-flex justify-content-between mb-3 " >
            <div class="">
                <h5 class="m-0 p-0 text-capitalize" >
                    ${data.name}
                </h5>
                <p class="fw-light ">${data.description}</p>
            </div>

            <div class="d-flex gap-3 align-items-center " >
                <p class="text-primary text-nowrap  ${data.price.medium === 0 ? "d-none" : "" } " >M-${data.price.medium}</p>
        
                <p class="text-primary text-nowrap  ${data.price.large === 0 ? "d-none" : "" }" >L-${data.price.large}</p>
            </div>
        </div>
    ` ).join("")
} )
.catch( e => {
    window.location.reload()
} )


var milkteaList = document.getElementById("milktea-list");

fetch("https://authoritea-server.vercel.app/product/get_milktea").then( res => res.json() )
.then( res => {
    milkteaList.innerHTML = res.map( data => `
        <div class="d-flex justify-content-between mb-3 text-capitalize" >
            <div class="">
                <h5 class="m-0 p-0 text-capitalize" >${data.name}</h5>
                <p class="fw-light">${data.description}</p>
            </div>

            <div class="d-flex gap-3 align-items-center " >
                <p class="text-primary text-nowrap  ${data.price.medium === 0 ? "d-none" : "" } " >M-${data.price.medium}</p>
        
                <p class="text-primary text-nowrap  ${data.price.large === 0 ? "d-none" : "" }" >L-${data.price.large}</p>
            </div>
        </div>
    ` ).join("")
} )
.catch( e => {
    window.location.reload()
} )

var snackteaList = document.getElementById("snack-list");

fetch("https://authoritea-server.vercel.app/product/get_snack").then( res => res.json() )
.then( res => {
    snackteaList.innerHTML = res.map( data => `
        <div class="d-flex justify-content-between mb-3 text-capitalize" >
            <div class="">
                <h5 class="m-0 p-0" >${data.name}</h5>
                <p class="fw-light">${data.description}</p>
            </div>

            <div class="d-flex gap-3 align-items-center " >
                <p class="text-primary text-nowrap  ${data.price.medium === 0 ? "d-none" : "" } " >M-${data.price.medium}</p>
        
                <p class="text-primary text-nowrap  ${data.price.large === 0 ? "d-none" : "" }" >L-${data.price.large}</p>
            </div>
        </div>
    ` ).join("")
} )
.catch( e => {
    window.location.reload()
} )