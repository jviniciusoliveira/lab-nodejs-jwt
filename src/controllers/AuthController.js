const User = require('../models/User');
const bcrypt = require('bcryptjs');

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
                res.json(user);
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

            res.status(200).json(user);
        },
    }

    return AuthController;
}