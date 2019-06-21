const authMiddleware = require('../middleware/auth');

module.exports = function(app) {

    const authController = app.controllers.AuthController;
    const projectController = app.controllers.ProjectController;

    app.get('/', authController.index);
    app.post('/register', authController.register);
    app.post('/forget-password', authController.forgetPassword);
    app.post('/reset-password', authController.resetPassword);
    app.post('/authenticate', authController.authenticate);

    app.get('/projects', authMiddleware, projectController.index);
    app.get('/projects/:projectId', authMiddleware, projectController.show);
    app.post('/projects', authMiddleware, projectController.store);
    app.delete('/projects/:projectId', authMiddleware, projectController.destroy);
}

