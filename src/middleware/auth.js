const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({ error: 'Token não informado!' });

    const parts = authHeader.split(' ');

    if (!parts.length === 2)
        return res.status(401).json({ error: 'Erro de token!' });

    const [ schema, token ] = parts;

    if (!/^Bearer$/i.test(schema))
        return res.status(401).json({ error: 'Token mal formatado!' });

    try {
        const decoded = jwt.verify(token, authConfig.secret);
        req.userId = decoded.id;
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido!' })
    }

    next();
}