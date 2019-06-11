module.exports = function(app) {

    const authController = app.controllers.AuthController;

    app.get('/', (req, res) => {
        res.send('Rota Ok');
    });

    app.get('/register', authController.register);
}