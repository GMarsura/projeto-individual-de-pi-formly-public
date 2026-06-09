if (!sessionStorage.getItem(`user`) || !JSON.parse(sessionStorage.getItem(`formEdit`))) {
    window.location = "index.html"
}

const { id, name, username } = JSON.parse(sessionStorage.getItem(`user`));
const form = JSON.parse(sessionStorage.getItem(`formEdit`));

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
        const response = await fetch(`/forms/dash/${form}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const result = await response.json();
        console.log(result)
        nameForm.innerHTML = result.title;
        descForm.innerHTML = result.description;
        code.innerHTML = result.accessCode;
        countSubmissions.innerHTML = result.submissions;

        if (result.questions && result.questions.length > 0) {
            questions = result.questions;
        } else {
            window.location = "home.hltml"
        }

        buildQuiz();

    } catch (error) {
        console.error("Erro ao carregar formulário:", error);
    }
}


function calcTotRepsOptions(options){
    let c = 0;
    for(let i = 0; i< options.length; i++){
            c += options[i].replys;
    }
    return c;
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
                
                <span class="t4 b">${i+1}</span>
                <span class="t5 b green" style="margin-top:10px;">${q.replys.length} Respostas</span>
                <div class="boxI">
                    <span class="t4 m30">${q.question}</span>
                </div>
                <span class="t4 b m30" style="margin-left: 15px;">Respostas</span>
                ${buildReplys(q.replys)}    
            </div>
            `;
        } else if (q.type.toUpperCase() === "RADIO") {
            t = `
            <div class="card w1 radius24">
                
                <span class="t4 b">${i + 1}</span>
                <span class="t5 b green" style="margin-top:10px;">${calcTotRepsOptions(q.options)} Respostas</span>
                
                <div class="boxI">
                    <span class="t4 m30">
                        <span class="t4 m30">${q.question}</span>
                    </span>
                </div>
                <div class="boxI">
                    ${buildOptions(q.options)}
                </div>
                <div class="boxI m30">
                    ${buildOptionsChart(q.options, q.id)}
                </div>
                
            </div>
            `;
        }

        text += t;
    }


    quiz.innerHTML = text;
}


function buildOptions(options){
    let txt = "";
    console.log(options)
    for(let i = 0; i < options.length; i++){

        txt += `
        <span class="t5 b m30 green" style="margin-left: 15px;">${options[i].replys} Respostas em</span>
        <div class="box radius16" style="margin-top: 5px;">
            <span class="t5">${options[i].option_value}</span>
        </div>
        `;
    }

    return txt;
}


function buildOptionsChart(options, questionIndex) {
    const canvasId = `chart-${questionIndex}`;

    const labels = options.map(o => o.option_value);
    const data = options.map(o => o.replys);

    setTimeout(() => {
        const ctx = document.getElementById(canvasId).getContext("2d");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: "Respostas",
                    data,
                    backgroundColor: "rgba(99, 102, 241, 0.7)",
                    borderColor: "rgba(99, 102, 241, 1)",
                    borderWidth: 1,
                    borderRadius: 8
                }]
            },
            options: {
                indexAxis: "y",
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });
    }, 0);

    return `<canvas id="${canvasId}" style="width:100%;max-height:200px;"></canvas>`;
}




function buildReplys(replys){
    let txt = "";
    
    for(let i = 0; i < replys.length; i++){

        txt += `
        <span class="t5 b m30" style="margin-left: 15px;">${replys[i].username}</span>
        <div class="box radius16" style="margin-top: 5px;">
            <span class="t5">${replys[i].answer_text}</span>
        </div>
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

        console.log("Respostas enviadas com sucesso!", result.message);

    } catch (e) {
        console.error("Erro ao enviar respostas:", e);
    }
}

function redirect(txt){
    window.location = txt;
}


