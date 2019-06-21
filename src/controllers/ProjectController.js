const Project = require('../models/Project');
const Task = require('../models/Task');


module.exports = function(app) {

    const ProjectController = {

        index: async (req, res) => {
            try {
                const projects = await Project.find().populate('user');
                return res.json({ projects });
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
        },

        show: async (req, res) => {
            try {
                const project = await Project.findById(req.params.projectId).populate('user');
                return res.json({ project });    
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
        },

        store: async (req, res) => {
            try {
                const project = await Project.create({ ...req.body, user: req.userId });
                return res.json({ project });
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
        },

        update: async (req, res) => {

        },

        destroy: async (req, res) => {
            try {
                await Project.findByIdAndRemove(req.params.projectId);
                return res.json({ success: true });
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
        },
    }

    return ProjectController;
}