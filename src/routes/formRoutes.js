const express = require('express');

const router = express.Router();

const controller = require('../controllers/formController');



router.post('/forms', controller.createForm);

router.post('/forms/register/:formId/:userId', controller.registerAnswers);

router.get('/allforms/:user_id', controller.getAllForms);

router.get('/forms/:id', controller.getFormById);

router.get('/forms/dash/:id', controller.getDataDashFormById);

router.get('/forms/answers/:id', controller.getAllFormAndAnswersById);

router.get('/forms/code/:code', controller.getFormByCode);

router.delete('/forms/:id', controller.deleteForm);

router.post('/questions', controller.createQuestion);

router.put('/questions/type/:id', controller.updateQuestionType);

router.put('/questions/:id', controller.updateQuestion);

router.delete('/questions/:id', controller.deleteQuestion);


router.post('/options', controller.createOption);

router.put('/options/:id', controller.updateOption);

router.delete('/options/:id', controller.deleteOption);

module.exports = router;