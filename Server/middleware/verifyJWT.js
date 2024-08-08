const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const token = req.headers.Authorization?.split(' ')[1] || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.sendStatus(401)
    };
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) return res.status(403).json({'message': 'Wrong Token'});
            req.username = decoded.username;
            next()
        }
    );
}

module.exports = verifyJWT;
