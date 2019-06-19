const User = require('../models/User');

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
    }

    return AuthController;
}