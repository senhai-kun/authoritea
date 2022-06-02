var form = document.getElementById('form')
var username = document.getElementById('username');
var password = document.getElementById('password');
var signin = document.getElementById('signin');

async function submit(e) {
    e.preventDefault();

    var alertBody = document.getElementById("alert-body");
    var alertBtn = document.getElementById("alert-button");
    var alertModal = new bootstrap.Modal(document.getElementById('alert'))

    // button loading
    signin.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading...
        `

    var data = { username: username.value, password: password.value }

    await fetch("http://localhost:5000/account/signin", { method: "POST", body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })
        .then( res => {
            return res.json()
        } )
        .then( result => {
            console.log(result)

            if( result.success ) {
                localStorage.setItem("role", result.data.role)
                localStorage.setItem("username", result.data.username)

                window.location = result.redirect;
            } else {
                alertBody.innerText = result.message;
                alertModal.show();
            }
        } )
        .catch( e => {

            alertBody.innerText = `Server Error ${e}`;
            alertModal.show();

            console.log(e);
        } )
    console.log(username.value)

    signin.innerHTML = "Sign in"
}

form.addEventListener('submit', submit)
