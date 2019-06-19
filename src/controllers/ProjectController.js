
module.exports = function(app) {

    const ProjectController = {

        index: (req, res) => {
            res.json({
                rota: 'Index Project',
                id: req.userId
            })
        }
    }

    return ProjectController;
}