const authMiddleware = require('../middleware/auth');

module.exports = function(app) {

    const authController = app.controllers.AuthController;
    const projectController = app.controllers.ProjectController;

    app.get('/', authController.index);
    app.post('/register', authController.register);
    app.post('/forget-password', authController.forgetPassword);
    app.post('/reset-password', authController.resetPassword);
    app.post('/authenticate', authController.authenticate);

    app.post('/projects', authMiddleware, projectController.index);
}

