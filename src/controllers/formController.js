const model = require('../models/formModel');



async function createForm(req, res){

    try{

        const {
            title,
            description,
            user_id
        } = req.body;

        await model.createForm(
            title,
            description,
            user_id
        );

        res.status(201).json({
            message: 'Formulário criado'
        });

    }catch(error){

        res.status(500).json({
            message: error.message
        });

    }

}

async function getAllForms(req, res){
    const {user_id} = req.params;
    try{

        const forms = await model.getAllForms(user_id);
        res.status(200).json(forms);

    }catch(error){

        res.status(500).json({
            message: error.message
        });

    }

}

async function getFormById(req, res){

    try{

        const { id } = req.params;

        const form = await model.getFormById(id);

        if(!form){
            return res.status(404).json({
                message: 'Formulário não encontrado'
            });
        }

        res.status(200).json(form);

    }catch(error){

        res.status(500).json({
            message: error.message
        });

    }

}


async function getFormByCode(req, res){

    try{

        const { code } = req.params;

        const form = await model.getFormByCode(code);

        if(!form){
            return res.status(404).json({
                message: 'Formulário não encontrado'
            });
        }

        res.status(200).json(form);

    }catch(error){

        res.status(500).json({
            message: error.message
        });

    }

}

async function deleteForm(req, res){

    try{

        const { id } = req.params;

        await model.deleteForm(id);

        res.status(200).json({
            message: 'Formulário removido'
        });

    }catch(error){

        res.status(500).json({
            message: error.message
        });

    }

}

async function createQuestion(req, res) {
    try {
        const { question, points, idForm, type, indexx } = req.body;

        const result = await model.createQuestion(question, indexx, points, idForm, type);

        res.status(201).json({
            message: 'Questão criada',
            insertId: result.insertId
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


async function updateQuestion(req,res){

    try{

        const { id } = req.params;

        const {
            question,
            points,
            type,
            indexx
        } = req.body;

        await model.updateQuestion(id, indexx, question, points, type);

        res.status(200).json({
            message:'Questão atualizada'
        });

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

}


async function deleteQuestion(req,res){

    try{

        const { id } = req.params;

        await model.deleteQuestion(id);

        res.status(200).json({
            message:'Questão removida'
        });

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

}

async function createOption(req,res){

    try{

        const {
            question_id,
            option_value,
            isTrue
        } = req.body;

        await model.createOption(
            question_id,
            option_value,
            isTrue
        );

        res.status(201).json({
            message:'Opção criada'
        });

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

}

async function updateOption(req,res){

    try{

        const { id } = req.params;

        const {
            option_value,
            isTrue
        } = req.body;

        await model.updateOption(
            id,
            option_value,
            isTrue
        );

        res.status(200).json({
            message:'Opção atualizada'
        });

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

}

async function deleteOption(req,res){

    try{

        const { id } = req.params;

        await model.deleteOption(id);

        res.status(200).json({
            message:'Opção removida'
        });

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

}

async function getAllFormAndAnswersById(req, res){

    try{

        const { id } = req.params;

        const form = await model.getAllFormAndAnswersById(id);

        if(!form){
            return res.status(404).json({
                message: 'Formulário não encontrado'
            });
        }

        res.status(200).json(form);

    }catch(error){

        res.status(500).json({
            message: error.message
        });

    }

}


async function updateQuestionType(req, res){

    try{

        const { id } = req.params;
        const { type } = req.body;

        await model.updateQuestionType(id, type);

        res.status(200).json({
            message: 'Tipo atualizado'
        });

    }catch(error){

        res.status(500).json({
            message: error.message
        });

    }

}


async function registerAnswers(req, res) {
    try {
        const { formId, userId } = req.params;
        const { replys } = req.body;

        const form_answer = await model.create_form_answers(formId, userId);

        for (let i = 0; i < replys.length; i++) {
            const r = replys[i];

            if (r.optionId !== undefined) {
                await model.registerOptionAnswer(form_answer.insertId, r.questionId, r.optionId);
            } else if (r.value && r.value !== '') {
                await model.registerTextAnswer(form_answer.insertId, r.questionId, r.value);
            }
        }

        res.status(201).json({ message: "Respostas registradas" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getDataDashFormById(req, res) {

    try {

        const { id } = req.params;

        const data = await model.getDataDashFormById(id);

        if (!data) {
            return res.status(404).json({
                message: 'Formulário não encontrado'
            });
        }

        return res.status(200).json(data);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: 'Erro interno do servidor'
        });

    }

}

module.exports = {
    createForm,
    getAllForms,
    getFormById,
    deleteForm,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    createOption,
    updateOption,
    deleteOption,
    getAllFormAndAnswersById,
    getFormByCode,
    updateQuestionType,
    registerAnswers,
    getDataDashFormById
};