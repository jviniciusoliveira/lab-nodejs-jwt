const Project = require('../models/Project');
const Task = require('../models/Task');


module.exports = function(app) {

    const ProjectController = {

        index: async (req, res) => {
            try {
                const projects = await Project.find().populate(['user', 'tasks']);
                return res.json({ projects });
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
        },

        show: async (req, res) => {
            try {
                const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);
                return res.json({ project });    
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
        },

        store: async (req, res) => {
            try {
                const { title, description, tasks } = req.body;
                const project = await Project.create({ title, description, user: req.userId });

                await Promise.all(tasks.map(async task => {
                    const projectTask = await Task.create({ ...task, project: project._id });
                    project.tasks.push(projectTask);
                }));

                await project.save();

                return res.json({ project });
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
        },

        update: async (req, res) => {
            try {
                const { title, description, tasks } = req.body;
                const project = await Project.findByIdAndUpdate(req.params.projectId, { 
                    title, 
                    description
                }, { new: true });

                project.tasks = [];
                await Task.deleteMany({ project: project._id });

                await Promise.all(tasks.map(async task => {
                    const projectTask = await Task.create({ ...task, project: project._id });
                    project.tasks.push(projectTask);
                }));

                await project.save();

                return res.json({ project });
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
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