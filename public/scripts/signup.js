sessionStorage.removeItem('user')

const name = document.getElementById("iptName");
const userName = document.getElementById("iptUserName");
const password = document.getElementById("iptPassword");
const password2 = document.getElementById("iptPassword2");
const btnPass = document.getElementById("btnPass");
const msgErrorName = document.getElementById("msgErrorName");
const msgErrorUsername = document.getElementById("msgErrorUsername");
const msgErrorPassword = document.getElementById("msgErrorPassword");
const msgErrorPassword2 = document.getElementById("msgErrorPassword2");

function showError(element, message){

    element.innerHTML = message;

    setTimeout(() => {
        element.innerHTML = "";
    }, 2000);

}

function showPass(el,btn){
    if(el.type == "password"){
        el.type = "text";
        btn.classList.add("clicked");
        
    }else{
        el.type = "password";
        btn.classList.remove("clicked");
    }
}

async function handleSignup(){

    let hasError = false;

    if(name.value.length < 3){

        showError(
            msgErrorName,
            "Nome deve possuir pelo menos 3 caracteres"
        );

        hasError = true;

    }

    if(userName.value.length < 3){

        showError(
            msgErrorUsername,
            "Usuário deve possuir pelo menos 3 caracteres"
        );

        hasError = true;

    }

    if(password.value.length < 8){

        showError(
            msgErrorPassword,
            "Senha deve possuir pelo menos 8 caracteres"
        );

        hasError = true;

    }

    if(
        !password.value.includes("!")
        &&
        !password.value.includes("@")
        &&
        !password.value.includes("#")
        &&
        !password.value.includes("$")
        &&
        !password.value.includes("%")
        &&
        !password.value.includes("&")
        &&
        !password.value.includes("*")
    ){

        showError(
            msgErrorPassword,
            "Senha deve possuir caractere especial"
        );

        hasError = true;

    }

    if(password.value !== password2.value){

        showError(
            msgErrorPassword2,
            "As senhas não coincidem"
        );

        hasError = true;

    }

    if(hasError){
        return;
    }

    try{

        const response = await fetch("/signup",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:name.value,
                username:userName.value,
                password:password.value
            })
        });

        const result = await response.json();

        msgError.innerHTML = result.message;

        setTimeout(() => {
            msgError.innerHTML = "";
        }, 2000);

        if(response.ok){
            window.location = "login.html"
        }

    }catch(error){

        alert(error);

    }

}