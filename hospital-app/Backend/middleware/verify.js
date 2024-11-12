const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).send('No token provided.');
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).send('Failed to authenticate token.');
        }
        req.userId = decoded.id;
        console.log('Decoded Token:', decoded);

        req.userRole = decoded.role;
        next();
    });
};


module.exports = verifyToken;