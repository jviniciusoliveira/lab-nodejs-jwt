const express = require('express');
const bodyParser = require('body-parser');
const consign = require('consign');

module.exports = function() {

    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    consign({cwd: 'src/app'})
        .include('controllers')
        .include('routes')
        .into(app);

    return app;
}

