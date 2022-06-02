

async function logout() {
    await fetch("https://authoritea-server.vercel.app/account/logout", 
    {  method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: localStorage.getItem("username") }), 
    }).then( res => res.json() )
    .then( res => {
        console.log(res) 
        window.location.reload();
    
    })
    .catch( e => console.log(e) )

    localStorage.clear();
}