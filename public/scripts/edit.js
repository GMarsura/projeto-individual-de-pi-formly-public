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
            const created = await api("/questions", "POST", {
                indexx: 0,
                question: "Nova questão",
                points: 0,
                idForm: form,
                type: "TEXT"
            });
            questions = [{
                id: created.insertId,
                indexx: 0,
                question: "Nova questão",
                points: 0,
                idForm: form,
                type: "TEXT"
            }];
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
        let t = "";
        
        if (q.type.toUpperCase() === "TEXT") {
            t = `
            <div class="card w1 radius24">
                <div style="display:flex;flex-direction:row;align-items:center;justify-content:space-between;">
                    <span class="t4 b">${i + 1}</span>
                    <div class="controllers">
                        <span class="t4 b">Respostas do tipo: </span>
                        <div class="selectBox">
                            <select onchange="upType(${i})">
                                <option selected>Texto</option>
                                <option>Opções</option>
                            </select>
                        </div>
                        <img src="../images/icons/trash.svg" alt="" onclick="deleteQuestion(${i})">
                    </div>
                </div>
                <div class="boxI">
                    <textarea class="textarea-minimal radius16 m30"
                        placeholder="Digite aqui sua questão..."
                        oninput="upQuestion(${i}, this.value)">${q.question}</textarea>
                </div>
            </div>`;
        } else if (q.type.toUpperCase() === "RADIO") {
            t = `
            <div class="card w1 radius24">
                <div style="display:flex;flex-direction:row;align-items:center;justify-content:space-between;">
                    <span class="t4 b">${i + 1}</span>
                    <div class="controllers">
                        <span class="t4 b">Respostas do tipo:</span>
                        <div class="selectBox">
                            <select onchange="upType(${i})">
                                <option>Texto</option>
                                <option selected>Opções</option>
                            </select>
                        </div>
                        <img src="../images/icons/trash.svg" alt="" onclick="deleteQuestion(${i})">
                    </div>
                </div>
                <div class="boxI">
                    <textarea class="textarea-minimal radius16 m30"
                        placeholder="Digite aqui sua questão..."
                        oninput="upQuestion(${i}, this.value)">${q.question}</textarea>
                </div>
                <div class="boxI">
                    ${buildOptions(q.options || [], i)}
                </div>
                <button class="btn m30" style="width:20%;" onclick="addOp(${i})">
                    Nova alternativa
                </button>
            </div>`;
        }

        text += t;
       
    }
     text += `
            <button class="btn" style="width: 100%;" onclick="addQuestion()">Adcionar Nova questão</button>
        `
    quiz.innerHTML = text;
}


function buildOptions(options, questionIndex) {
    let txt = "";

    for (let i = 0; i < options.length; i++) {
        txt += `
        <div class="an">
            <input
                class="ipt e radius16 m30"
                value="${options[i].option_value}"
                placeholder="Digite aqui sua opção..."
                oninput="upOp(${questionIndex}, ${i}, this.value)"
            >
            <div class="controller m30">
                <div
                    class="correct ${options[i].isTrue ? 'purple bpurple' : ''}"
                    onclick="setCorrect(${questionIndex}, ${i})"
                >
                    <img src="../images/icons/check.svg" alt="">
                </div>
                <img
                    src="../images/icons/trash.svg"
                    style="transform:scale(1.2);"
                    onclick="deleteOp(${questionIndex}, ${i})"
                >
            </div>
        </div>`;
    }
    
    return txt;
}


async function api(url, method, body) {
    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined
    });
    if (!response.ok) throw new Error(`Erro ${response.status} em ${method} ${url}`);
    return await response.json();
}


async function addQuestion() {
    try {
        const question = {
            indexx: 0,
            question: "Nova questão",
            points: 0,
            idForm: form,
            type: "TEXT"
        };

        const result = await api("/questions", "POST", question);
        question.id = result.insertId;

        questions.push(question);
        buildQuiz();
    } catch (e) {
        console.error("Erro ao adicionar questão:", e);
    }
}


async function deleteQuestion(i) {
    try {
        if (questions[i].id) {
            await api(`/questions/${questions[i].id}`, "DELETE");
        }

        questions.splice(i, 1);
        buildQuiz();
    } catch (e) {
        console.error("Erro ao deletar questão:", e);
    }
}


async function upType(i) {
    try {
        if (questions[i].type.toUpperCase() === "TEXT") {
            questions[i].type = "RADIO";
        } else {
            questions[i].type = "TEXT";
            delete questions[i].options;
        }

        if (questions[i].id) {
            await api(`/questions/${questions[i].id}`, "PUT", {
                indexx: 0,
                question: questions[i].question,
                points: questions[i].points,
                type: questions[i].type
            });
        }
        getForms2();
    } catch (e) {
        console.error("Erro ao atualizar tipo:", e);
    }
}


async function upQuestion(i, value) {
    try {
        questions[i].question = value;

        if (questions[i].id) {
            await api(`/questions/${questions[i].id}`, "PUT", {
                indexx: 0,
                question: value,
                points: questions[i].points,
                type: questions[i].type
            });
        }
    } catch (e) {
        console.error("Erro ao atualizar questão:", e);
    }
}


async function addOp(questionIndex) {
    try {
        if (!questions[questionIndex].options) questions[questionIndex].options = [];

        const option = { option_value: "Nova opção", isTrue: false };

        if (questions[questionIndex].id) {
            const result = await api("/options", "POST", {
                question_id: questions[questionIndex].id,
                option_value: option.option_value,
                isTrue: false
            });
            option.id = result.insertId;
        }

        questions[questionIndex].options.push(option);
        getForms2();
        
    } catch (e) {
        console.error("Erro ao adicionar opção:", e);
    }
}


async function deleteOp(questionIndex, optionIndex) {
    try {
        const op = questions[questionIndex].options[optionIndex];

        if (op.id) {
            await api(`/options/${op.id}`, "DELETE");
        }

        questions[questionIndex].options.splice(optionIndex, 1);
        getForms2();
    } catch (e) {
        console.error("Erro ao deletar opção:", e);
    }
}


async function upOp(questionIndex, optionIndex, value) {
    try {
        const option = questions[questionIndex].options[optionIndex];
        option.option_value = value;

        if (option.id) {
            await api(`/options/${option.id}`, "PUT", {
                option_value: value,
                isTrue: option.isTrue
            });
        }
    } catch (e) {
        console.error("Erro ao atualizar opção:", e);
    }
}

function redirect(txt){
    window.location = txt;
}