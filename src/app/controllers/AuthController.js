module.exports = function(app) {

    var AuthController = {

        register: function(req, res) {
            res.send('Register');
        },

    }

    return AuthController;
}