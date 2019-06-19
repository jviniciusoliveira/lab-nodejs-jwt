const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/noderest', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
});

module.exports = mongoose;