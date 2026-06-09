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
const cardForms = document.querySelector('.cardForms');
const create = document.querySelector('.create');

getAllForms();

async function getAllForms(){

    try{

        const response = await fetch(`/allforms/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if(result.length === 0){

            cardForms.innerHTML = `
                <span class="t1 b">Você ainda não tem nenhum formulário</span>
                <span class="t3 line purple b" onclick="createForm()">
                    Clique para criar seu formulário
                </span>
            `;

        }else{

            let txt = `
                <div class="first" onclick="createForm()">
                    <img src="../images/icons/plus.svg" alt="">
                    <span class="t4 b">Novo formulário</span>
                </div>
            `;

            for(let i = 0; i < result.length; i++){

                const form = result[i];

                const dateBR = new Date(form.created_at)
                    .toLocaleDateString('pt-BR');

                txt += `
                    <div class="cardForm">
                        <div class="pt1">
                            <span class="t5 b">Criado em ${dateBR}</span>
                            <img src="../images/icons/trash.svg" alt="" onclick="deleteForm(${form.id})">
                        </div>

                        <div class="pt2">
                            <span class="t4 b">${form.title}</span>
                            <span class="t5">
                                ${form.description}
                            </span>
                        </div>

                        <div class="pt3">
                            <span class="t5 b">
                                ${form.submissions} Respostas
                            </span>

                            <img src="../images/icons/chart.svg" alt="" onclick="goToAnalysis('${form.id}')">
                            <img src="../images/icons/edit.svg" alt="" onclick="goToEdit('${form.id}')">
                        </div>
                    </div>
                `;
            }

            cardForms.innerHTML = txt;
        }

    }catch(error){

        console.error(error);

    }

}

function createForm(){
    create.style.display = "flex"
}

function closeCreate(){
    create.style.display = "none"
}

async function handleCreateForm(n, d){

    if(
        !n.value ||
        !d.value ||
        n.value.trim() === "" ||
        d.value.trim() === ""
    ){

        msgErrorC.innerHTML = "Preencha nome e descrição";

        setTimeout(() => {
            msgErrorC.innerHTML = "";
        }, 2000);

        return;
    }

    try {

        const response = await fetch("/forms", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: n.value,
                description: d.value,
                user_id: id
            })
        });

        const result = await response.json();

        if(!response.ok){

            msgErrorC.innerHTML = result.message;

            setTimeout(() => {
                msgErrorC.innerHTML = "";
            }, 2000);

            return;
        }else{
            closeCreate()
            getAllForms()
        }

    } catch (error) {

        console.error(error);

        msgErrorC.innerHTML = "Erro ao criar formulário";

        setTimeout(() => {
            msgErrorC.innerHTML = "";
        }, 2000);

    }

}


async function deleteForm(id){
    try {
        const response = await fetch(`/forms/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        getAllForms();
    } catch (error) {
        console.error(error);
        
    }
}

async function goToReply(code){
    code = code.toUpperCase();
    if(code && code.trim() !== ""){
         try {
        const response = await fetch(`/forms/code/${code}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const result = await response.json();
        if(response.ok){
            sessionStorage.setItem("formReply", JSON.stringify(result.id));
            window.location = "replys.html";
        }
        } catch (error) {
            console.error(error);
        }
    }
}
async function goToEdit(id){
    sessionStorage.setItem("formEdit", JSON.stringify(id));
    window.location = "edit.html";
}

async function goToAnalysis(id){
    sessionStorage.setItem("formEdit", JSON.stringify(id));
    window.location = "analysis.html";
}


function redirect(txt){
    window.location = txt;
}