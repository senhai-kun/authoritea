var milkteaList = document.getElementById("milktea-list");
let assamMilkTeaPromo;
let milkteaInventory;

fetch("https://authoritea-server.vercel.app/product/get_milktea").then( res => res.json() )
.then( res => {
    milkteaInventory = res;
    // get assam milk tea details for promo
    assamMilkTeaPromo = res.find( i => i.name === "assam milktea" )

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
                    <input type="number" id="${data.name}" class="form-control  h-100" style="width: 44px;" value="1" min="0" oninput="validity.valid||(value='');" /> 

                    <button class="btn btn-primary btn-sm h-100 ${data.stock <= 0 ? "disabled" : ""}" onclick="buy('${data.name}', '${data.type}', '${data.stock}','${data.price.medium.toFixed(2)}', '${data.price.large.toFixed(2)}')" >Buy</button>
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
var cashierAlert = new bootstrap.Modal(document.getElementById("cashier-alert"));

// disable place order btn when order is 0
if( order.length === 0 ) {
    placeOrderBtn.setAttribute("class", "btn btn-outline-secondary disabled  w-100 mb-3")
}

let mainIngredientsList = []

fetch("https://authoritea-server.vercel.app/main/ingredients").then( res => res.json() )
.then( res => mainIngredientsList = res )
.catch( e => console.log(e) )

function buy(name, type, stock) {
    let qty = document.getElementById(name).value;

    qty = Number(qty)
    let item = milkteaInventory.find( i => i.name === name );

    if( type ==="milktea" ) {
        if( checkExpireIngredients(name) ) {
            document.getElementById("cashier-alert-message").innerText = "Order cannot be done, ingredient has been expired!";
            cashierAlert.show();
    
            return false;
        }
    
        if( !calculateToRemainingIngredients(item) ) {
            document.getElementById("cashier-alert-message").innerText = "Order cannot be done, low on main ingredients!";
            cashierAlert.show();
    
            return false;
        }
    }
    

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
            if( type === "snack" ) {
                order.push({
                    name, 
                    type, 
                    qty, 
                    stock, 
                    variant, 
                    itemPrice, 
                    subtotal,
                })
            } else {
                order.push({
                    name, 
                    type, 
                    qty, 
                    stock, 
                    variant, 
                    itemPrice, 
                    subtotal,
                    ingredients: item.ingredients
                })
            }
           
        }
    
    
        totalItems.innerHTML = getTotalItems();
    
        totalCost.innerHTML = `₱${getTotalCost()}`;
    
        updateOrderList()
    } else {
        document.getElementById("cashier-alert-message").innerText = "Order cannot be done, low on ingredients!";
        cashierAlert.show();
    }
}

var totalOrderModal = document.getElementById("total-order-modal");
var submitOrderBtn = document.getElementById("submit-order-btn");
var payBtn = document.getElementById("pay-btn");
var change = document.getElementById("change");
var discountBox = document.getElementById("discount-checkbox");
var totalSub = document.getElementById("total-subtotal");
var totalDiscount = document.getElementById("total-discount");

function addDiscount() {   
    if ( discountBox.checked ) {
        let discount = .20; // 
        let less = getTotalCost() * discount; 
        let newTotal = getTotalCost() - less;

        totalDiscount.innerHTML = `-₱${less.toFixed(2)}`;
        totalOrderModal.innerHTML = `₱${newTotal.toFixed(2)}`;

        return less;
    } else {
        totalDiscount.innerHTML = `₱${0}`;
        totalOrderModal.innerHTML = `₱${getTotalCost()}`;

        return 0;
    }
}

discountBox.addEventListener("change", addDiscount)

function placeOrder(){  
    totalOrderModal.innerHTML = `₱${getTotalCost()}`;
    totalSub.innerHTML = `₱${getTotalCost()}`;
}

function pay() {
    let payment = document.getElementById("payment").value;
    payment = Number(payment).toFixed(2);
    let totalCost = getTotalCost() - addDiscount();

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


var receiptModal = new bootstrap.Modal(document.getElementById("receipt"));
var submitOrderModal = new bootstrap.Modal(document.getElementById("confirm-order-modal"));

async function submitOrder() {
    console.log({order, totalCost: getTotalCost(), username: localStorage.getItem("username") });

    submitOrderBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...`;

    let data = { 
        order, 
        totalCost: getTotalCost(), 
        discount: addDiscount(),
        totalAmount: getTotalCost() - addDiscount() ,
        totalItems: getTotalItems(),
        username: localStorage.getItem("username"),
        orderDateTime: new Date().toLocaleString()
    }
    // authoritea-server.vercel.app
    await fetch("https://authoritea-server.vercel.app/order/submit_order", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then( res => res.json() )
    .then( res => {
        console.log(res)
        submitOrderModal.hide();
        receipt()
    } )
    .catch( e => console.log(e) )
}

function receipt() {
    document.getElementById("receipt-list").innerHTML = order.map( data => `
    <tr>
        <td scope="col">
            <div>
                <p class="text-capitalize">${data.name} - ${data.variant}</p>
                <p>₱${data.itemPrice}</p>
            </div>
        </td>
        <td class="text-end" >${data.qty}</td>
        <td class="text-end" >${data.subtotal}</td>
    </tr> 
    ` ).join("")

    document.getElementById("receipt-total-items").innerText = getTotalItems();
    document.getElementById("receipt-discount").innerText = addDiscount();
    document.getElementById("receipt-total-cost").innerText = getTotalCost() - addDiscount();

    receiptModal.show();
}

var orderList = document.getElementById("order-list");
var promo = document.getElementById("promo");

function updateOrderList() {

    placeOrderBtn.setAttribute("class", "btn btn-outline-primary w-100 mb-3")
    
    console.log("order: ",order);

    // will return both true if condition for promo meets then add free 1 assam milk tea 
    let checkOrderForPromo = order.filter( i => i.type === "milktea" && i.variant === "L" ).length >= 2;
    let checkQtyForPromo =  order.filter( i => i.qty >= 2 && i.variant === "L" && i.type === "milktea" ).length >= 1 ;

    let promoAvailed = order.find( i => i.promo === true ); 
    let totalOrderStk = 0;
    order.filter( i => i.name === "assam milktea" ).forEach( i => totalOrderStk += Number(i.stock));

    console.log(totalOrderStk);

    if( checkOrderForPromo || checkQtyForPromo ) { // check first if promo meets
        if( assamMilkTeaPromo === undefined || Number(assamMilkTeaPromo.stock) <= 5 ) { // checks if assam milktea is on inventory
            document.getElementById("cashier-alert-message").innerText = "Promo is currently not available, low on ingredients!";
            cashierAlert.show();
        } else {
            if( promoAvailed === undefined ) {// add promo to order if it's still not added
                order.push({
                    itemPrice: 0,
                    name: assamMilkTeaPromo.name,
                    qty: 1,
                    stock: Number(assamMilkTeaPromo.stock),
                    subtotal: 0,
                    type: assamMilkTeaPromo.type,
                    variant: "L",
                    promo: true,
                    ingredients: assamMilkTeaPromo.ingredients
                })
            }
        }
        
    }


    orderList.innerHTML = order.map( data => `
        <tr>
            <td scope="col">
                <div>
                    <p class="text-capitalize">${data.name} - ${data.variant}</p>
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
    totalDiscount.innerHTML = `₱${0}`;
    document.getElementById("payment").value = "";
    discountBox.checked = false;
    payBtn.setAttribute("class", "btn btn-primary w-100");
    submitOrderBtn.setAttribute("class", "btn btn-secondary disabled");
}

// order total cost
function getTotalCost() {
    
    let totalItemCost = order.map( i => parseFloat(i.subtotal) ) // get item subtotal and store to array convert string to float
    let total = 0;
    totalItemCost.forEach( i => total += i ) // get total on array

    return Number(total).toFixed(2);
}

// order total items
function getTotalItems() {
    // get total qty 
    let totalItemQty = order.map( i => parseInt(i.qty) ) // get item qty and store to array convert string to float
    let qty = 0;
    totalItemQty.forEach( i => qty += i ) // get sum on array

    return qty;
}

function reloadPage() {
    window.location.reload();
}

// will only return false if the main ingredient is not enough for order
function calculateToRemainingIngredients(item) {
    let milktea = order.filter( i => i.type === "milktea" )

    let totalSugarUsed = 0;
    let getSugarArr = milktea.map( i => i.ingredients.serving.sugar * i.qty );
    getSugarArr.forEach( i => totalSugarUsed += i );

    let totalTeaUsed = 0;
    let getTeaArr = milktea.map( i => i.ingredients.serving.tea * i.qty );
    getTeaArr.forEach( i => totalTeaUsed += i );

    let totalMilkUsed = 0;
    let getMilkArr = milktea.map( i => i.ingredients.serving.milk * i.qty );
    getMilkArr.forEach( i => totalMilkUsed += i );

    let totalPearlUsed = 0;
    let getPearlArr = milktea.map( i => i.ingredients.serving.pearl * i.qty );
    getPearlArr.forEach( i => totalPearlUsed += i );

    let totalPowderUsed = 0;
    let getPowderArr = milktea.map( i => i.ingredients.serving.powder * i.qty );
    getPowderArr.forEach( i => totalPowderUsed += i );

    let mainIngArr = mainIngredientsList.map( i => i.stock );

    console.log(mainIngArr[1], totalTeaUsed, item);

    if( mainIngArr[0] < totalTeaUsed ) return false;
    if( mainIngArr[1] < totalSugarUsed ) return false;
    if( mainIngArr[2] < totalMilkUsed ) return false;
    if( mainIngArr[3] < totalPearlUsed ) return false;

    // return mainIngArr[0] > totalTeaUsed && mainIngArr[1] > totalSugarUsed && mainIngArr[2] > totalMilkUsed && mainIngArr[3] > totalPearlUsed ;
    return true;
}

// will return true if ingredients has expired
function checkExpireIngredients(name) {
    let splitDate = new Date().toLocaleDateString().split("/")
    let day = Number(splitDate[0]) < 10 ? "0" +splitDate[0] : splitDate[0]

    let convertedTodayDate = splitDate[2] + day + splitDate[1];

    let check = mainIngredientsList.map( i => {

        let splitExpiryDate = i.expiryDate.split("/")
        let convertedExpiryDate = splitExpiryDate[2] + splitExpiryDate[0] + splitExpiryDate[1];

        convertedExpiryDate = convertedExpiryDate === undefined ? 99999999 : convertedExpiryDate;

        return Number(convertedTodayDate) >= convertedExpiryDate ;
    } );

    let milktea = milkteaInventory.find( i => i.name === name );
    let splitMilkteaExpiryDate = milktea.ingredients.expiryDate.split("/")
    let convertedMilkteaExpiryDate = splitMilkteaExpiryDate[2] + splitMilkteaExpiryDate[0] + splitMilkteaExpiryDate[1];

    check.push( Number(convertedTodayDate) >= Number(convertedMilkteaExpiryDate) )


    return check.includes(true);
}


