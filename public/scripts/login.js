sessionStorage.removeItem('user')

const userName = document.getElementById("iptUserName");
const password = document.getElementById("iptPassword");

function showPass(el,btn){
    if(el.type == "password"){
        el.type = "text";
        btn.classList.add("clicked");
        
    }else{
        el.type = "password";
        btn.classList.remove("clicked");
    }
}


async function handleLogin(){

    try{

        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: userName.value,
                password: password.value
            })
        });

        const result = await response.json();

        

        

        if(response.ok){
            await sessionStorage.setItem(`user`, JSON.stringify(result));
            window.location = "home.html"
        }else{
            msgError.innerHTML = result.message;
            setTimeout(() => {
            msgError.innerHTML = "";
            }, 2000);
        }

    }catch(error){

        console.error(error);

    }

}
