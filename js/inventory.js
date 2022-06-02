var inventory = document.getElementById("inventory-table")

async function getInventory() {
    await fetch("https://authoritea-server.vercel.app/product/get_inventory").then( res => res.json() )
    .then( res => {
        console.log(res);
        
        inventory.innerHTML = res.map( data => `
            <tr  >
                <td >
                    <p class="fw-bold" >${data.name}</p>
                    <p class="fw-light" >${data.description}</p>
                    <p class="fw-light ${data.stock < 5 ? "text-danger" : "text-success"} " >Stock: ${data.stock}</p>
                </td>
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
    .catch( e => {
        console.log(e);
    } )
}

getInventory();

var productName = document.getElementById("item-name");
var description = document.getElementById("item-description");
var stock = document.getElementById("item-stock");
var type = document.getElementById("item-type");
var medium = document.getElementById("price-medium");
var large = document.getElementById("price-large");
var bestSeller = document.getElementById("best-seller");

var addProductForm = document.getElementById("add-product-form");

async function addProduct(e) {
    e.preventDefault();
    
    let data = {
        name: productName.value,
        description: description.value,
        type: type.value,
        price: { medium: medium.value , large: large.value },
        stock: stock.value,
        bestSeller: bestSeller.checked
    }

    await fetch("https://authoritea-server.vercel.app/product/add_product",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }
    ).then( res => res.json() )
    .then((res) => {
        if (res.success) {
            var myModalEl = document.getElementById("inventory-modal");
            var modal = bootstrap.Modal.getInstance(myModalEl);
            modal.hide();

            window.location.reload();
        }

        message.innerText = res.message;
        console.log(res);
    })
    .catch((e) => {
        message.innerText = e.response.error;
        console.log(e);
    });
}
addProductForm.addEventListener("submit", addProduct)


function removeProduct(name) {
    fetch("https://authoritea-server.vercel.app/product/remove_product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name }),
    })
        .then((res) => res.json)
        .then((res) => {
            console.log(res);
        })
        .catch((e) => {
            console.log(e);
        });

    window.location.reload();
}


var editProductForm = document.getElementById("edit-product-form");

function editProduct(name, type, description, stock, medium, large, bestSeller) {

    let best = bestSeller === "true" && true;

    editProductForm.innerHTML = `
        <div class="modal-body">
                <div id="edit-product" name="${name}" class="text-danger mb-4 h5 text-center">
                    Updating Product: ${name}
                </div>
                
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

                <h6 class="mt-4" >Type</h6>

                <select id="edit-item-type"class="form-select" >
                    <option ${type === "milktea" && "selected"} value="milktea">Milktea</option>
                    <option ${type === "coffee" && "selected"} value="coffee">Coffee</option>
                    <option ${type === "snack" && "selected"} value="snack">Snack</option>
                </select>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        </div>
    `
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

    let data = {
        product: product.getAttribute('name'),
        name: productName.value,
        description: description.value,
        type: type.value,
        price: { medium: !medium.value ? 0 : medium.value , large: !large.value ? 0 : large.value },
        stock: stock.value,
        bestSeller: bestSeller.checked
    }

    fetch("https://authoritea-server.vercel.app/product/edit_product",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then((res) => res.json)
    .then((res) => {
        console.log(res);
    })
    .catch((e) => {
        console.log(e);
    });

    window.location.reload();
}

editProductForm.addEventListener("submit", updateProduct)
