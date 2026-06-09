if(!sessionStorage.getItem(`user`)){
    window.location = "index.html"
}
const {id,name, username} = JSON.parse(sessionStorage.getItem(`user`))
if(!id || !name || !username){
    window.location = "index.html"
}

const n = document.getElementById("nameUser");
n.innerHTML = name



function logout(){
    sessionStorage.removeItem('user');
    window.location = "index.html"
    
}
