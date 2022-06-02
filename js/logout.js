

async function logout() {
    await fetch("https://authoritea-server.vercel.app/account/logout", 
    {  method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: localStorage.getItem("username") }), 
    }).then( res => res.json() )
    .then( res => {
        console.log(res) 
        localStorage.clear();
        window.location = "index.html";
    })
    .catch( e => console.log(e) )

}