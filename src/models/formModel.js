const db = require('../connection/connection');

function createAccessCode(){

    let letters = [
        "A","B","C","D","E","F","G","H","I","J",
        "K","L","M","N","O","P","Q","R","S","T",
        "U","V","W","X","Y","Z"
    ];

    let code = "";

    for(let i = 0; i < 6; i++){

        let isNumber = true;

        if(Math.random() < 0.5){
            isNumber = false;
        }

        if(isNumber){
            code += Math.floor(Math.random() * 10);
        }else{
            code += letters[Math.floor(Math.random() * letters.length)];
        }

    }

    return code;

}

async function createForm(title, description, user_id){

    let accessCode;

    do{

        accessCode = createAccessCode();

        const sqlCheck = `
            SELECT id
            FROM forms
            WHERE accessCode = '${accessCode}'
        `;

        const [rows] = await db.execute(sqlCheck);

        if(rows.length === 0){
            break;
        }

    }while(true);

    const sql = `
        INSERT INTO forms
        (
            title,
            description,
            user_id,
            accessCode
        )
        VALUES
        (
            '${title}',
            '${description}',
            ${user_id},
            '${accessCode}'
        )
    `;

    const [result] = await db.execute(sql);

    return {
        id: result.insertId,
        accessCode: accessCode
    };

}

async function getAllForms(user_id) {

    const sql = `
        SELECT
            f.id,
            f.title,
            f.description,
            f.created_at,
            COUNT(fa.id) AS submissions
        FROM forms f
        LEFT JOIN form_answers fa
            ON fa.form_id = f.id
        WHERE f.user_id = ${user_id}
        GROUP BY
            f.id,
            f.title,
            f.description,
            f.created_at
        ORDER BY f.id DESC
    `;

    const [rows] = await db.execute(sql);

    return rows;
}

async function getFormById(id) {

    const sqlForm = `
        SELECT
            f.*,
            COUNT(fa.id) AS submissions
        FROM forms f
        LEFT JOIN form_answers fa
            ON fa.form_id = f.id
        WHERE f.id = ${id}
        GROUP BY f.id
    `;

    const [formRows] = await db.execute(sqlForm);

    if(formRows.length === 0){
        return null;
    }

    const form = formRows[0];

    const sqlQuestions = `
        SELECT *
        FROM question
        WHERE idForm = ${id}
        ORDER BY indexx
    `;

    const [questions] = await db.execute(sqlQuestions);

    for(let i = 0; i < questions.length; i++){

        const sqlOptions = `
            SELECT
                id,
                option_value,
                isTrue
            FROM options
            WHERE question_id = ${questions[i].id}
        `;

        const [options] = await db.execute(sqlOptions);

        if(options.length > 0){
            questions[i].options = options;
        }

    }

    form.questions = questions;

    return form;
}

async function getDataDashFormById(id) {

    const sqlForm = `
        SELECT
            f.*,
            COUNT(fa.id) AS submissions
        FROM forms f
        LEFT JOIN form_answers fa
            ON fa.form_id = f.id
        WHERE f.id = ${id}
        GROUP BY f.id
    `;

    const [formRows] = await db.execute(sqlForm);

    if (formRows.length === 0) {
        return null;
    }

    const form = formRows[0];

    const sqlQuestions = `
        SELECT *
        FROM question
        WHERE idForm = ${id}
        ORDER BY indexx
    `;

    const [questions] = await db.execute(sqlQuestions);

    for (let i = 0; i < questions.length; i++) {

        const sqlOptions = `
            SELECT
                o.id,
                o.option_value,
                COUNT(a.id) AS replys
            FROM options o
            LEFT JOIN answers a
                ON a.option_id = o.id
            WHERE o.question_id = ${questions[i].id}
            GROUP BY
                o.id,
                o.option_value
        `;

        const sqlTexts = `
            SELECT
                u.id AS userId,
                u.username,
                q.id AS questionId,
                q.question,
                a.answer_text
            FROM answers a
            JOIN question q
                ON q.id = a.question_id
            JOIN form_answers fa
                ON fa.id = a.form_answer_id
            JOIN users u
                ON u.id = fa.user_id
            WHERE q.id = ${questions[i].id}
        `;

        if (
            questions[i].type.toUpperCase() === "RADIO" ||
            questions[i].type.toUpperCase() === "CHECKBOX"
        ) {

            const [options] = await db.execute(sqlOptions);

            questions[i].options = options;

        } else {

            const [replys] = await db.execute(sqlTexts);

            questions[i].replys = replys;

        }

    }

    form.questions = questions;

    return form;
}



async function getFormByCode(code) {

    const sqlForm = `
        SELECT
            f.*,
            COUNT(fa.id) AS submissions
        FROM forms f
        LEFT JOIN form_answers fa
            ON fa.form_id = f.id
        WHERE f.accessCode = '${code}'
        GROUP BY f.id
    `;

    const [formRows] = await db.execute(sqlForm);

    if(formRows.length === 0){
        return null;
    }

    const form = formRows[0];

    const sqlQuestions = `
        SELECT *
        FROM question
        WHERE idForm = ${form.id}
        ORDER BY indexx
    `;

    const [questions] = await db.execute(sqlQuestions);

    for(let i = 0; i < questions.length; i++){

        const sqlOptions = `
            SELECT
                id,
                option_value,
                isTrue
            FROM options
            WHERE question_id = ${questions[i].id}
        `;

        const [options] = await db.execute(sqlOptions);

        if(options.length > 0){
            questions[i].options = options;
        }

    }

    form.questions = questions;

    return form;
}

async function deleteForm(id){

    const sql = `
        DELETE FROM forms
        WHERE id = ${id}
    `;

    const [result] = await db.execute(sql);

    return result;
}

async function createQuestion(question, indexx, points, idForm, type){

    const sql = `
        INSERT INTO question
        (
            indexx,
            question,
            points,
            idForm,
            type
        )
        VALUES
        (
            '${indexx}',
            '${question}',
            '${points}',
            '${idForm}',
            '${type}'
        )
    `;

    const [result] = await db.execute(sql);

    return result;
}

async function updateQuestion(id, indexx, question, points, type){

    const sql = `
        UPDATE question
        SET
            indexx='${indexx}',
            question='${question}',
            points='${points}',
            type='${type}'
        WHERE id=${id}
    `;

    const [result] = await db.execute(sql);

    return result;
}

async function deleteQuestion(id){

    const sql = `
        DELETE FROM question
        WHERE id=${id}
    `;

    const [result] = await db.execute(sql);

    return result;
}

async function createOption(question_id, option_value, isTrue){

    const sql = `
        INSERT INTO options
        (
            question_id,
            option_value,
            isTrue
        )
        VALUES
        (
            ${question_id},
            '${option_value}',
            ${isTrue ? 1 : 0}
        )
    `;

    const [result] = await db.execute(sql);

    return result;
}

async function updateOption(id, option_value, isTrue){

    const sql = `
        UPDATE options
        SET
            option_value='${option_value}',
            isTrue='${isTrue}'
        WHERE id=${id}
    `;

    const [result] = await db.execute(sql);

    return result;
}

async function deleteOption(id){

    const sql = `
        DELETE FROM options
        WHERE id=${id}
    `;

    const [result] = await db.execute(sql);

    return result;
}


async function getAllFormAndAnswersById(id) {

    const sqlForm = `
        SELECT
            f.*,
            COUNT(fa.id) AS submissions
        FROM forms f
        LEFT JOIN form_answers fa
            ON fa.form_id = f.id
        WHERE f.id = ${id}
        GROUP BY f.id
    `;

    const [formRows] = await db.execute(sqlForm);

    if(formRows.length === 0){
        return null;
    }

    const form = formRows[0];

    const sqlQuestions = `
        SELECT *
        FROM question
        WHERE idForm = ${form.id}
        ORDER BY indexx
    `;

    

    const [questions] = await db.execute(sqlQuestions);

    for(let i = 0; i < questions.length; i++){

    if(questions[i].type == 'radio'){

        const sqlOptions = `
            SELECT
                o.id,
                o.option_value,
                o.isTrue,
                COUNT(a.id) AS answersCount
            FROM options o
            LEFT JOIN answers a
                ON a.option_id = o.id
            WHERE o.question_id = ${questions[i].id}
            GROUP BY
                o.id,
                o.option_value,
                o.isTrue
        `;

        const [options] = await db.execute(sqlOptions);

        questions[i].options = options;

    }if(questions[i].type == 'text'){

        const sqlAnswers = `
            SELECT
                id,
                form_answer_id,
                answer_text
            FROM answers
            WHERE question_id = ${questions[i].id}
        `;

        const [answers] = await db.execute(sqlAnswers);

        questions[i].answers = answers;

    }

}
    
    

    form.questions = questions;

    return form;
}



async function updateQuestionType(id, type){

    const sql = `
        UPDATE question
        SET type = '${type}'
        WHERE id = ${id}
    `;

    const [result] = await db.execute(sql);

    return result;
}


async function create_form_answers(form_id, user_id){
    const sql = `
        INSERT INTO form_answers
        (
            form_id,
            user_id
        )
        VALUES
        (
            ${form_id},
            ${user_id}
        )
    `;

    const [result] = await db.execute(sql);

    return result;
}



async function registerTextAnswer(form_answer_id, question_id, answer_text){
    const sql = `
        INSERT INTO answers
        (
            form_answer_id,
            question_id,
            answer_text
        )
        VALUES
        (
            ${form_answer_id},
            ${question_id},
            '${answer_text}'
        )
    `;

    const [result] = await db.execute(sql);

    return result;
}


async function registerOptionAnswer(form_answer_id, question_id, option_id){
    const sql = `
        INSERT INTO answers
        (
            form_answer_id,
            question_id,
            option_id
        )
        VALUES
        (
            ${form_answer_id},
            ${question_id},
            ${option_id}
        )
    `;

    const [result] = await db.execute(sql);

    return result;
}


module.exports = {
    createForm,
    getAllForms,
    getFormById,
    getFormByCode,
    deleteForm,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    createOption,
    updateOption,
    deleteOption,
    getAllFormAndAnswersById,
    updateQuestionType,
    registerTextAnswer,
    registerOptionAnswer,
    create_form_answers,
    getDataDashFormById
};