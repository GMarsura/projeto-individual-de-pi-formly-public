if (!sessionStorage.getItem(`user`) || !JSON.parse(sessionStorage.getItem(`formReply`))) {
    window.location = "index.html"
}

const { id, name, username } = JSON.parse(sessionStorage.getItem(`user`));
const form = JSON.parse(sessionStorage.getItem(`formReply`));

const code = document.getElementById("accessCode");
const nameForm = document.getElementById("nameForm");
const descForm = document.getElementById("descForm");
const quiz = document.querySelector(".quiz");

if (!id || !name || !username) {
    window.location = "index.html";
}

const n = document.getElementById("nameUser");
n.innerHTML = name;

let questions = [];
let replys = [];

getForms2();


function logout() {
    sessionStorage.removeItem('user');
    window.location = "index.html";
}


async function getForms2() {
    try {
        const response = await fetch(`/forms/${form}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const result = await response.json();

        nameForm.innerHTML = result.title;
        descForm.innerHTML = result.description;
        code.innerHTML = result.accessCode;

        if (result.questions && result.questions.length > 0) {
            questions = result.questions;
        } else {
            window.location = "home.html";
        }

        buildQuiz();

    } catch (error) {
        console.error("Erro ao carregar formulário:", error);
    }
}


function buildQuiz() {
    let text = "";

    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        console.log(q.id);
        let t = "";
        
        if (q.type.toUpperCase() === "TEXT") {
            t = `
            <div class="card w1 radius24">
                
                <span class="t4 b">${i + 1}</span>
                
                <div class="boxI">
                    <span class="t4 m30">${q.question}</span>
                </div>
                <span class="t4 b m30" style="margin-left: 15px;">Responder</span>
                <textarea id="message-minimal" class="textarea-minimal radius16 m30" placeholder="Digite aqui..." oninput="upReplyText(${i},${q.id}, this.value)"></textarea>
                    
            </div>
            `;
        } else if (q.type.toUpperCase() === "RADIO") {
            t = `
            <div class="card w1 radius24">
                
                <span class="t4 b">${i + 1}</span>
                
                <div class="boxI">
                    <span class="t4 m30">
                        <span class="t4 m30">${q.question}</span>
                    </span>
                </div>
                <div class="boxI">
                    ${buildOptions(i, q.options, q.id)}
                </div>   
            </div>
            `;
        }

        text += t;
    }

    text += `
    <button class="btn radius24" style="width:100%;" onclick="submitForm()">Enviar</button>
    `;

    quiz.innerHTML = text;
}


function buildOptions(questionIndex, options, questionId){

    let txt = "";

    for(let i = 0; i < options.length; i++){

        txt += `
        <label class="an">

            <input
                type="radio"
                name="question_${questionId}"
                value="${options[i].id || i}"
                class="radio-hidden"
                onchange="upReplyRadio(${questionIndex},${questionId},${options[i].id || i}, '${options[i].option_value}')"
            >

            <div class="ipt e radius16 m30 option-card">
                ${options[i].option_value}
            </div>

        </label>
        `;
    }

    return txt;
}

function submitForm() {
    console.log("Formulário enviado!:", questions);
}

function upReplyText(questionIndex, questionId, value) {
    replys[questionIndex] = {questionId,value};
    console.log(replys);
}

function upReplyRadio(questionIndex, questionId, optionId, value) {
    replys[questionIndex] = {questionId, optionId, value};
    console.log(replys);
}

async function submitForm() {
    try {
        const response = await fetch(`/forms/register/${form}/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ replys })
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Erro ao enviar:", result.message);
            return;
        }

        window.location = "answered.html"

    } catch (e) {
        console.error("Erro ao enviar respostas:", e);
    }
}
