

async function logout() {
    await fetch("http://localhost:5000/account/logout", 
    {  method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: localStorage.getItem("username") }), 
    }).then( res => res.json() )
    .then( res => console.log(res) )
    .catch( e => console.log(e) )

    localStorage.clear();
}