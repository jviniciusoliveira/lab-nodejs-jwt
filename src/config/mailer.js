const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const { host, port, user, pass} = require('./mail');

const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass }
  });

const handlebarOptions = {
    viewEngine: {
        extName: '.html',
        partialsDir: './src/resource/mail/',
        layoutsDir: './src/resource/mail/',
        defaultLayout: '',
    },
    viewPath: './src/resource/mail/',
    extName: '.html',
};
/* 
  transport.use('compile', hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve('./src/resource/mail/'),
    extName: '.html',
  })); */

transport.use('compile', hbs(handlebarOptions));

module.exports = transport;