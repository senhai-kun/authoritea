
var milkteaList = document.getElementById("milktea-list");

fetch("https://authoritea-server.vercel.app/product/get_milktea").then( res => res.json() )
.then( res => {
    milkteaList.innerHTML = res.map( data => 
        `
        <tr >
            <td >
                <p class="fw-bold text-capitalize">${data.name}</p>
                <p class="fw-light" >${data.description}</p>
            </td>
            <td class="${data.stock < 5 ? "text-danger" : "text-success"} " >${data.stock}</td>
            <td>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="${data.name}" data-variant="M" value="${data.price.medium}" id="${data.name}-radio-medium" ${data.price.medium === 0 && "disabled"} >
                    <label class="form-check-label" for="${data.name}-radio-medium">
                        ${data.price.medium === 0 ? "N/A" : "₱" + data.price.medium.toFixed(2)}
                    </label>
                </div>
            </td>
            <td>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="${data.name}" data-variant="L" value="${data.price.large}" id="${data.name}-radio-large" ${data.price.large === 0 && "disabled"} >
                    <label class="form-check-label" for="${data.name}-radio-large">
                        ${data.price.large === 0 ? "N/A" : "₱" + data.price.large.toFixed(2)}
                    </label>
                </div>
            </td>
            <td >
                <div class="d-flex gap-2 flex-wrap align-items-center" >
                    <input id="${data.name}" class="form-control  h-100" style="width: 44px;" value="1" /> 

                    <button class="btn btn-primary btn-sm h-100 ${data.stock <= 0 ? "disabled" : ""}" onclick="buy('${data.name}', '${data.type}', '${data.stock}','${data.price.medium.toFixed(2)}', '${data.price.large.toFixed(2)}')" >Buy</button>
                </div>
            </td>
        </tr>
        `).join("")
} )
.catch( e => {
    console.log(e)
} )

var coffeeList = document.getElementById("coffee-list");

fetch("https://authoritea-server.vercel.app/product/get_coffee").then( res => res.json() )
.then( res => {
    coffeeList.innerHTML = res.map( data => 
        `
        <tr  >
            <td >
                <p class="fw-bold text-capitalize">${data.name}</p>
                <p class="fw-light" >${data.description}</p>
            </td>
            <td class="${data.stock < 5 ? "text-danger" : "text-success"} " >${data.stock}</td>
            <td>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="${data.name}" data-variant="M" value="${data.price.medium}" id="${data.name}-radio-medium" ${data.price.medium === 0 && "disabled"} >
                    <label class="form-check-label" for="${data.name}-radio-medium">
                        ${data.price.medium === 0 ? "N/A" : "₱" + data.price.medium.toFixed(2)}
                    </label>
                </div>
            </td>
            <td>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="${data.name}" data-variant="L" value="${data.price.large}" id="${data.name}-radio-large" ${data.price.large === 0 && "disabled"} >
                    <label class="form-check-label" for="${data.name}-radio-large">
                        ${data.price.large === 0 ? "N/A" : "₱" + data.price.large.toFixed(2)}
                    </label>
                </div>
            </td>
            <td >
                <div class="d-flex gap-2 flex-wrap align-items-center" >
                    <input id="${data.name}" class="form-control  h-100" style="width: 44px;" value="1" /> 

                    <button class="btn btn-primary btn-sm h-100" onclick="buy('${data.name}', '${data.type}', '${data.stock}','${data.price.medium.toFixed(2)}', '${data.price.large.toFixed(2)}')" >Buy</button>
                </div>
            </td>
        </tr>
        `).join("")
} )
.catch( e => {

    console.log(e)
} )

var snackList = document.getElementById("snack-list");

fetch("https://authoritea-server.vercel.app/product/get_snack").then( res => res.json() )
.then( res => {
    snackList.innerHTML = res.map( data => 
        `
        <tr  >
            <td >
                <p class="fw-bold text-capitalize">${data.name}</p>
                <p class="fw-light" >${data.description}</p>
            </td>
            <td class="${data.stock < 5 ? "text-danger" : "text-success"} " >${data.stock}</td>
            <td>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="${data.name}" data-variant="M" value="${data.price.medium}" id="${data.name}-radio-medium" ${data.price.medium === 0 && "disabled"} >
                    <label class="form-check-label" for="${data.name}-radio-medium">
                        ${data.price.medium === 0 ? "N/A" : "₱" + data.price.medium.toFixed(2)}
                    </label>
                </div>
            </td>
            <td>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="${data.name}" data-variant="L" value="${data.price.large}" id="${data.name}-radio-large" ${data.price.large === 0 && "disabled"} >
                    <label class="form-check-label" for="${data.name}-radio-large">
                        ${data.price.large === 0 ? "N/A" : "₱" + data.price.large.toFixed(2)}
                    </label>
                </div>
            </td>
            <td >
                <div class="d-flex gap-2 flex-wrap align-items-center" >
                    <input id="${data.name}" class="form-control  h-100" style="width: 44px;" value="1" /> 

                    <button class="btn btn-primary btn-sm h-100" onclick="buy('${data.name}', '${data.type}',  '${data.stock}','${data.price.medium.toFixed(2)}', '${data.price.large.toFixed(2)}')" >Buy</button>
                </div>
            </td>
        </tr>
        `).join("")
} )
.catch( e => {

    console.log(e)
} )

let order = []

var totalItems = document.getElementById("total-items");
var totalCost = document.getElementById("total-cost");
var placeOrderBtn = document.getElementById("place-order-btn");

// disable place order btn when order is 0
if( order.length === 0 ) {
    placeOrderBtn.setAttribute("class", "btn btn-outline-secondary disabled  w-100 mb-3")
}

function buy(name, type, stock) {
    let qty = document.getElementById(name).value;

    qty = Number(qty)

    if( qty <= Number(stock) && qty > 0 ) { // qty needs to be lower or equal to available stocks

        var price = document.querySelector(`input[name="${name}"]:checked`);
        var itemPrice = Number(price.value);
        var variant = price.getAttribute("data-variant");
    
        let subtotal = itemPrice * qty
    
        let itemToUpdate = order.find( data => data.name === name && data.itemPrice === itemPrice ) // find existing product
        
        // look if item exist already
        if(itemToUpdate !== undefined) {
            let index = order.findIndex( data => data.name === name && data.itemPrice === itemPrice ) // get product index
    
            if( qty < 1 ) {
                // if qty is lower than 1 then remove the item
                order.filter( i => i.name !== name );
            } else {
                // update the qty of item
                let updateQty =  Number(qty); 
                let updateSubtotal = Number(itemToUpdate.itemPrice) * updateQty; 
        
                itemToUpdate.qty = updateQty;
                itemToUpdate.subtotal = updateSubtotal;
        
                order[index] = itemToUpdate; // insert the updated data
            }
    
        } else {
            order.push({name, type, qty, stock, variant, itemPrice, subtotal})
        }
    
    
        totalItems.innerHTML = getTotalItems();
    
        totalCost.innerHTML = `₱${getTotalCost()}`;
    
        updateOrderList()
    } 

   
}

var totalOrderModal = document.getElementById("total-order-modal");
var submitOrderBtn = document.getElementById("submit-order-btn");
var payBtn = document.getElementById("pay-btn");
var change = document.getElementById("change");

function placeOrder(){  
    totalOrderModal.innerHTML = `₱${getTotalCost()}`;
}

function pay() {
    let payment = document.getElementById("payment").value;
    payment = Number(payment).toFixed(2);
    let totalCost = getTotalCost();

    console.log("total", payment, totalCost, 85);

    if( payment >= Number(totalCost) ) {
        let changeAmount = payment - totalCost;

        payBtn.setAttribute("class", "btn btn-secondary disabled w-100");

        change.setAttribute("class", "d-flex justify-content-between mb-4 ");
        change.innerHTML =  `
            <h4 class="fw-bold">Change: </h4>
            <h4 class="fw-bold">₱${changeAmount.toFixed(2)}</h4>
        `

        submitOrderBtn.setAttribute("class", "btn btn-primary");

    } else {
        // alert payment
        change.setAttribute("class", "mb-4 text-danger text-center fw-bold");
        change.innerText = "Payment should not be lower than total order!";
        
    }  

}


async function submitOrder() {
    console.log({order, totalCost: getTotalCost(), username: localStorage.getItem("username") });

    submitOrderBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...`;

    let data = { 
        order, 
        totalCost: getTotalCost(), 
        username: localStorage.getItem("username"),
        orderDateTime: new Date().toLocaleString()
    }

    await fetch("https://authoritea-server.vercel.app/order/submit_order", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then( res => res.json() )
    .then( res => console.log(res) )
    .catch( e => console.log(e) )

    setTimeout( () => {
        window.location.reload(); // refresh the browser
    }, 1000 )
}


var orderList = document.getElementById("order-list");

function updateOrderList() {

    placeOrderBtn.setAttribute("class", "btn btn-outline-primary w-100 mb-3")
    
    console.log(order);

    orderList.innerHTML = order.map( data => `
        <tr>
            <td scope="col">
                <div>
                    <p>${data.name} - ${data.variant}</p>
                    <p>₱${data.itemPrice}</p>
                </div>
            </td>
            <td class="text-end" >${data.qty}</td>
            <td class="text-end" >${data.subtotal}</td>
        </tr> 
    ` ).join("")
}

function clearOrder() {
    order = [];

    window.location.reload(); // reset the whole page

    placeOrderBtn.setAttribute("class", "btn btn-secondary disabled  w-100 mb-3"); // disable place order btn
    orderList.innerHTML = "";
    totalItems.innerHTML = 0;
    totalCost.innerHTML = `₱${0.00}`;
}

function closeOrderModal() {
    payBtn.setAttribute("class", "btn btn-primary w-100");
    submitOrderBtn.setAttribute("class", "btn btn-secondary disabled");
}

// get total cost
function getTotalCost() {
    
    let totalItemCost = order.map( i => parseFloat(i.subtotal) ) // get item subtotal and store to array convert string to float
    let total = 0;
    totalItemCost.forEach( i => total += i ) // get total on array

    return Number(total).toFixed(2);
}

// get total items
function getTotalItems() {
    // get total qty 
    let totalItemQty = order.map( i => parseInt(i.qty) ) // get item qty and store to array convert string to float
    let qty = 0;
    totalItemQty.forEach( i => qty += i ) // get sum on array

    return qty;
}




