// const url = "http://localhost:5000";
const url = "https://authoritea-server.vercel.app";

let mainIngredients = [];

fetch(url+"/main/ingredients").then( res => res.json() )
.then( res => {
    console.log(res);
    mainIngredients = res
    res.map( i => {
        document.getElementById("main-ingredient-"+i.name).innerText = i.stock;

        if( i.expiryDate !== "" ) {
            document.getElementById("main-ingredient-expire-"+i.name).innerHTML = `<p>Expiry: ${i.expiryDate}</p>`;
        } else {
            document.getElementById("main-ingredient-expire-"+i.name).innerHTML = `<p style="height: 24px;" ></p>`;
        }

    } )
} )
.catch( e => console.log(e) )

var inventory = document.getElementById("inventory-table");
let inventoryList = [];

async function getInventory() {
    await fetch("https://authoritea-server.vercel.app/product/get_inventory").then( res => res.json() )
    .then( res => {
        console.log("inventory: ",res);
        inventoryList = res;

        inventory.innerHTML = res.map( data => `
            <tr  >
                <td >
                    <p class="fw-bold text-capitalize" >${data.name}</p>
                    <p class="fw-light" >${data.description}</p>
                    <p class="fw-light ${data.stock < 5 ? "text-danger" : "text-success"} " >Stock: ${data.stock}</p>
                </td>
                ${ data.type === "snack" ? "<td></td>"  : `
                <td>
                    <p class="text-capitalize " >Powder Name: <span class="fw-bold">${data?.ingredients?.powderName}</span></p>
                    <p class="text-capitalize " >Powder Qty: <span class="fw-bold">${data?.ingredients?.powderQty}g</span></p>
                    <p class="text-capitalize " >Expiry: <span class="fw-bold">${data?.ingredients?.expiryDate}</span></p>
                    <p class="fw-bold" >Per Serving</p>
                    <div class="ms-2" >
                        <div class="d-flex gap-2 justify-content-between mb-1" >
                            <p>Sugar: </p>
                            <p>${data?.ingredients?.serving?.sugar}g</p>
                        </div>

                        <div class="dropdown-divider"></div>

                        <div class="d-flex gap-2 justify-content-between mb-1" >
                            <p>Milk: </p>
                            <p>${data?.ingredients?.serving?.milk}g</p>
                        </div>
                        
                        <div class="dropdown-divider"></div>

                 
                        <div class="d-flex gap-2 justify-content-between mb-1" >
                            <p>Tea: </p>
                            <p>${data?.ingredients?.serving?.tea}g</p>
                        </div>

                        <div class="dropdown-divider"></div>

                        <div class="d-flex gap-2 justify-content-between mb-1" >
                            <p>Pearl: </p>
                            <p>${data?.ingredients?.serving?.pearl}g</p>
                        </div>

                        <div class="dropdown-divider"></div>

                        <div class="d-flex gap-2 justify-content-between mb-1" >
                            <p>Powder: </p>
                            <p>${data?.ingredients?.serving?.powder}g</p>
                        </div>
                    </div>
                </td>
                ` }
                
                <td class="text-capitalize" >${data.type}</td>
                <td>${data.price.medium === 0 ? "N/A" : "₱" + data.price.medium.toFixed(2)}</td>
                <td>${data.price.large === 0 ? "N/A" : "₱" + data.price.large.toFixed(2)}</td>
                <td >
                    <div class="text-center d-flex gap-2 justify-content-center" >
                        <button type="button" onclick="editProduct(
                            '${data.name}', 
                            '${data.type}', 
                            '${data.description}', 
                            '${data.stock}', 
                            '${data.price.medium.toFixed(2)}', 
                            '${data.price.large.toFixed(2)}', 
                            '${data.bestSeller}', 
                            '${data?.ingredients?.powderName}',
                            '${data?.ingredients?.powderQty}',
                            '${data?.ingredients?.expiryDate}',
                            '${data?.ingredients?.serving?.sugar}',
                            '${data?.ingredients?.serving?.milk}',
                            '${data?.ingredients?.serving?.powder}',
                            '${data?.ingredients?.serving?.pearl}',
                            '${data?.ingredients?.serving?.tea}',
                            )" class="btn btn-primary btn-sm d-flex flex-nowrap h-100 gap-2 " data-bs-toggle="modal" data-bs-target="#edit-inventory-modal">
                            <i class="bi bi-pen-fill"></i>
                            Edit
                        </button>

                        <button id="remove-account" onclick="removeProduct('${data.name}')" class="btn btn-outline-danger btn-sm d-flex flex-nowrap h-100 gap-2">
                            <span><i class="bi bi-file-earmark-x-fill"></i></span>
                            Remove
                        </button>
                    </div>

                </td>
            </tr>
        ` ).join("")
    
    } )
    .catch( e => {
        console.log(e);
    } )
}

getInventory();

document.getElementById("item-powder-serving").addEventListener("input", (e) => {
    let availableStock = document.getElementById("item-powder-qty").value;

    let value = Number(availableStock) / Number(e.target.value);

    document.getElementById("item-stock").value = Math.floor(value);

} )

document.getElementById("item-powder-qty").addEventListener("input", (e) => {
    let availableStock = document.getElementById("item-powder-qty").value;

    let value = Number(availableStock) / Number(e.target.value);

    document.getElementById("item-stock").value = Math.floor(value);

} )

function addProductModal(modalType) {
    document.getElementById("modal-type").innerText = modalType;

    if( modalType !== "milktea" ) {
        document.getElementById("add-product-form").noValidate = true;
        document.getElementById("forMilktea").style.display = "none";
    } else {
        document.getElementById("add-product-form").noValidate = false;
        document.getElementById("forMilktea").style.display = "block";
    }
}



var productName = document.getElementById("item-name");
var description = document.getElementById("item-description");
var stock = document.getElementById("item-stock");
var type = document.getElementById("item-type");
var medium = document.getElementById("price-medium");
var large = document.getElementById("price-large");
var bestSeller = document.getElementById("best-seller"); 

var addProductErrorMsg = document.getElementById("addmilktea-error-message");

var addProductForm = document.getElementById("add-product-form");

async function addProduct(e) {
    e.preventDefault();

    let modalType = document.getElementById("modal-type").innerText;
    
    let data = {}

    if( modalType === "Milktea" ) {
        console.log("milktea");
        let powderName = document.getElementById("item-powder-name").value;
        let powderQty = document.getElementById("item-powder-qty").value;
        let expiryDate = document.getElementById("item-expire").value;
        let sugar = document.getElementById("item-sugar-serving").value;
        let milk = document.getElementById("item-milk-serving").value;
        let powder = document.getElementById("item-powder-serving").value;
        let pearl = document.getElementById("item-pearl-serving").value;
        let tea = document.getElementById("item-tea-serving").value;

        data = {
            name: productName.value.toLowerCase(),
            description: description.value,
            type: "milktea",
            ingredients: {
                powderName: powderName,
                powderQty: powderQty,
                expiryDate: expiryDate,
                serving: {
                    sugar: sugar,
                    milk: milk,
                    powder: powder,
                    pearl: pearl,
                    tea: tea,
                }
            },
            price: { medium: medium.value , large: large.value },
            stock: stock.value,
            bestSeller: bestSeller.checked
        }
    } else {
        data = {
            name: productName.value.toLowerCase(),
            description: description.value,
            type: "snack",
            price: { medium: medium.value , large: large.value },
            stock: stock.value,
            bestSeller: bestSeller.checked
        }
    }

    console.log("milktea", data);

    await fetch(url+"/product/add_product",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }
    ).then( res => res.json() )
    .then((res) => {
        if (res.success) {
            var myModalEl = document.getElementById("inventory-add-milktea");
            var modal = bootstrap.Modal.getInstance(myModalEl);
            modal.hide();

            window.location.reload();
        }

        addProductErrorMsg.innerText = res.message;
        console.log(res);
    })
    .catch((e) => {
        addProductErrorMsg.innerText = e.response.error;
        console.log(e);
    });
}
addProductForm.addEventListener("submit", addProduct)


var editProductForm = document.getElementById("edit-product-form");

function editProduct(name, type, description, stock, medium, large, bestSeller, powderName, powderQty, expiryDate, sugar, milk, powder, pearl, tea) {

    let best = bestSeller === "true" && true;
    
    editProductForm.innerHTML = `
        <div class="modal-body">
                <div id="edit-product" name="${name}" class="text-danger h5 text-center">
                    Updating Product: ${name}
                </div>

                <p id="edit-item-type" class="mb-4 text-center h6 text-capitalize">${type}</p>
                
                <h6 class="mt-2" >Details</h6>

                <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon1">Item Name</span>
                    <input id="edit-item-name" required type="text" value="${name}" class="form-control text-capitalize" placeholder="Product Name" aria-label="Item Name" aria-describedby="basic-addon1">
                </div>
                
                <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon2">Description</span>
                    <input id="edit-item-description" required type="text"  value="${description}" class="form-control" placeholder="Description" aria-label="Description" aria-describedby="basic-addon2">
                </div>

                <div class="form-check">
                    <input class="form-check-input" ${ best ? "checked" : ""} type="checkbox" id="edit-best-seller">
                    <label class="form-check-label" for="edit-best-seller">
                        Best Seller
                    </label>
                </div>
                
                <div id="forMilkteaEdit" style="display: ${ type !== "milktea" ? "none" : "block" } ;" >
                    <h6 class="mt-4" >Ingredients</h6>

                    <div class="ms-2 " >
                        <div class="mb-4" >
                            <h6 class="mb-2" >Flavoring</h6>

                            <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon2">Powder Name</span>
                                <input id="edit-item-powder-name" value="${powderName}" required type="text" class="form-control text-capitalize" placeholder="Powder Flavor Name" aria-label="Powder Flavor Name" aria-describedby="basic-addon2">
                            </div>

                            <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon2">Powder Qty</span>
                                <input id="edit-item-powder-qty" value="${powderQty}" required type="text" class="form-control text-capitalize" placeholder="Powder qty (grams)" aria-label="Powder qty (grams)" aria-describedby="basic-addon2">
                            </div>

                            <h6 class="mt-4" >Expiry Date</h6>

                            <div class='input-group' id='datetimepicker3' data-td-target-input='nearest' data-td-target-toggle='nearest'>
                                <input id='edit-item-expire' value="${expiryDate}" type='text' class='form-control' data-td-target='#datetimepicker3' />
                                <span class='input-group-text' data-td-target='#datetimepicker3' data-td-toggle='datetimepicker' >
                                    <i class="bi bi-calendar-fill"></i>
                                </span>
                            </div>

                        </div>

                        <div class="mb-4">
                            <h6 class="mb-2" >Serving (grams per serving)</h6>

                            <div class="d-flex gap-0 gap-sm-2 flex-wrap flex-sm-nowrap">
                                <div class="input-group mb-3">
                                    <span class="input-group-text" id="basic-addon2">Sugar</span>
                                    <input id="edit-item-sugar-serving" value="${sugar}" required type="number" class="form-control" placeholder="Per Serving" aria-label="Per Serving" min="0" oninput="validity.valid||(value='');" >
                                </div>
                                <div class="input-group mb-3">
                                    <span class="input-group-text" id="basic-addon2">Milk</span>
                                    <input id="edit-item-milk-serving" value="${milk}" required type="number" class="form-control" placeholder="Per Serving" aria-label="Per Serving" min="0" oninput="validity.valid||(value='');" >
                                </div>
                            </div>
                            
                            <div class="d-flex gap-0 gap-sm-2 flex-wrap flex-sm-nowrap">
                                <div class="input-group mb-3">
                                    <span class="input-group-text" id="basic-addon2">Tea</span>
                                    <input id="edit-item-tea-serving" value="${tea}" required type="number" class="form-control" placeholder="Per Serving" aria-label="Per Serving" min="0" oninput="validity.valid||(value='');" >
                                </div>
                                <div class="input-group mb-3">
                                    <span class="input-group-text" id="basic-addon2">Pearl</span>
                                    <input id="edit-item-pearl-serving" value="${pearl}" required type="number" class="form-control" placeholder="Per Serving" aria-label="Per Serving" min="0" oninput="validity.valid||(value='');" >
                                </div>
                            </div>
                            <div class="d-flex gap-0 gap-sm-2 flex-wrap flex-sm-nowrap">
                                <div class="input-group mb-3">
                                    <span class="input-group-text" id="basic-addon2">Powder</span>
                                    <input id="edit-item-powder-serving" value="${powder}" required type="number" class="form-control" placeholder="Per Serving" aria-label="Per Serving" min="0" oninput="validity.valid||(value='');" >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <h6 class="mt-4" >Price</h6>

                <div class="d-flex gap-2 flex-wrap flex-sm-nowrap" >
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon2">Medium</span>
                        <input id="edit-price-medium" type="number"  value="${medium}" step="0.01" class="form-control" placeholder="Medium Price" aria-label="Medium Price" aria-describedby="basic-addon2">
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon2">Large</span>
                        <input id="edit-price-large" type="number"  value="${large}" step="0.01" class="form-control" placeholder="Large Price" aria-label="Large Price" aria-describedby="basic-addon2">
                    </div>
                </div>

                <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon2">Stock</span>
                    <input id="edit-item-stock" type="number" value="${stock}" class="form-control" placeholder="Available Stocks" aria-label="Available Stocks" aria-describedby="basic-addon2">
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        </div>
    `

    new tempusDominus.TempusDominus( document.getElementById('datetimepicker3'),
    {
        display: {
            components: {
                decades: true,
                year: true,
                month: true,
                date: true,
                hours: false,
                minutes: false,
                seconds: false,
        }
    }});

    if( type !== "milktea" ) {
        editProductForm.noValidate = true;
    } else {
        document.getElementById("edit-item-powder-serving").addEventListener("input", (e) => {
            let availableStock = document.getElementById("edit-item-powder-qty").value;
        
            let value = Number(availableStock) / Number(e.target.value);
            console.log("first: ",e.target.value);
        
            document.getElementById("edit-item-stock").value = Math.floor(value);
        
        } )
        
        document.getElementById("edit-item-powder-qty").addEventListener("input", (e) => {
            let perServing = document.getElementById("edit-item-powder-serving").value;
        
            let value = Number(e.target.value) / Number(perServing) ;
            console.log("2: ",e.target.value);
            document.getElementById("edit-item-stock").value = Math.floor(value);
        
        } )
        editProductForm.noValidate = false;
    }
}

async function updateProduct(e) {
    e.preventDefault();

    var product = document.getElementById("edit-product");
    var productName = document.getElementById("edit-item-name");
    var description = document.getElementById("edit-item-description");
    var stock = document.getElementById("edit-item-stock");
    var type = document.getElementById("edit-item-type");
    var medium = document.getElementById("edit-price-medium");
    var large = document.getElementById("edit-price-large");
    var bestSeller = document.getElementById("edit-best-seller");

    let data = {}
    
    if( document.getElementById("edit-item-type").innerText === "Milktea" ) {
        console.log("milktea");
        let powderName = document.getElementById("edit-item-powder-name").value;
        let powderQty = document.getElementById("edit-item-powder-qty").value;
        let expiryDate = document.getElementById("edit-item-expire").value;
        let sugar = document.getElementById("edit-item-sugar-serving").value;
        let milk = document.getElementById("edit-item-milk-serving").value;
        let powder = document.getElementById("edit-item-powder-serving").value;
        let pearl = document.getElementById("edit-item-pearl-serving").value;
        let tea = document.getElementById("edit-item-tea-serving").value;

        data = {
            product: product.getAttribute('name'),
            name: productName.value,
            description: description.value,
            type: "milktea",
            ingredients: {
                powderName: powderName,
                powderQty: powderQty,
                expiryDate: expiryDate,
                serving: {
                    sugar: sugar,
                    milk: milk,
                    powder: powder,
                    pearl: pearl,
                    tea: tea,
                }
            },
            price: { medium: !medium.value ? 0 : medium.value , large: !large.value ? 0 : large.value },
            stock: stock.value,
            bestSeller: bestSeller.checked
        }
    } else {
        data = {
            product: product.getAttribute('name'),
            name: productName.value,
            description: description.value,
            type: "snack",
            price: { medium: !medium.value ? 0 : medium.value , large: !large.value ? 0 : large.value },
            stock: stock.value,
            bestSeller: bestSeller.checked
        }
    }

    fetch(url + "/product/edit_product",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then((res) => res.json())
    .then((res) => {
        window.location.reload();
        console.log(res);

    })
    .catch((e) => {
        console.log(e);
    });

}

editProductForm.addEventListener("submit", updateProduct)

var searchInput = document.getElementById("search");

searchInput.addEventListener("input", (e) => {
    
   let searchList = inventoryList.filter( i => i.name.toLowerCase().includes(e.target.value) );

   inventory.innerHTML = searchList.map( data => `
        <tr  >
            <td >
                <p class="fw-bold text-capitalize" >${data.name}</p>
                <p class="fw-light" >${data.description}</p>
                <p class="fw-light ${data.stock < 5 ? "text-danger" : "text-success"} " >Stock: ${data.stock}</p>
            </td>
            ${ data.type === "snack" ? "<td></td>"  : `
            <td>
                <p class="text-capitalize " >Powder: <span class="fw-bold">${data?.ingredients?.powderName}</span></p>
                <p class="text-capitalize " >Expiry: <span class="fw-bold">${data?.ingredients?.expiryDate}</span></p>
                <p class="fw-bold" >Serving</p>
                <div class="ms-2" >
                    <div class="d-flex gap-2 justify-content-between mb-1" >
                        <p>Sugar: </p>
                        <p>${data?.ingredients?.serving?.sugar}g</p>
                    </div>

                    <div class="dropdown-divider"></div>

                    <div class="d-flex gap-2 justify-content-between mb-1" >
                        <p>Milk: </p>
                        <p>${data?.ingredients?.serving?.milk}g</p>
                    </div>

                    <div class="dropdown-divider"></div>

                    <div class="d-flex gap-2 justify-content-between mb-1" >
                        <p>Powder: </p>
                        <p>${data?.ingredients?.serving?.powder}g</p>
                    </div>

                    <div class="dropdown-divider"></div>

                    <div class="d-flex gap-2 justify-content-between mb-1" >
                        <p>Pearl: </p>
                        <p>${data?.ingredients?.serving?.pearl}g</p>
                    </div>

                    <div class="dropdown-divider"></div>

                    <div class="d-flex gap-2 justify-content-between mb-1" >
                        <p>Tea: </p>
                        <p>${data?.ingredients?.serving?.tea}g</p>
                    </div>
                </div>
            </td>
            ` }
            <td class="text-capitalize" >${data.type}</td>
            <td>${data.price.medium === 0 ? "N/A" : "₱" + data.price.medium.toFixed(2)}</td>
            <td>${data.price.large === 0 ? "N/A" : "₱" + data.price.large.toFixed(2)}</td>
            <td >
                <div class="text-center d-flex gap-2 justify-content-center" >
                    <button type="button" onclick="editProduct('${data.name}', '${data.type}', '${data.description}', '${data.stock}', '${data.price.medium.toFixed(2)}', '${data.price.large.toFixed(2)}', '${data.bestSeller}')" class="btn btn-primary btn-sm d-flex flex-nowrap h-100 gap-2 " data-bs-toggle="modal" data-bs-target="#edit-inventory-modal">
                        <i class="bi bi-pen-fill"></i>
                        Edit
                    </button>

                    <button id="remove-account" onclick="removeProduct('${data.name}')" class="btn btn-outline-danger btn-sm d-flex flex-nowrap h-100 gap-2">
                        <span><i class="bi bi-file-earmark-x-fill"></i></span>
                        Remove
                    </button>
                </div>

            </td>
        </tr>
   ` ).join("")

} )

function removeProduct(name) {
    fetch("https://authoritea-server.vercel.app/product/remove_product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name }),
    })
        .then((res) => res.json)
        .then((res) => {
            console.log(res);
            window.location.reload();
        })
        .catch((e) => {
            console.log(e);
        });

}


async function updateIngredients(e) {
    e.preventDefault();

    let name = document.getElementById("main-ingredient-name").innerText.toLowerCase();
    let updatedStock = document.getElementById("main-ingredient-update-stock").value;
    let updatedExpire = document.getElementById("main-ingredient-update-expire").value;

    updatedExpire = updatedExpire === "" ? "" : updatedExpire;

    await fetch(url+"/main/update_ingredient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, updatedStock, expiryDate: updatedExpire }) 
    }).then( res => res.json() )
    .then( res => {
        window.location.reload();
    } )
    .catch( e => console.log(e) )


}

document.getElementById("main-ingredients-form").addEventListener("submit", updateIngredients)


var mainIngredientsModal = new bootstrap.Modal(document.getElementById("main-ingredients-modal"));

function updateMainIngredients(type) {
    let ing = mainIngredients.find( i => i.name === type);
    mainIngredientsModal.toggle();
    document.getElementById("main-ingredient-name").innerText = type;
    document.getElementById("main-ingredient-qty").innerText = ing.stock;
    document.getElementById("main-ingredient-update-expire").value = ing.expiryDate === undefined ? "" : ing.expiryDate;
    console.log(type);
}

new tempusDominus.TempusDominus( document.getElementById('datetimepicker1'),
{
    display: {
        components: {
            decades: true,
            year: true,
            month: true,
            date: true,
            hours: false,
            minutes: false,
            seconds: false,
    }
}});

new tempusDominus.TempusDominus( document.getElementById('datetimepicker2'),
{
    display: {
        components: {
            decades: true,
            year: true,
            month: true,
            date: true,
            hours: false,
            minutes: false,
            seconds: false,
    }
}});




function resetForm() {
    document.getElementById("add-product-form").reset();
}