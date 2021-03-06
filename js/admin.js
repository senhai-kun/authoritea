
let revenueToday = document.getElementById("revenue-today");
let revenueDateToday = document.getElementById("revenue-date-today");

let revenueWeekly = document.getElementById("revenue-weekly");
let revenueDateWeekly = document.getElementById("revenue-date-weekly");

let dateToday = new Date().toLocaleString('en-us', { year:"numeric", day: "numeric", month:"short"});

fetch("https://authoritea-server.vercel.app/sales/get_revenue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date: dateToday }),
} ).then( res => res.json() )
.then( res => {
    revenueToday.innerHTML = res.today.todaysRevenue;
    revenueDateToday.innerHTML = "Total income for today - "+res.today.date;

    revenueWeekly.innerHTML = res.week.weekly;
    revenueDateWeekly.innerHTML = res.week.range;
} )
.catch( e => console.log(e) )

// display user account list on table
let userTable = document.getElementById("users");

async function getUsers() {
    await fetch("https://authoritea-server.vercel.app/account/get_users", {
    method: "GET",
    }).then((res) => res.json())
    .then((res) => {
        userTable.innerHTML = res.map((data) => `
            <tr>
                <td>
                    <h6 class="text-primary text-capitalize"> 
                        <i class="bi bi-person-circle me-2" ></i>
                        ${data.username}
                    </h6>
                </td>
                <td >
                    ${data.role}
                </td>
                <td class="text-center">
                    <h6 class="${data.status ? "text-success" : "text-danger"}" >
                        ${data.status ? "Online" : "Offline"}
                    </h6>
                </td>
                <td  >
                    <div class="text-center d-flex gap-2 justify-content-center" >
                        <button type="button" onclick="editAccount('${data.username}')" class="btn btn-primary btn-sm d-flex flex-nowrap h-100 gap-2" >
                            <i class="bi bi-pen-fill"></i>
                            Edit
                        </button>

                        ${data.username === "admin" ? "" : `<button id="remove-account" onclick="removeAccount('${data.username}')" class="btn btn-outline-danger btn-sm d-flex flex-nowrap h-100 gap-2">
                            <span><i class="bi bi-person-x-fill"></i></span>
                            Remove
                        </button>`}
                    </div>
                </td>
            </tr>
        `).join("");

        console.log(res);
    })
    .catch((e) => {
        console.log(e);
    });
}

getUsers();

// edit account 
var editAccountForm = document.getElementById("edit-account-form");
var editAccountModal = document.getElementById("edit-account-modal");
var adminAlert = document.getElementById("admin-alert");
var adminAlertMsg = document.getElementById("admin-alert-message");

let adminAlertModal = new bootstrap.Modal(adminAlert);
var adminEditModal = new bootstrap.Modal(editAccountModal);

function editAccount(username) {

    adminEditModal.show();

    editAccountForm.innerHTML = `
        <div class="modal-body">
                <div id="edit-account" name="${username}" class="text-primary mb-4 h5 text-center">
                    Updating Account:  ${username}
                </div>
                
                <h6 class="mt-2" >User Account</h6>

                <div class="input-group mb-3">
                    <span class="input-group-text" id="newUsername">
                        <i class="bi bi-person-circle"></i>
                    </span>
                    <input id="edit-account-name" required type="text" value="${username}" class="form-control text-capitalize" placeholder="Username" aria-label="Username" aria-describedby="newUsername">
                </div>

                <div class="input-group mb-3">
                    <span class="input-group-text" id="newPassword">
                        <i class="bi bi-key-fill" style="transform: rotate(90deg);" ></i>
                    </span>
                    <input id="edit-account-password" required type="password" class="form-control" placeholder="New Password" aria-label="newPassword" aria-describedby="newPassword">
                </div>

                <div class="form-check mb-4 " >
                    <input class="form-check-input" onclick="showEditAccPassword()" type="checkbox" id="show-edit-acc-password">
                    <label class="form-check-label" for="show-edit-acc-password">
                        Show Password
                    </label>
                </div>
    
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        </div>
    `
}

function showEditAccPassword() {
    var passwordInput = document.getElementById("edit-account-password");

    if( passwordInput.type === "password" ) {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}

function showAddAccPassword() {
    var passwordInput = document.getElementById("password");

    if( passwordInput.type === "password" ) {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}

async function updateAccount(e) {
    e.preventDefault();

    var newUsername = document.getElementById("edit-account-name").value;
    var newPassword = document.getElementById("edit-account-password").value;
    var user = document.getElementById("edit-account").getAttribute("name");

    await fetch("https://authoritea-server.vercel.app/account/edit_account", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user, username: newUsername, password: newPassword }),
    }).then((res) => res.json())
    .then((res) => {
        console.log(res.success);
        

        if( res.success ) {
            adminEditModal.hide();

            adminAlertMsg.innerText = res.message;
            adminAlertModal.show();
        } 
        
    
    })
    .catch((e) => {
        console.log(e);
    });

}

editAccountForm.addEventListener("submit", updateAccount)

// create or add account
var form = document.getElementById("create-acc-form");
var username = document.getElementById("username");
var password = document.getElementById("password");
var role = document.getElementById("role");
var accountErrorMsg = document.getElementById("account-error-message");

async function addAccount(e) {
    e.preventDefault();

    var data = {
        username: username.value,
        password: password.value,
        role: role.value,
    };

    await fetch("https://authoritea-server.vercel.app/account/add_account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.success) {
                var myModalEl = document.getElementById("account-modal");
                var modal = bootstrap.Modal.getInstance(myModalEl);
                modal.hide();

                adminAlertMsg.innerText = res.message;
                adminAlertModal.show();
            } else {
                accountErrorMsg.innerText = res.message;
            }

        })
        .catch((e) => {
            accountErrorMsg.innerText = e;
            console.log(e);
        });

    console.log(username.value, password.value, role.value);
}

form.addEventListener("submit", addAccount);

/* 
    removing account
*/
var removeBtn = document.getElementById("remove-account");

function removeAccount(username) {
    console.log(username);

    fetch("https://authoritea-server.vercel.app/account/remove_account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username }),
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

function reload() {
    window.location.reload();
}


// Sales

let salesList = []

fetch("https://authoritea-server.vercel.app/order/order_list/"+new Date().toLocaleDateString().split("/").join(",") ).then( res => res.json() )
.then( res => {
    salesList = res;

    if( res.length === 0 ) {
        document.getElementById("sales").innerHTML = "<h5 class='p-5 text-center' >No Record For Today</h5>"
    } else {
        document.getElementById("sales").innerHTML = res.map( data => `
        <div class="bg-light p-3 rounded-20" >
            <div class="mb-2">
                <p>DateTime:</p>
                <p>${data.orderDateTime}</p>
            </div>

            <div class="d-flex gap-2 justify-content-between" >
                <p>Vendor: </p>
                <p>${data.username}</p>
            </div>

            <div class="d-flex gap-2 justify-content-between" >
                <p>Order Cost: </p>
                <p>${data.totalCost}</p>
            </div>

            <div class="d-flex gap-2 justify-content-between" >
                <p>Discount: </p>
                <p>${data.discount}</p>
            </div>

            <div class="d-flex gap-2 justify-content-between" >
                <p>Total Amount: </p>
                <p>${data.totalAmount}</p>
            </div>

            <div class="dropdown-divider"></div>


            
            <button class="btn btn-primary w-100 mt-3" onclick="moreDetails('${data.orderDateTime}')" >More Details</button>
        </div>
    ` ).join("")
    }

    

} ) 
.catch( e => console.log(e) )

var salesModal = new bootstrap.Modal(document.getElementById("sales-receipt"));

function moreDetails(date) {

    let details = salesList.find( i => i.orderDateTime === date);

    document.getElementById("sales-receipt-header").innerHTML = `
        <h5 class="text-center fw-bold" >The Brew Authoritea</h5>
        <p class="text-center">DateTime: ${details.orderDateTime}</p>
        <p class="text-center">Vendor: ${details.username}</p>
        <div class="d-flex gap-3 justify-content-center" >
            <p class="text-center">Order Cost: ${details.totalCost}</p>
            <p class="text-center">Discount: ${details.discount}</p>
        </div>
    
        <p class="text-center">Total Amount: ${details.totalAmount}</p>
    `

    document.getElementById("sales-ingredients").innerHTML = details.ingredientsUsed.map( i => `
        <div class="d-flex gap-2 justify-content-between" >
            <p class="text-capitalize" >${i.name} </p>
            <p>${i.total} grams</p>
        </div>
    ` ).join("")

    document.getElementById("sales-receipt-list").innerHTML = details.orderList.map( data => `
        <tr>
            <td scope="col">
                <div>
                    <p class="text-capitalize">${data.name} - ${data.variant}</p>
                    <p>???${data.itemPrice}</p>
                </div>
            </td>
            <td class="text-end" >${data.qty}</td>
            <td class="text-end" >${data.subtotal}</td>
        </tr> 
    ` ).join("")

    document.getElementById("receipt-total-items").innerText = details.totalItems;
    document.getElementById("receipt-total-cost").innerText = "???" + details.totalAmount.toFixed(2);

    salesModal.show();
}

function closeSales() {
    salesModal.hide();
}






