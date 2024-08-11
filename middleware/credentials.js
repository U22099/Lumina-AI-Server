const allowedOrigins = [
    "https://u22099.github.io", 
    "http://localhost:5173",
    "https://https://2drl3r-5173.csb.app"
];

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if(allowedOrigins.includes(origin)||!origin){
        res.setHeader('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials