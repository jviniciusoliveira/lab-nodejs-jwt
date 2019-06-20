const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypt = require('crypto');
const mailer = require('../config/mailer');

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

            if (!user)
                return res.status(400).json({ error: 'Usuário não encontrado!' });

            if (! await bcrypt.compare(password, user.password))
                return res.status(400).json({ error: 'Senha inválida!' });

            user.password = undefined;

            res.status(200).json({ 
                user, 
                token: generateToken({ id: user.id })
            });
        },

        forgetPassword: async (req, res) => {
            const { email } = req.body;

            try {
                const user = await User.findOne({ email });

                if (!user) 
                    return res.status(400).json({ error: 'Usuário não encontrado!' });
                
                const token = crypt.randomBytes(20).toString('hex');

                const now = new Date();
                now.setHours(now.getHours() + 1);

                await User.findByIdAndUpdate(user.id, {
                    '$set': {
                        passwordResetToken: token,
                        passwordResetExpires: now,
                    }
                });

                mailer.sendMail({
                    to: email,
                    from: 'jv@gmail.com',
                    template: 'auth/forget-password',
                    context: { token },
                }, (err) => {
                    if (err)
                        return res.status(400).json({ error: 'Não foi possível enviar email de recuperação de senha. Tente novamente.' });

                    return res.json();
                });
            } catch (error) {
                res.status(400).json({ error: 'Erro. Tente novamente!' });
            }
        },

        resetPassword: async (req, res) => {
            const { email, token, password } = req.body;

            try {
                const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires');

                if (!user) 
                    return res.status(400).json({ error: 'Usuário não encontrado!' });

                if (token !== user.passwordResetToken)
                    return res.status(400).json({ error: 'Token inválido!' });

                const now = new Date();

                if (now > user.passwordResetExpires)
                    return res.status(400).json({ error: 'Token Expirado! Favor gerar um novo.' });

                user.password = password;
                await user.save();

                res.json({ success: true });
            } catch (error) {
                res.status(400).json({ error: 'Erro. Tente novamente!' });
            }
        },
    }

    return AuthController;
}