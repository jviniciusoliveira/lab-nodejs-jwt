const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

function generateToken(params = {}) {
    return jwt.sign( params, authConfig.secret, {
        expiresIn: 86400,
    });
}

module.exports = function(app) {

    const AuthController = {

        index: (req, res) => {
            res.json('Index');
        },

        register: async (req, res) => {
            const { email } = req.body;
            try {
                if (await User.findOne({ email }))
                    throw new Error('E-mail já cadastrado!');

                const user = await User.create(req.body);
                user.password = undefined;
                
                res.status(200).json({ 
                    user, 
                    token: generateToken({ id: user.id })
                });

            } catch (e) {
                res.status(400).json({ error: e.message });
            } 
        },

        authenticate: async (req, res) => {
            const { email, password } = req.body;
            const user = await User.findOne({ email }).select('+password');

            if (! user)
                return res.status(400).json({ error: 'Usuário não encontrado!' });

            if (! await bcrypt.compare(password, user.password))
                return res.status(400).json({ error: 'Senha inválida!' });

            user.password = undefined;

            res.status(200).json({ 
                user, 
                token: generateToken({ id: user.id })
            });
        },
    }

    return AuthController;
}