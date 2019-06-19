module.exports = function(app) {

    const authController = app.controllers.AuthController;

    app.get('/', authController.index);

    app.post('/register', authController.register);

    app.post('/authenticate', authController.authenticate);
}