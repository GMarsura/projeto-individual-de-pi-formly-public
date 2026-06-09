const model = require('../models/authModel');

async function signup(req, res) {
    try {

        const { name, username, password } = req.body;

        await model.signup(name, username, password);

        res.status(201).json({
            message: 'Usuário cadastrado com sucesso'
        });

    } catch (error) {

        res.status(500).json({
            message: "Este usuário já existe"
        });

    }
}

async function login(req, res) {
    try {

        const { username, password } = req.body;

        const user = await model.login(username, password);

        if(user.length === 0){
            return res.status(401).json({
                message: 'Usuário ou senha inválidos'
            });
        }

        res.status(200).json(user[0]);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
}

module.exports = {
    signup,
    login
};